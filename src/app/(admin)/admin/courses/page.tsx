import { buttonVariants } from "@/components/ui/button";
import { AdminCoursesContent } from "@/features/admin/components/admin-courses-content";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import Link from "next/link";
import { Suspense } from "react";

export default function Page() {
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(trpc.courses.getManyAdmin.queryOptions());

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="font-bold text-2xl">Kursus Anda</h2>
        <Link href="/admin/courses/create" className={buttonVariants()}>
          Buat baru
        </Link>
      </div>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense>
          <AdminCoursesContent />
        </Suspense>
      </HydrationBoundary>
    </div>
  );
}
