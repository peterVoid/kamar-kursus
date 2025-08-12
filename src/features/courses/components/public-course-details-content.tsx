"use client";

import { GenerateDescription } from "@/components/richtext/generate-description";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Separator } from "@/components/ui/separator";
import { formatAsDollar, generateCourseImageUrl } from "@/lib/utils";
import { useTRPC } from "@/trpc/client";
import { IconCategory } from "@tabler/icons-react";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { BookIcon, ChartBar, PlayIcon, TimerIcon } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";

interface Props {
  slug: string;
}

export function PublicCourseDetailsContent({ slug }: Props) {
  const trpc = useTRPC();
  const { data: course } = useSuspenseQuery(
    trpc.courses.getOnePublic.queryOptions({
      slug,
    })
  );

  const { mutate, isPending } = useMutation(
    trpc.enrollments.enroll.mutationOptions({
      onSuccess: (data) => {
        window.location.href = data?.url as string;
      },
      onError: () => {
        toast.error("You are not logged in yet.");
      },
    })
  );

  const handleEnrollment = () => {
    mutate({
      courseId: course.id,
      amount: course.price,
    });
  };

  return (
    <div className="pl-4 xl:pl-10">
      <div className="grid grid-cols-1 lg:grid-cols-6 gap-5">
        <div className="lg:col-span-4 flex flex-col gap-y-10">
          <div className="relative aspect-video flex items-center justify-center">
            <Image
              src={
                course.fileKey
                  ? generateCourseImageUrl(course.fileKey)
                  : "/placeholder.png"
              }
              alt="Course image"
              fill
              className="object-contain p-6"
              priority
            />
          </div>
          <div className="space-y-4">
            <h2 className="font-bold text-3xl">{course.title}</h2>
            <div className="text-sm text-muted-foreground">
              {course.shortDescription}
            </div>
            <div className="flex items-center gap-x-2.5">
              <Badge>
                <ChartBar className="size-4" />
                {course.level}
              </Badge>
              <Badge>
                <IconCategory className="size-4" />
                {course.category}
              </Badge>
              <Badge>
                <TimerIcon className="size-4" />
                {course.duration} hours
              </Badge>
            </div>
          </div>
          <Separator />
          <div>
            <h1 className="font-semibold text-3xl">Course Description</h1>
            <div className="mt-2">
              {course.description ? (
                GenerateDescription({ json: JSON.parse(course.description) })
              ) : (
                <div className="italic text-muted-foreground">
                  This course dont have any description
                </div>
              )}
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h1 className="font-semibold text-3xl">Course Content</h1>
              <div className="text-sm">
                {course.chapters.length} chapters |{" "}
                {course.chapters.reduce(
                  (acc, val) => acc + val.lessons.length,
                  0
                )}{" "}
                lessons
              </div>
            </div>
            <div className="flex flex-col gap-y-3">
              {course.chapters.map((chapter, index) => (
                <Collapsible defaultOpen={index === 0} key={chapter.id}>
                  <Card className="pb-0">
                    <CardHeader>
                      <CollapsibleTrigger asChild>
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-x-4">
                            <div className="bg-muted p-2 rounded-full size-6 flex items-center justify-center">
                              <p className="text-sm text-muted-foreground font-semibold">
                                {chapter.position}
                              </p>
                            </div>
                            <div className="space-y-2">
                              <div className="font-semibold text-md">
                                {chapter.title}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {chapter.lessons.length} lessons
                              </div>
                            </div>
                          </div>
                        </div>
                      </CollapsibleTrigger>
                    </CardHeader>
                    <CardContent className="bg-muted py-4 px-4">
                      <CollapsibleContent>
                        <div className="flex flex-col gap-y-4">
                          {chapter.lessons.map((lesson) => (
                            <div
                              key={lesson.id}
                              className="bg-card p-3 rounded-xl border"
                            >
                              <div className="flex items-center gap-x-3">
                                <div className="bg-primary rounded-full p-2 flex items-center justify-center">
                                  <PlayIcon className="size-3 text-border" />
                                </div>
                                <div className="flex flex-col gap-y-1">
                                  <div className="text-sm font-semibold">
                                    {lesson.title}
                                  </div>
                                  <div className="text-sm font-semibold text-muted-foreground">
                                    {lesson.title}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CollapsibleContent>
                    </CardContent>
                  </Card>
                </Collapsible>
              ))}
            </div>
          </div>
        </div>
        <div className="lg:col-span-2">
          <div className="sticky top-20">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <h2 className="font-semibold text-md">Price:</h2>
                  <h1 className="text-muted-foreground font-semibold">
                    {formatAsDollar(course.price)}
                  </h1>
                </div>
              </CardHeader>
              <CardContent className="flex flex-col gap-y-4">
                <div className="bg-primary/20 p-3 rounded-xl">
                  <div className="text-sm font-semibold">
                    What will you get:
                  </div>
                  <div className="mt-4 flex flex-col gap-y-3">
                    <div className="flex items-center gap-x-2">
                      <div className="rounded-full bg-primary/60 p-1.5">
                        <TimerIcon className="size-3" />
                      </div>
                      <div className="space-y-0.5">
                        <div className="font-semibold text-sm">
                          Course Duration
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {course.duration} hours
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-x-2">
                      <div className="rounded-full bg-primary/60 p-1.5">
                        <IconCategory className="size-3" />
                      </div>
                      <div className="space-y-0.5">
                        <div className="font-semibold text-sm">Category</div>
                        <div className="text-sm text-muted-foreground">
                          {course.category}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-x-2">
                      <div className="rounded-full bg-primary/60 p-1.5">
                        <ChartBar className="size-3" />
                      </div>
                      <div className="space-y-0.5">
                        <div className="font-semibold text-sm">
                          Course Level
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {course.level}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-x-2">
                      <div className="rounded-full bg-primary/60 p-1.5">
                        <BookIcon className="size-3" />
                      </div>
                      <div className="space-y-0.5">
                        <div className="font-semibold text-sm">
                          Total Chapter & lesson
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {course.chapters.length} chapters |{" "}
                          {course.chapters.reduce(
                            (acc, val) => acc + val.lessons.length,
                            0
                          )}{" "}
                          lessons
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full"
                  disabled={isPending}
                  onClick={handleEnrollment}
                >
                  Enroll now
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
