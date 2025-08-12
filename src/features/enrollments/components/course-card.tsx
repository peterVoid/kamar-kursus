import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { cn, generateCourseImageUrl } from "@/lib/utils";
import { ChartBarStackedIcon, ClockIcon, Trash2Icon } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ButtonAlertDialog } from "@/features/user-dashboard/components/sidebar/button-alert-dialog";
import { EnrollmentGetManyCourse } from "../types";

interface Props {
  enrollment: EnrollmentGetManyCourse[0];
  children: React.ReactNode;
  fromAdmin?: boolean;
  deleteFunc?: () => void;
  isLoading?: boolean;
  className?: string;
}

export function CourseCard({
  enrollment,
  children,
  fromAdmin = false,
  deleteFunc,
  isLoading,
  className,
}: Props) {
  const courseData = enrollment.Course;

  return (
    <Card
      className={cn(
        "flex flex-col h-full overflow-hidden rounded-lg shadow-md transition duration-300 ease-in-out hover:shadow-xl relative",
        className
      )}
    >
      <div className="relative aspect-video">
        <Image
          src={
            courseData.fileKey
              ? generateCourseImageUrl(courseData.fileKey)
              : "/placeholder.png"
          }
          alt="Course image"
          fill
          className="object-cover object-center transition duration-300 ease-in-out hover:scale-105"
        />
      </div>

      {fromAdmin && (
        <ButtonAlertDialog
          buttonText="Delete"
          title="Are you sure?"
          description="This action cannot bu undone. Please be careful"
          func={deleteFunc}
          isLoading={isLoading}
        >
          <div className="absolute top-2 -right-0 -translate-x-2">
            <Button variant="outline" size="icon">
              <Trash2Icon className="text-red-900 size-4" />
            </Button>
          </div>
        </ButtonAlertDialog>
      )}

      <CardContent className="p-4 flex-grow space-y-2">
        <h2 className="font-semibold text-xl text-gray-800 dark:text-white">
          {courseData.title}
        </h2>

        <p className="line-clamp-3 text-sm text-gray-600 dark:text-gray-400">
          {courseData.shortDescription}
        </p>

        <div className="flex items-center gap-x-4 mt-2">
          <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
            <ClockIcon className="w-4 h-4" />
            <span>{courseData.duration}h</span>
          </div>

          <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
            <ChartBarStackedIcon className="w-4 h-4" />
            <span>{courseData.level}</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-4 bg-gray-100 dark:bg-gray-800 mt-auto">
        {children}
      </CardFooter>
    </Card>
  );
}
