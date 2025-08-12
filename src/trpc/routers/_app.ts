import { courseRouter } from "@/features/courses/db/procedures";
import { createTRPCRouter } from "../init";
import { chapterRouter } from "@/features/chapters/db/procedures";
import { lessonRouter } from "@/features/lessons/db/procedures";
import { enrollmentRouter } from "@/features/enrollments/db/procedures";
import { userRouter } from "@/features/users/db/procedures";
import { adminRouter } from "@/features/admin/db/procedures";

export const appRouter = createTRPCRouter({
  courses: courseRouter,
  chapters: chapterRouter,
  lessons: lessonRouter,
  enrollments: enrollmentRouter,
  users: userRouter,
  admin: adminRouter,
});

export type AppRouter = typeof appRouter;
