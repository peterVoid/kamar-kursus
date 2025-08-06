import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LessonDetailsForm } from "@/features/lessons/components/lesson-details-form";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { ChevronLeftIcon } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

interface Props {
  params: Promise<{ lessonId: string }>;
}

export default async function Page({ params }: Props) {
  const { lessonId } = await params;

  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(
    trpc.lessons.getOne.queryOptions({
      id: lessonId,
    })
  );

  return (
    <div>
      <div className="flex items-center gap-x-2">
        <Link
          href="/admin/courses"
          className={buttonVariants({
            size: "sm",
          })}
        >
          <ChevronLeftIcon />
          Back
        </Link>
      </div>
      <div className="mt-4">
        <Card>
          <CardHeader>
            <CardTitle>Lesson Configuration</CardTitle>
            <CardDescription>
              Configure the video and description for this lessons.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <HydrationBoundary state={dehydrate(queryClient)}>
              <Suspense>
                <LessonDetailsForm id={lessonId} />
              </Suspense>
            </HydrationBoundary>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
