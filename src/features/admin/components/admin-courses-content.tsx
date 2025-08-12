"use client";

import { Button } from "@/components/ui/button";
import { DEFAULT_LIMIT } from "@/constans";
import { CourseCard } from "@/features/courses/components/course-card";
import { CourseCardSkeleton } from "@/features/courses/components/course-card-skeleton";
import { useInterSectionObserver } from "@/hooks/use-intersection-observer";
import { useTRPC } from "@/trpc/client";
import {
  useMutation,
  useQueryClient,
  useSuspenseInfiniteQuery,
} from "@tanstack/react-query";
import { ChevronRightIcon } from "lucide-react";
import Link from "next/link";
import { useRef } from "react";
import { toast } from "sonner";

export function AdminCoursesContent() {
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const {
    data: coursesData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useSuspenseInfiniteQuery(
    trpc.courses.getMany.infiniteQueryOptions(
      {
        limit: DEFAULT_LIMIT,
      },
      {
        getNextPageParam: (lastItem) => lastItem.nextCursor,
      }
    )
  );

  const { mutate: deleteCourse, isPending: deleteCoursePending } = useMutation(
    trpc.courses.delete.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries(
          trpc.courses.getMany.infiniteQueryFilter()
        );
        toast.success("Successfully deleted course");
      },
      onError: () => {
        toast.error("Failed to delete course");
      },
    })
  );

  useInterSectionObserver({
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    loadMoreRef,
  });

  const courses = coursesData.pages.flatMap((page) => page.items);

  return (
    <div className="mt-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 flex-wrap">
        {!!courses.length ? (
          <>
            {courses.map((course) => (
              <CourseCard
                isLoading={deleteCoursePending}
                key={course.id}
                course={course}
                fromAdmin={true}
                deleteFunc={() =>
                  deleteCourse({
                    id: course.id,
                  })
                }
              >
                <Button className="w-full" asChild>
                  <Link href={`/admin/courses/edit/${course.id}`}>
                    Edit Course <ChevronRightIcon />
                  </Link>
                </Button>
              </CourseCard>
            ))}

            {isFetchingNextPage &&
              Array.from({ length: DEFAULT_LIMIT }).map((_, i) => (
                <CourseCardSkeleton key={`skeleton-${i}`} />
              ))}
          </>
        ) : (
          <p>Empty Courses</p>
        )}
      </div>

      <div ref={loadMoreRef} />
    </div>
  );
}

export function AdminCoursesContentSkeleton() {
  return (
    <div className="mt-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 flex-wrap">
        {Array.from({ length: DEFAULT_LIMIT }).map((_, i) => (
          <CourseCardSkeleton key={`admin-skeleton-${i}`} />
        ))}
      </div>
    </div>
  );
}
