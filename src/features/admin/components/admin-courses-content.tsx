"use client";

import { CourseCard } from "@/features/courses/components/course-card";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";

export function AdminCoursesContent() {
  const trpc = useTRPC();
  const { data: courses } = useSuspenseQuery(
    trpc.courses.getManyAdmin.queryOptions()
  );

  return (
    <div className="mt-6">
      <div className="grid grid-cols-2 gap-x-2">
        {!!courses.length ? (
          <>
            {courses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </>
        ) : (
          <p>Empty Courses</p>
        )}
      </div>
    </div>
  );
}
