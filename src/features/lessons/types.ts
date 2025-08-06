import { AppRouter } from "@/trpc/routers/_app";
import { inferRouterOutputs } from "@trpc/server";

export type LessonGetOneAdminOuput =
  inferRouterOutputs<AppRouter>["lessons"]["getOne"];
