import { DEFAULT_LIMIT } from "@/constans";
import {
  HomeCoursesContent,
  HomeCoursesContentSkeleton,
} from "@/features/courses/components/home-courses-content";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";

export default function Page() {
  const queryClient = getQueryClient();
  void queryClient.prefetchInfiniteQuery(
    trpc.courses.getMany.infiniteQueryOptions(
      {
        limit: DEFAULT_LIMIT,
      },
      {
        getNextPageParam: (lastItem) => lastItem.nextCursor,
      }
    )
  );

  return (
    <div className="px-4 2xl:px-7">
      <h2 className="font-bold text-3xl">Explore Courses</h2>
      <p className="text-sm text-muted-foreground max-w-sm">
        Discover our wide range of courses designed to help you achieve your
        learning goals.
      </p>
      <div className="mt-4">
        <HydrationBoundary state={dehydrate(queryClient)}>
          <Suspense fallback={<HomeCoursesContentSkeleton />}>
            <HomeCoursesContent />
          </Suspense>
        </HydrationBoundary>
      </div>
    </div>
  );
}
