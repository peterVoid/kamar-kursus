"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { CheckIcon, ChevronDownIcon, PlayIcon } from "lucide-react";
import Link from "next/link";

interface Props {
  slug: string;
}

export function CourseSidebar({ slug }: Props) {
  const trpc = useTRPC();
  const { data: courseData } = useSuspenseQuery(
    trpc.enrollments.enrolledCourseDetails.queryOptions({
      slug,
    })
  );

  const lessonCompletedCount = courseData.chapters.reduce(
    (acc, val) =>
      acc +
      val.lessons.reduce((acc, val) => acc + val.completedLessons.length, 0),
    0
  );

  const totalLessonCount = courseData.chapters.reduce(
    (acc, val) => acc + val.lessons.length,
    0
  );

  return (
    <div>
      <div className="border-b border-border p-2">
        <div className="flex items-center gap-x-2">
          <div className="flex items-center justify-center rounded-full p-2 bg-primary/40">
            <PlayIcon className="size-6" />
          </div>
          <div className="space-y-1">
            <div className="font-semibold text-xl">{courseData.title}</div>
            <div className="text-sm text-muted-foreground">
              {courseData.category}
            </div>
          </div>
        </div>

        <div className="mt-3 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-sm text-primary font-medium">Progress</span>
            <span className="font-medium text-sm">
              {lessonCompletedCount} / {totalLessonCount} lessons
            </span>
          </div>
          <Progress value={20} />
          <div className="text-sm text-muted-foreground font-medium">
            {Math.round((lessonCompletedCount / totalLessonCount) * 100)}%
            completed
          </div>
        </div>
      </div>

      <div className="mt-3 flex flex-col gap-y-3">
        {courseData.chapters.map((chapter, index) => (
          <Collapsible
            key={chapter.id}
            defaultOpen={index === 0}
            className="cursor-pointer"
          >
            <CollapsibleTrigger className="w-full" asChild>
              <Card className="py-2.5 px-1">
                <CardContent>
                  <div className="flex items-center gap-x-2.5">
                    <ChevronDownIcon className="size-4 text-primary" />
                    <div className="space-y-0.5 text-left">
                      <div className="text-md font-semibold ">
                        {chapter.position}: {chapter.title}
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {chapter.lessons.length} lessons
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </CollapsibleTrigger>
            <CollapsibleContent className="py-4">
              <div className="flex flex-col gap-y-3 border-l border-primary/70">
                {chapter.lessons.map((lesson) => {
                  const isLessonCompleted = lesson.completedLessons.length > 0;

                  return (
                    <Card
                      key={lesson.id}
                      className={cn(
                        "ml-5 py-2.5 px-1 ",
                        isLessonCompleted && "bg-green-600/60"
                      )}
                    >
                      <CardContent>
                        <Link href={`/dashboard/${slug}/${lesson.id}`} prefetch>
                          <div className="flex items-center gap-x-2">
                            <div
                              className={cn(
                                "flex items-center justify-center rounded-full bg-primary/40 p-2 border-2 border-primary",
                                isLessonCompleted &&
                                  "bg-green-500 border-green-500"
                              )}
                            >
                              {isLessonCompleted ? (
                                <CheckIcon className="size-3 text-white" />
                              ) : (
                                <PlayIcon className="size-3 fill-primary" />
                              )}
                            </div>
                            <div className="text-sm font-semibold">
                              {lesson.position}.
                            </div>
                            <div className="text-sm font-semibold">
                              {lesson.title}
                            </div>
                          </div>
                        </Link>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </CollapsibleContent>
          </Collapsible>
        ))}
      </div>
    </div>
  );
}

export function CourseSidebarSkeleton() {
  return (
    <div>
      {/* Header Course Info */}
      <div className="border-b border-border p-2">
        <div className="flex items-center gap-x-2">
          <Skeleton className="size-10 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>

        {/* Progress Info */}
        <div className="mt-3 space-y-1.5">
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-24" />
          </div>
          <Skeleton className="h-2 w-full rounded-full" />
          <Skeleton className="h-4 w-20" />
        </div>
      </div>

      {/* Chapters & Lessons Skeleton */}
      <div className="mt-3 flex flex-col gap-y-3">
        {Array.from({ length: 3 }).map((_, chapterIndex) => (
          <div key={`chapter-skeleton-${chapterIndex}`}>
            <Card className="py-2.5 px-1">
              <CardContent className="flex items-center gap-x-2.5">
                <Skeleton className="size-4 rounded" />
                <div className="space-y-1">
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </CardContent>
            </Card>

            <div className="pl-6 mt-3 flex flex-col gap-y-3">
              {Array.from({ length: 3 }).map((_, lessonIndex) => (
                <Card
                  key={`lesson-skeleton-${chapterIndex}-${lessonIndex}`}
                  className="py-2.5 px-1"
                >
                  <CardContent className="flex items-center gap-x-2">
                    <Skeleton className="size-6 rounded-full" />
                    <Skeleton className="h-4 w-6" />
                    <Skeleton className="h-4 w-40" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
