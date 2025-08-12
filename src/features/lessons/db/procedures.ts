import prisma from "@/lib/prisma";
import { adminProcedure, createTRPCRouter, userProcedure } from "@/trpc/init";
import z from "zod";
import { lessonDetailsSchema, newLessonSchema } from "../zod-schema";
import { TRPCError } from "@trpc/server";

export const lessonRouter = createTRPCRouter({
  userMarkLesson: userProcedure
    .input(
      z.object({
        id: z.string().min(1),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { id } = input;
      const { user } = ctx;

      const userHasCompleted = await prisma.completedLesson.findUnique({
        where: {
          lessonId_userId: {
            userId: user.id,
            lessonId: id,
          },
        },
      });

      if (userHasCompleted) {
        const deletedCompletedLesson = await prisma.completedLesson.delete({
          where: {
            id: userHasCompleted.id,
          },
        });

        return deletedCompletedLesson;
      }

      const createdCompletedLesson = await prisma.completedLesson.create({
        data: {
          userId: user.id,
          lessonId: id,
        },
      });

      return createdCompletedLesson;
    }),
  getOneUserEnrolledCourse: userProcedure
    .input(
      z.object({
        id: z.string().min(1),
      })
    )
    .query(async ({ input, ctx }) => {
      const { id } = input;
      const { user } = ctx;

      const lesson = await prisma.lesson.findFirst({
        where: {
          id,
        },
        select: {
          id: true,
          thumbnailKey: true,
          videoKey: true,
          title: true,
          description: true,
          completedLessons: {
            where: {
              userId: user.id,
            },
          },
        },
      });

      if (!lesson) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Lesson not found",
        });
      }

      return lesson;
    }),
  getOne: adminProcedure
    .input(
      z.object({
        id: z.string().min(1),
      })
    )
    .query(async ({ input }) => {
      const { id } = input;

      const existingLesson = await prisma.lesson.findFirst({
        where: {
          id,
        },
        select: {
          title: true,
          thumbnailKey: true,
          videoKey: true,
          description: true,
        },
      });

      if (!existingLesson) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Lesson not found",
        });
      }

      return existingLesson;
    }),
  addLessonDetails: adminProcedure
    .input(
      z
        .object({
          id: z.string().min(1),
        })
        .extend(lessonDetailsSchema.shape)
    )
    .mutation(async ({ input }) => {
      const { id, title, description, thumbnailKey, videoKey } = input;

      const existingLesson = await prisma.lesson.findFirst({
        where: {
          id,
        },
      });

      if (!existingLesson) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Lesson not found",
        });
      }

      const updatedLesson = await prisma.lesson.update({
        where: {
          id,
        },
        data: {
          title,
          description,
          thumbnailKey,
          videoKey,
        },
      });

      return updatedLesson;
    }),
  create: adminProcedure
    .input(
      z
        .object({
          chapterId: z.string().min(1),
        })
        .extend(newLessonSchema.shape)
    )
    .mutation(async ({ input }) => {
      const { title, chapterId } = input;

      const lastChapterPosition = await prisma.lesson.findFirst({
        where: {
          chapterId,
        },
        select: {
          position: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      const createdNewLesson = await prisma.lesson.create({
        data: {
          title,
          position: (lastChapterPosition?.position ?? 0) + 1,
          chapterId,
        },
      });

      return createdNewLesson;
    }),
  reordered: adminProcedure
    .input(
      z.object({
        chapterId: z.string().min(1),
        lessonIds: z.array(z.string()),
      })
    )
    .mutation(async ({ input }) => {
      const { chapterId, lessonIds } = input;

      await Promise.all(
        lessonIds.map(async (id, index) => {
          await prisma.lesson.update({
            where: {
              id,
              chapterId,
            },
            data: {
              position: index + 1,
            },
          });
        })
      );
    }),
  delete: adminProcedure
    .input(
      z.object({
        id: z.string().min(1),
      })
    )
    .mutation(async ({ input }) => {
      const { id } = input;

      const existingLesson = await prisma.lesson.findFirst({
        where: {
          id,
        },
      });
      if (!existingLesson) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Lesson not found",
        });
      }

      const deletedChapter = await prisma.lesson.delete({
        where: {
          id,
        },
      });

      return deletedChapter;
    }),
});
