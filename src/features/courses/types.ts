import { AppRouter } from "@/trpc/routers/_app";
import { inferRouterOutputs } from "@trpc/server";

export type CourseGetManyAdminOuput =
  inferRouterOutputs<AppRouter>["courses"]["getManyAdmin"];

export type CourseGetOneAdminOutput =
  inferRouterOutputs<AppRouter>["courses"]["getOneAdmin"];
