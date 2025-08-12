import { Card, CardContent, CardFooter } from "@/components/ui/card";

export function CourseCardSkeleton() {
  return (
    <Card className="flex flex-col h-full overflow-hidden rounded-lg shadow-md animate-pulse">
      {/* Thumbnail */}
      <div className="relative aspect-video bg-gray-200 dark:bg-gray-700" />

      {/* Delete Button Placeholder */}
      <div className="absolute top-2 -right-0 -translate-x-2">
        <div className="w-8 h-8 rounded-md bg-gray-200 dark:bg-gray-700" />
      </div>

      {/* Card Content */}
      <CardContent className="p-4 flex-grow space-y-2">
        {/* Title */}
        <div className="h-6 w-3/4 bg-gray-200 dark:bg-gray-700 rounded" />

        {/* Short Description */}
        <div className="space-y-1">
          <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded" />
          <div className="h-4 w-5/6 bg-gray-200 dark:bg-gray-700 rounded" />
          <div className="h-4 w-4/6 bg-gray-200 dark:bg-gray-700 rounded" />
        </div>

        {/* Meta Info */}
        <div className="flex items-center gap-x-4 mt-2">
          <div className="h-4 w-12 bg-gray-200 dark:bg-gray-700 rounded" />
          <div className="h-4 w-12 bg-gray-200 dark:bg-gray-700 rounded" />
        </div>
      </CardContent>

      {/* Card Footer */}
      <CardFooter className="p-4 bg-gray-100 dark:bg-gray-800 mt-auto">
        <div className="h-10 w-full bg-gray-200 dark:bg-gray-700 rounded" />
      </CardFooter>
    </Card>
  );
}
