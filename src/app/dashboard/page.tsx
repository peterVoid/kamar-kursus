import { DEFAULT_LIMIT } from "@/constans";
import {
  UserDashboardContent,
  UserDashboardSkeleton,
} from "@/features/user-dashboard/components/user-dashboard-content";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

export default function Page() {
  const queryClient = getQueryClient();
  void queryClient.prefetchInfiniteQuery(
    trpc.enrollments.userHasEnrolled.infiniteQueryOptions(
      {
        limit: DEFAULT_LIMIT,
      },
      {
        getNextPageParam: (lastItem) => lastItem.nextCursor,
      }
    )
  );

  return (
    <div className="px-4 2xl:px-0">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
        Enrolled Courses
      </h1>
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Here are the courses you have access to and your learning progress.
      </p>
      <div className="mt-4">
        <HydrationBoundary state={dehydrate(queryClient)}>
          <Suspense fallback={<UserDashboardSkeleton />}>
            <UserDashboardContent />
          </Suspense>
        </HydrationBoundary>
      </div>
    </div>
  );
}
