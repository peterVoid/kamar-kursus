import {
  CourseSidebar,
  CourseSidebarSkeleton,
} from "@/features/user-dashboard/components/course-sidebar";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";

interface Props {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}

export default async function Layout({ children, params }: Props) {
  const { slug } = await params;

  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(
    trpc.enrollments.enrolledCourseDetails.queryOptions({
      slug,
    })
  );

  return (
    <div className="grid grid-cols-1 xl:grid-cols-5 gap-4 mt-2">
      <div className="xl:col-span-2">
        <HydrationBoundary state={dehydrate(queryClient)}>
          <Suspense fallback={<CourseSidebarSkeleton />}>
            <CourseSidebar slug={slug} />
          </Suspense>
        </HydrationBoundary>
      </div>
      <div className="xl:col-span-3">{children}</div>
    </div>
  );
}
