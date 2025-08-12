import { ChartAreaInteractive } from "@/features/admin/components/sidebar/chart-area-interactive";
import { SectionCards } from "@/features/admin/components/sidebar/section-cards";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";

export default function Page() {
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(trpc.admin.dashboardCard.queryOptions());

  return (
    <>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense>
          <SectionCards />
        </Suspense>
      </HydrationBoundary>
      <div className="px-4 lg:px-6">
        <HydrationBoundary state={dehydrate(queryClient)}>
          <Suspense>
            <ChartAreaInteractive />
          </Suspense>
        </HydrationBoundary>
      </div>
    </>
  );
}
