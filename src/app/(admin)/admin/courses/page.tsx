import { buttonVariants } from "@/components/ui/button";
import { DEFAULT_LIMIT } from "@/constans";
import {
  AdminCoursesContent,
  AdminCoursesContentSkeleton,
} from "@/features/admin/components/admin-courses-content";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import Link from "next/link";
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
    <div>
      <div className="flex items-center justify-between">
        <h2 className="font-bold text-2xl">Kursus Anda</h2>
        <Link href="/admin/courses/create" className={buttonVariants()}>
          Buat baru
        </Link>
      </div>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense fallback={<AdminCoursesContentSkeleton />}>
          <AdminCoursesContent />
        </Suspense>
      </HydrationBoundary>
    </div>
  );
}
