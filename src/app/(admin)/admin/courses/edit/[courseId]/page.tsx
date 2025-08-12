import { PageLoader } from "@/components/page-loader";
import { EditCourseContent } from "@/features/courses/components/edit-course-content";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";

interface Props {
  params: Promise<{ courseId: string }>;
}

export default async function Page({ params }: Props) {
  const { courseId } = await params;

  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(
    trpc.courses.getOneAdmin.queryOptions({
      id: courseId,
    })
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<PageLoader />}>
        <EditCourseContent id={courseId} />
      </Suspense>
    </HydrationBoundary>
  );
}
