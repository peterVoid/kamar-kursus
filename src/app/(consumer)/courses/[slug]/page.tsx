import { PageLoader } from "@/components/page-loader";
import { PublicCourseDetailsContent } from "@/features/courses/components/public-course-details-content";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function Page({ params }: Props) {
  const { slug } = await params;

  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(
    trpc.courses.getOnePublic.queryOptions({
      slug,
    })
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<PageLoader />}>
        <PublicCourseDetailsContent slug={slug} />
      </Suspense>
    </HydrationBoundary>
  );
}
