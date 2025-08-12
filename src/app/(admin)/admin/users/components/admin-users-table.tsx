"use client";

import { DynamicPagination } from "@/components/dynamic-pagination";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DEFAULT_PAGE_SIZE } from "@/constans";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

interface Props {
  defaultPage: number;
}

export function AdminUsersTable({ defaultPage }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [page, setPage] = useState(defaultPage);

  const trpc = useTRPC();
  const { data } = useSuspenseQuery(
    trpc.users.getAllUsers.queryOptions({
      page,
      pageSize: DEFAULT_PAGE_SIZE,
    })
  );

  const handlePaginationChange = (val: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", String(val));
    setPage(val);

    router.push(`/admin/orders?${params.toString()}`);
  };

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">No</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.items.map((item, i) => (
            <TableRow key={i}>
              <TableCell>{(page - 1) * DEFAULT_PAGE_SIZE + i + 1}</TableCell>
              <TableCell>{item.name}</TableCell>
              <TableCell>{item.email}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <DynamicPagination
        currentPage={page}
        totalPages={data.pagination.totalPages}
        handlePagination={(val) => handlePaginationChange(val)}
      />
    </div>
  );
}

export function AdminEnrolledCoursesTableSkeleton() {
  return (
    <div>
      <Table>
        <TableCaption>Loading your course purchase history...</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">No</TableHead>
            <TableHead>Customer Name</TableHead>
            <TableHead>Course Name</TableHead>
            <TableHead>Total Price</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: 5 }).map((_, i) => (
            <TableRow key={`skeleton-${i}`}>
              <TableCell>
                <SkeletonCell className="w-6 h-4" />
              </TableCell>
              <TableCell>
                <SkeletonCell className="w-32 h-4" />
              </TableCell>
              <TableCell>
                <SkeletonCell className="w-40 h-4" />
              </TableCell>
              <TableCell>
                <SkeletonCell className="w-16 h-4" />
              </TableCell>
              <TableCell>
                <SkeletonCell className="w-16 h-6 rounded-full" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function SkeletonCell({ className }: { className?: string }) {
  return (
    <div
      className={`bg-gray-200 dark:bg-gray-700 animate-pulse rounded ${className}`}
    />
  );
}
