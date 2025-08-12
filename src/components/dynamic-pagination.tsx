import { cn } from "@/lib/utils";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from "./ui/pagination";

interface Props {
  currentPage: number;
  totalPages: number;
  handlePagination?: (val: number) => void;
}

export function DynamicPagination({
  totalPages,
  currentPage,
  handlePagination,
}: Props) {
  return (
    <Pagination className="mt-10">
      <PaginationContent>
        {Array.from({ length: totalPages }).map((_, i) => (
          <PaginationItem
            key={i}
            className={cn(
              "bg-primary/40 rounded-lg transition-colors font-medium",
              i + 1 === currentPage && "bg-primary text-white"
            )}
          >
            <PaginationLink
              className="hover:bg-primary/40"
              onClick={() => handlePagination?.(i + 1)}
            >
              {i + 1}
            </PaginationLink>
          </PaginationItem>
        ))}
      </PaginationContent>
    </Pagination>
  );
}
