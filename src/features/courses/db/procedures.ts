import { adminProcedure, createTRPCRouter } from "@/trpc/init";
import { courseSchema } from "../zod-schema";
import { TRPCError } from "@trpc/server";
import prisma from "@/lib/prisma";
import { CourseLevel, CourseStatus } from "@/generated/prisma";
import z from "zod";

export const courseRouter = createTRPCRouter({
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
        stripePriceId: "",
      },
    });

    return createdCourse;
  }),
  getManyAdmin: adminProcedure.query(async () => {
    const courses = await prisma.course.findMany({
      select: {
        id: true,
        fileKey: true,
        title: true,
        shortDescription: true,
        duration: true,
        level: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return courses;
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
});
