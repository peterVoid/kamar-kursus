import { DEFAULT_PAGE_SIZE } from "@/constans";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";
import { AdminUsersTable } from "./components/admin-users-table";

interface Props {
  searchParams: Promise<{ page?: string }>;
}

export default async function Page({ searchParams }: Props) {
  const { page } = await searchParams;

  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(
    trpc.users.getAllUsers.queryOptions({
      page: page == null ? 1 : Number(page),
      pageSize: DEFAULT_PAGE_SIZE,
    })
  );

  return (
    <div className="flex flex-col gap-y-10">
      <h2 className="text-4xl font-semibold">User List</h2>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense>
          <AdminUsersTable defaultPage={Number(page ?? "1")} />
        </Suspense>
      </HydrationBoundary>
    </div>
  );
}
