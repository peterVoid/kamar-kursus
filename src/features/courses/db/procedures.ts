import { CourseLevel, CourseStatus } from "@/generated/prisma";
import prisma from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { generateCourseImageUrl } from "@/lib/utils";
import { adminProcedure, baseProcedure, createTRPCRouter } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import z from "zod";
import { courseSchema } from "../zod-schema";
import { DEFAULT_LIMIT } from "@/constans";

export const courseRouter = createTRPCRouter({
  delete: adminProcedure
    .input(
      z.object({
        id: z.string().min(1),
      })
    )
    .mutation(async ({ input }) => {
      const { id } = input;

      const existingCourse = await prisma.course.findFirst({
        where: {
          id,
        },
      });

      if (!existingCourse) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "cOURSE NOT FOUND",
        });
      }

      const deletedCourse = await prisma.course.delete({
        where: {
          id,
        },
      });

      return deletedCourse;
    }),
  create: adminProcedure.input(courseSchema).mutation(async ({ input }) => {
    const validation = courseSchema.safeParse(input);

    if (!validation.success) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Data not match",
      });
    }

    const {
      category,
      duration,
      level,
      price,
      shortDescription,
      slug,
      status,
      title,
      description,
      fileKey,
    } = validation.data;

    const existingSlug = await prisma.course.findUnique({
      where: {
        slug,
      },
    });

    if (existingSlug) {
      throw new TRPCError({
        code: "BAD_GATEWAY",
        message: "Slug already taken.",
      });
    }

    const productObject = await stripe.products.create({
      name: title,
      default_price_data: {
        currency: "usd",
        unit_amount: price * 100,
      },
      metadata: {
        slug,
      },
      ...(fileKey && {
        images: [generateCourseImageUrl(fileKey)],
      }),
    });

    const createdCourse = await prisma.course.create({
      data: {
        title,
        category,
        duration,
        level: level as CourseLevel,
        price,
        description: description as string,
        fileKey: fileKey as string,
        shortDescription,
        slug,
        status: status as CourseStatus,
        stripePriceId: productObject.default_price as string,
      },
    });

    return createdCourse;
  }),
  getMany: baseProcedure
    .input(
      z.object({
        limit: z.number().default(DEFAULT_LIMIT),
        cursor: z.string().nullish(),
      })
    )
    .query(async ({ input }) => {
      const { limit, cursor } = input;

      const courses = await prisma.course.findMany({
        where: {
          status: "Publish",
        },
        select: {
          id: true,
          fileKey: true,
          title: true,
          shortDescription: true,
          duration: true,
          level: true,
          slug: true,
        },
        ...(cursor && {
          cursor: {
            id: cursor ?? undefined,
          },
        }),

        take: limit + 1,
        orderBy: {
          createdAt: "desc",
        },
      });

      const lastItem = courses.length > limit ? courses[limit]?.id : null;

      return {
        nextCursor: lastItem,
        items: courses.slice(0, limit),
      };
    }),
  getOneAdmin: adminProcedure
    .input(
      z.object({
        id: z.string().min(1),
      })
    )
    .query(async ({ input }) => {
      const { id } = input;

      const course = await prisma.course.findFirst({
        where: {
          id,
        },
        select: {
          title: true,
          category: true,
          duration: true,
          level: true,
          price: true,
          description: true,
          fileKey: true,
          shortDescription: true,
          slug: true,
          status: true,
          chapters: {
            select: {
              id: true,
              position: true,
              title: true,
              lessons: {
                select: {
                  id: true,
                  title: true,
                  position: true,
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

      if (!course) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Course not found",
        });
      }

      return course;
    }),

  update: adminProcedure
    .input(
      z
        .object({
          id: z.string().min(1),
        })
        .extend(courseSchema.shape)
    )
    .mutation(async ({ input }) => {
      const { id } = input;

      const existingCourse = await prisma.course.findFirst({
        where: {
          id,
        },
      });

      if (!existingCourse) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Course not found",
        });
      }

      const updatedCourse = await prisma.course.update({
        where: {
          id,
        },
        data: {
          ...input,
          level: input.level as CourseLevel,
          status: input.status as CourseStatus,
        },
      });

      return updatedCourse;
    }),
  getOnePublic: baseProcedure
    .input(
      z.object({
        slug: z.string().min(1),
      })
    )
    .query(async ({ input }) => {
      const { slug } = input;

      const course = await prisma.course.findFirst({
        where: {
          slug,
        },
        select: {
          id: true,
          title: true,
          category: true,
          duration: true,
          level: true,
          price: true,
          description: true,
          fileKey: true,
          shortDescription: true,
          slug: true,
          status: true,
          chapters: {
            select: {
              id: true,
              position: true,
              title: true,
              lessons: {
                select: {
                  id: true,
                  title: true,
                  position: true,
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

      if (!course) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Course not found",
        });
      }

      return course;
    }),
});
