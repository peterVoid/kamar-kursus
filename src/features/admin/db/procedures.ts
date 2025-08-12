import prisma from "@/lib/prisma";
import { adminProcedure, createTRPCRouter } from "@/trpc/init";

export const adminRouter = createTRPCRouter({
  dashboardCard: adminProcedure.query(async () => {
    const totalSignup = await prisma.user.count({
      where: {
        NOT: {
          role: "Admin",
        },
      },
    });

    const totalCustomers = await prisma.user.findMany({
      where: {
        NOT: {
          role: "Admin",
        },
        enrollments: {
          some: {
            status: "Active",
          },
        },
      },
    });

    const totalCourses = await prisma.course.count();

    const totalLesson = await prisma.lesson.count();

    const thirtyDayAgo = new Date();
    thirtyDayAgo.setDate(thirtyDayAgo.getDate() - 30);

    const enrollment30LastDays = await prisma.enrollment.findMany({
      where: {
        createdAt: {
          gte: thirtyDayAgo,
        },
      },
      select: {
        createdAt: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    const last30Days: { date: string; enrollments: number }[] = [];

    for (let i = 29; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      last30Days.push({
        date: date.toISOString().split("T")[0],
        enrollments: 0,
      });
    }

    last30Days.forEach((item) => {
      const date = enrollment30LastDays.find(
        (i) => i.createdAt.toISOString().split("T")[0] === item.date
      );

      const findIndex = last30Days.findIndex(
        (i) => i.date === date?.createdAt.toISOString().split("T")[0]
      );

      if (findIndex !== -1) {
        last30Days[findIndex].enrollments++;
      }
    });

    return {
      last30Days,
      totalSignup,
      totalLesson,
      totalCourses,
      totalCustomers: totalCustomers.length,
    };
  }),
});
