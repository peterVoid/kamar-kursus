import { AppRouter } from "@/trpc/routers/_app";
import { inferRouterOutputs } from "@trpc/server";

export type CourseGetManyOuput =
  inferRouterOutputs<AppRouter>["courses"]["getMany"];

export type CourseGetOneAdminOutput =
  inferRouterOutputs<AppRouter>["courses"]["getOneAdmin"];
