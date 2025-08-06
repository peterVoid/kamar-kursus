import { courseRouter } from "@/features/courses/db/procedures";
import { createTRPCRouter } from "../init";
import { chapterRouter } from "@/features/chapters/db/procedures";
import { lessonRouter } from "@/features/lessons/db/procedures";

export const appRouter = createTRPCRouter({
  courses: courseRouter,
  chapters: chapterRouter,
  lessons: lessonRouter,
});

export type AppRouter = typeof appRouter;
