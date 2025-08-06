"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { CourseForm } from "./course-form";
import { CourseStructure } from "./course-structure";

interface Props {
  id: string;
}

export function EditCourseContent({ id }: Props) {
  const trpc = useTRPC();
  const { data: course } = useSuspenseQuery(
    trpc.courses.getOneAdmin.queryOptions({
      id,
    })
  );

  return (
    <div>
      <div className="flex items-center">
        <h2 className="font-bold text-2xl">Edit course: </h2>
        <h3 className="text-muted-foreground text-2xl font-semibold underline">
          {course.title}
        </h3>
      </div>
      <Tabs defaultValue="basic-info" className="mt-9">
        <TabsList className="w-full grid grid-cols-2">
          <TabsTrigger value="basic-info">Basic Info</TabsTrigger>
          <TabsTrigger value="course-structure">Course Structure</TabsTrigger>
        </TabsList>
        <TabsContent value="basic-info">
          <CourseForm data={{ ...course, chapters: [] }} id={id} />
        </TabsContent>
        <TabsContent value="course-structure">
          <CourseStructure data={course} courseId={id} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
