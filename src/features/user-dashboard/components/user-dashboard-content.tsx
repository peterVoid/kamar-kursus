"use client";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { DEFAULT_LIMIT } from "@/constans";
import { CourseCardSkeleton } from "@/features/courses/components/course-card-skeleton";
import { CourseCard } from "@/features/enrollments/components/course-card";
import { useInterSectionObserver } from "@/hooks/use-intersection-observer";
import { useTRPC } from "@/trpc/client";
import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useRef } from "react";

export function UserDashboardContent() {
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const trpc = useTRPC();
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useSuspenseInfiniteQuery(
      trpc.enrollments.userHasEnrolled.infiniteQueryOptions(
        { limit: DEFAULT_LIMIT },
        { getNextPageParam: (lastItem) => lastItem.nextCursor }
      )
    );

  const enrollmentData = data.pages.flatMap((page) => page.items);

  const lessonCompletedCount = enrollmentData.reduce(
    (acc, item) =>
      acc +
      item.Course.chapters.reduce(
        (acc, chapter) =>
          acc +
          chapter.lessons.reduce(
            (acc, lesson) => acc + lesson.completedLessons.length,
            0
          ),
        0
      ),
    0
  );

  const totalLesson = enrollmentData.reduce(
    (acc, item) =>
      acc +
      item.Course.chapters.reduce(
        (acc, chapter) => acc + chapter.lessons.length,
        0
      ),
    0
  );

  const progressLessonPercentage = Math.round(
    (lessonCompletedCount / totalLesson) * 100
  );

  useInterSectionObserver({
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
    loadMoreRef,
  });

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {enrollmentData.map((enrollment) => (
          <CourseCard
            key={enrollment.Course.id}
            enrollment={enrollment}
            className="shadow-md hover:shadow-lg transition-shadow rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700"
          >
            <div className="w-full space-y-4">
              <div className="flex items-center justify-between">
                <p className="font-medium text-gray-700 dark:text-gray-300">
                  Progress
                </p>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {progressLessonPercentage}%
                </span>
              </div>
              <Progress
                value={progressLessonPercentage}
                className="h-2 rounded-full"
              />

              <Button asChild className="mt-4 w-full rounded-lg font-medium">
                <Link
                  href={`/dashboard/${enrollment.Course.slug}/${enrollment.Course.chapters[0]?.lessons[0]?.id}`}
                >
                  Continue Learning
                </Link>
              </Button>
            </div>
          </CourseCard>
        ))}

        {isFetchingNextPage &&
          Array.from({ length: DEFAULT_LIMIT }).map((_, i) => (
            <CourseCardSkeleton key={`skeleton-${i}`} />
          ))}
      </div>

      <div ref={loadMoreRef} className="h-10" />
    </div>
  );
}

export function UserDashboardSkeleton() {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: DEFAULT_LIMIT }).map((_, i) => (
          <CourseCardSkeleton key={`skeleton-${i}`} />
        ))}
      </div>
    </div>
  );
}
