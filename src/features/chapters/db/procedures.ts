import prisma from "@/lib/prisma";
import { adminProcedure, createTRPCRouter } from "@/trpc/init";
import z from "zod";
import { newChapterSchema } from "../zod-schema";
import { TRPCError } from "@trpc/server";

export const chapterRouter = createTRPCRouter({
  create: adminProcedure
    .input(
      z
        .object({
          courseId: z.string().min(1),
        })
        .extend(newChapterSchema.shape)
    )
    .mutation(async ({ input }) => {
      const { title, courseId } = input;

      const lastCoursePosition = await prisma.chapter.findFirst({
        where: {
          courseId,
        },
        select: {
          position: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      const createdNewChapter = await prisma.chapter.create({
        data: {
          title,
          position: (lastCoursePosition?.position ?? 0) + 1,
          courseId,
        },
      });

      return createdNewChapter;
    }),
  reordered: adminProcedure
    .input(
      z.object({
        courseId: z.string().min(1),
        chapterIds: z.array(z.string()),
      })
    )
    .mutation(async ({ input }) => {
      const { courseId, chapterIds } = input;

      await Promise.all(
        chapterIds.map(async (id, index) => {
          await prisma.chapter.update({
            where: {
              id,
              courseId,
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

      const existingChapter = await prisma.chapter.findFirst({
        where: {
          id,
        },
      });
      if (!existingChapter) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Chapter not found",
        });
      }

      const deletedChapter = await prisma.chapter.delete({
        where: {
          id,
        },
      });

      return deletedChapter;
    }),
});
