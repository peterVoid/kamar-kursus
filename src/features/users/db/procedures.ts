import { DEFAULT_PAGE_SIZE } from "@/constans";
import prisma from "@/lib/prisma";
import { adminProcedure, createTRPCRouter } from "@/trpc/init";
import z from "zod";

export const userRouter = createTRPCRouter({
  getAllUsers: adminProcedure
    .input(
      z.object({
        page: z.number().default(1),
        pageSize: z.number().default(DEFAULT_PAGE_SIZE),
      })
    )
    .query(async ({ input }) => {
      const { page, pageSize } = input;

      const offset = (page - 1) * pageSize;

      const totalItems = await prisma.user.count();

      const totalPages = Math.ceil(totalItems / pageSize);

      const users = await prisma.user.findMany({
        where: {
          NOT: {
            role: "Admin",
          },
        },
        select: {
          name: true,
          email: true,
          image: true,
        },
        orderBy: {
          createdAt: "desc",
        },
        skip: offset,
        take: pageSize,
      });

      return {
        items: users,
        pagination: {
          totalItems,
          totalPages,
          currentPage: page,
        },
      };
    }),
});
