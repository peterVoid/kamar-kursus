import { buttonVariants } from "@/components/ui/button";
import { CourseForm } from "@/features/courses/components/course-form";
import { ChevronLeftIcon } from "lucide-react";
import Link from "next/link";

export default function Page() {
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
        </Link>
        <h2 className="font-bold text-2xl">Create Course</h2>
      </div>
      <div className="mt-6">
        <CourseForm />
      </div>
    </div>
  );
}
