import { DEFAULT_PAGE_SIZE } from "@/constans";
import {
  AdminEnrolledCoursesTable,
  AdminEnrolledCoursesTableSkeleton,
} from "@/features/enrollments/components/admin-enrolled-courses-table";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";

interface Props {
  searchParams: Promise<{ page?: string }>;
}

export default async function Page({ searchParams }: Props) {
  const { page } = await searchParams;

  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(
    trpc.enrollments.adminGetAllEnrollmentsCourses.queryOptions({
      page: page == null ? 1 : Number(page),
      pageSize: DEFAULT_PAGE_SIZE,
    })
  );

  return (
    <div className="flex flex-col gap-y-10">
      <h2 className="text-4xl font-semibold">Order List</h2>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense fallback={<AdminEnrolledCoursesTableSkeleton />}>
          <AdminEnrolledCoursesTable defaultPage={Number(page ?? "1")} />
        </Suspense>
      </HydrationBoundary>
    </div>
  );
}
