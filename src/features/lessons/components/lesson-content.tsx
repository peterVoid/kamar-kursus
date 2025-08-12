"use client";

import { GenerateDescription } from "@/components/richtext/generate-description";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { generateCourseImageUrl } from "@/lib/utils";
import { useTRPC } from "@/trpc/client";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { BookDashed, CheckIcon, CheckSquare2Icon } from "lucide-react";

interface Props {
  lessonId: string;
}

export function LessonContent({ lessonId }: Props) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const { data: lessonData } = useSuspenseQuery(
    trpc.lessons.getOneUserEnrolledCourse.queryOptions({
      id: lessonId,
    })
  );

  const { mutate: userMarkLesson, isPending: pendingUserMarkLesson } =
    useMutation(
      trpc.lessons.userMarkLesson.mutationOptions({
        onSuccess: () => {
          queryClient.invalidateQueries(
            trpc.enrollments.enrolledCourseDetails.queryFilter()
          );
          queryClient.invalidateQueries(
            trpc.lessons.getOneUserEnrolledCourse.queryFilter()
          );
        },
      })
    );

  const videoUrl = lessonData?.videoKey
    ? generateCourseImageUrl(lessonData.videoKey)
    : "";
  const thumbnailUrl = lessonData?.thumbnailKey
    ? generateCourseImageUrl(lessonData.thumbnailKey)
    : "";

  const isCompletedLesson = lessonData.completedLessons.length > 0;

  const handleCompletedLesson = () => {
    userMarkLesson({
      id: lessonData.id,
    });
  };

  return (
    <div className="ml-3">
      <div className="relative aspect-video w-full h-full">
        {videoUrl ? (
          <div className="aspect-video bg-black rounded-lg relative overflow-hidden">
            <video
              controls
              className="size-full object-cover"
              poster={thumbnailUrl ? thumbnailUrl : undefined}
            >
              <source src={videoUrl} type="video/mp4" />
              <source src={videoUrl} type="video/webm" />
              <source src={videoUrl} type="video/ogg" />
              Your browser does not support video tag
            </video>
          </div>
        ) : (
          <div className="aspect-video size-full flex items-center justify-center bg-primary/70">
            <BookDashed className="size-28" />
          </div>
        )}
      </div>

      <Button
        className="mt-3"
        onClick={handleCompletedLesson}
        disabled={pendingUserMarkLesson}
      >
        {isCompletedLesson ? (
          <>
            Mark as uncomplete <CheckSquare2Icon />
          </>
        ) : (
          <>
            Mark as completed <CheckIcon />
          </>
        )}
      </Button>

      <Separator className="my-5" />

      <div className="mt-3">
        <h2 className="text-3xl font-bold">{lessonData.title}</h2>
        <div className="pt-1">
          {lessonData.description
            ? GenerateDescription({ json: JSON.parse(lessonData.description) })
            : "This lesson doesn't have any description yet"}
        </div>
      </div>
    </div>
  );
}

export function LessonContentSkeleton() {
  return (
    <div className="ml-3">
      <Skeleton className="aspect-video w-full rounded-lg" />

      <Skeleton className="h-10 w-48 mt-3 rounded-lg" />

      <Separator className="my-5" />

      <Skeleton className="h-8 w-3/4 rounded-md" />

      <div className="mt-3 space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-4/6" />
      </div>
    </div>
  );
}
