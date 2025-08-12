import {
  LessonContent,
  LessonContentSkeleton,
} from "@/features/lessons/components/lesson-content";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";

interface Props {
  params: Promise<{ lessonId: string }>;
}

export default async function Page({ params }: Props) {
  const { lessonId } = await params;

  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(
    trpc.lessons.getOneUserEnrolledCourse.queryOptions({
      id: lessonId,
    })
  );

  return (
    <div className="border-l border-primary/50">
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense fallback={<LessonContentSkeleton />}>
          <LessonContent lessonId={lessonId} />
        </Suspense>
      </HydrationBoundary>
    </div>
  );
}
