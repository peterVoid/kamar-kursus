import { DEFAULT_LIMIT, DEFAULT_PAGE_SIZE } from "@/constans";
import { env } from "@/env";
import prisma from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { adminProcedure, createTRPCRouter, userProcedure } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import Stripe from "stripe";
import z from "zod";

export const enrollmentRouter = createTRPCRouter({
  adminGetAllEnrollmentsCourses: adminProcedure
    .input(
      z.object({
        page: z.number().default(1),
        pageSize: z.number().default(DEFAULT_PAGE_SIZE),
      })
    )
    .query(async ({ input }) => {
      const { page, pageSize } = input;

      const offset = (page - 1) * pageSize;

      const totalItems = await prisma.enrollment.count();

      const totalPages = Math.ceil(totalItems / pageSize);

      const purchasedCourses = await prisma.enrollment.findMany({
        select: {
          status: true,
          amount: true,
          User: {
            select: {
              name: true,
              email: true,
            },
          },
          Course: {
            select: {
              title: true,
              price: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        skip: offset,
        take: pageSize,
      });

      return {
        items: purchasedCourses,
        pagination: {
          totalItems,
          totalPages,
          currentPage: page,
        },
      };
    }),
  enrolledCourseDetails: userProcedure
    .input(
      z.object({
        slug: z.string().min(1),
      })
    )
    .query(async ({ input, ctx }) => {
      const { slug } = input;
      const { user } = ctx;

      const existingCourse = await prisma.course.findUnique({
        where: {
          slug,
        },
        select: {
          id: true,
          title: true,
          category: true,
          chapters: {
            select: {
              id: true,
              title: true,
              position: true,
              lessons: {
                select: {
                  id: true,
                  title: true,
                  thumbnailKey: true,
                  videoKey: true,
                  description: true,
                  position: true,
                  completedLessons: {
                    where: {
                      userId: user.id,
                    },
                    select: {
                      id: true,
                    },
                  },
                },
                orderBy: {
                  position: "asc",
                },
              },
            },
            orderBy: {
              position: "asc",
            },
          },
        },
      });

      if (!existingCourse) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Course not found",
        });
      }

      const userHasEnrolled = await prisma.enrollment.findUnique({
        where: {
          userId_courseId: {
            courseId: existingCourse.id,
            userId: user.id,
          },
        },
      });

      if (!userHasEnrolled) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You have not purchasing this course",
        });
      }

      return existingCourse;
    }),
  userHasEnrolled: userProcedure
    .input(
      z.object({
        limit: z.number().default(DEFAULT_LIMIT),
        cursor: z.string().nullish(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { user } = ctx;
      const { limit, cursor } = input;

      const courses = await prisma.enrollment.findMany({
        where: {
          userId: user.id,
        },
        take: limit + 1,
        select: {
          id: true,
          Course: {
            select: {
              id: true,
              fileKey: true,
              level: true,
              title: true,
              duration: true,
              shortDescription: true,
              slug: true,
              chapters: {
                select: {
                  lessons: {
                    select: {
                      id: true,
                      completedLessons: {
                        where: {
                          userId: user.id,
                        },
                      },
                    },
                    orderBy: {
                      position: "asc",
                    },
                  },
                },
              },
            },
          },
        },
        ...(cursor && {
          cursor: {
            id: cursor,
          },
        }),
        orderBy: {
          createdAt: "desc",
        },
      });

      const lastItem = courses.length > limit ? courses[limit].id : null;

      return {
        nextCursor: lastItem,
        items: courses.slice(0, limit),
      };
    }),
  enroll: userProcedure
    .input(
      z.object({
        courseId: z.string().min(1),
        amount: z.number().min(1),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { courseId, amount } = input;

      const existingCourse = await prisma.course.findFirst({
        where: {
          id: courseId,
        },
      });

      if (!existingCourse) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Course not found",
        });
      }

      let stripeCustomerId;

      const userData = await prisma.user.findFirst({
        where: {
          id: ctx.user.id,
        },
        select: {
          stripeCustomerId: true,
          email: true,
          id: true,
          name: true,
          image: true,
        },
      });

      if (!userData) return null;

      if (userData.stripeCustomerId) {
        stripeCustomerId = userData.stripeCustomerId;
      } else {
        const createStripeCustomerId = await stripe.customers.create({
          email: userData.email,
          name: userData.name,
          metadata: {
            id: userData.id,
          },
        });

        await prisma.user.update({
          where: {
            id: userData.id,
          },
          data: {
            stripeCustomerId: createStripeCustomerId.id,
          },
        });

        stripeCustomerId = createStripeCustomerId.id;
      }

      let enrollmentId;

      const existingUserEnrollment = await prisma.enrollment.findUnique({
        where: {
          userId_courseId: {
            userId: ctx.user.id,
            courseId,
          },
        },
      });

      if (existingUserEnrollment) {
        await prisma.enrollment.update({
          where: {
            userId_courseId: {
              userId: ctx.user.id,
              courseId,
            },
          },
          data: {
            status: "Pending",
          },
        });

        enrollmentId = existingUserEnrollment.id;
      } else {
        const createdEnrollment = await prisma.enrollment.create({
          data: {
            userId: ctx.user.id,
            courseId,
            amount,
            status: "Pending",
          },
        });

        enrollmentId = createdEnrollment.id;
      }

      try {
        const checkoutSession = await stripe.checkout.sessions.create({
          customer: stripeCustomerId,
          currency: "usd",
          line_items: [
            {
              price: existingCourse.stripePriceId,
              quantity: 1,
            },
          ],
          mode: "payment",
          success_url: `${env.NEXT_PUBLIC_BASE_URL}/payment/success`,
          cancel_url: `${env.NEXT_PUBLIC_BASE_URL}/payment/cancel`,
          metadata: {
            userId: ctx.user.id,
            courseId: existingCourse.id,
            enrollmentId,
          },
        });

        return checkoutSession;
      } catch (error) {
        if (error instanceof Stripe.errors.StripeAPIError) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to checkout, Please try again later.",
          });
        }

        console.log(error);

        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Something went wrong",
        });
      }
    }),
});
