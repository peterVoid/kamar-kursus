import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { generateCourseImageUrl } from "@/lib/utils";
import Image from "next/image";
import { CourseGetManyAdminOuput } from "../types";
import { ChartBarStackedIcon, ChevronRightIcon, ClockIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface Props {
  course: CourseGetManyAdminOuput[0];
}

export function CourseCard({ course }: Props) {
  return (
    <Card>
      <div className="relative aspect-video">
        <Image
          src={
            course.fileKey
              ? generateCourseImageUrl(course.fileKey)
              : "/placeholder.png"
          }
          alt="Course image"
          fill
          className="object-contain"
        />
      </div>
      <CardContent className="space-y-1">
        <h2 className="font-semibold text-xl">{course.title}</h2>
        <p className="line-clamp-2 text-sm text-muted-foreground">
          {course.shortDescription}
        </p>
        <div className="flex items-center gap-x-3">
          <div className="flex items-center gap-0.5">
            <div className="p-1 bg-muted">
              <ClockIcon className="size-4" />
            </div>
            <span className="text-muted-foreground text-sm">
              {course.duration}h
            </span>
          </div>
          <div className="flex items-center gap-0.5">
            <div className="p-1 bg-muted">
              <ChartBarStackedIcon className="size-4" />
            </div>
            <span className="text-muted-foreground text-sm">
              {course.level}
            </span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full" asChild>
          <Link href={`/admin/courses/edit/${course.id}`}>
            Edit Course <ChevronRightIcon />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
