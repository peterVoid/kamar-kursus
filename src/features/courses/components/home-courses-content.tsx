"use client";

import { Button } from "@/components/ui/button";
import { DEFAULT_LIMIT } from "@/constans";
import { useTRPC } from "@/trpc/client";
import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import Link from "next/link";
import { CourseCard } from "./course-card";
import { CourseCardSkeleton } from "./course-card-skeleton";
import { useInterSectionObserver } from "@/hooks/use-intersection-observer";
import { useRef } from "react";

export function HomeCoursesContent() {
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const trpc = useTRPC();
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useSuspenseInfiniteQuery(
      trpc.courses.getMany.infiniteQueryOptions(
        {
          limit: DEFAULT_LIMIT,
        },
        {
          getNextPageParam: (lastItem) => lastItem.nextCursor,
        }
      )
    );

  const courses = data.pages.flatMap((page) => page.items);

  useInterSectionObserver({
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    loadMoreRef,
  });

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {courses.map((course) => (
          <CourseCard key={course.id} course={course}>
            <Button className="w-full" asChild>
              <Link href={`/courses/${course.slug}`}>Learn more</Link>
            </Button>
          </CourseCard>
        ))}

        {isFetchingNextPage &&
          Array.from({ length: DEFAULT_LIMIT }).map((_, i) => (
            <CourseCardSkeleton key={`next-page-skeleton-${i}`} />
          ))}
      </div>

      <div ref={loadMoreRef} />
    </div>
  );
}

export function HomeCoursesContentSkeleton() {
  return (
    <div className="mt-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {Array.from({ length: DEFAULT_LIMIT }).map((_, i) => (
          <CourseCardSkeleton key={`home-skeleton-${i}`} />
        ))}
      </div>
    </div>
  );
}
