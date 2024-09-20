"use client";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { ProductWithRelations } from "./product-table-row";
import { Pagination as PaginationType } from "@/types/misc";
import { usePathname, useRouter } from "next/navigation";
import useQueryString from "@/hooks/use-query-string";
import { cn } from "@/lib/utils";

export function ProductPagination({
  products,
  pagination,
}: {
  products: ProductWithRelations[];
  pagination: PaginationType;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { createQueryString } = useQueryString();

  const handlePageChange = (page: number) => {
    router.push(
      `${pathname}?${createQueryString({
        page: page.toString(),
      })}`
    );
  };

  const renderPageLinks = () => {
    const { currentPage, totalPages } = pagination;
    const pageLinks = [];

    // Always show first page
    pageLinks.push(
      <PaginationItem key={1}>
        <PaginationLink
          className={cn("cursor-pointer")}
          onClick={() => handlePageChange(1)}
          isActive={currentPage === 1}
        >
          1
        </PaginationLink>
      </PaginationItem>
    );

    // Show ellipsis if there are more than 7 pages and we're not in the first 3 pages
    if (totalPages > 7 && currentPage > 3) {
      pageLinks.push(
        <PaginationItem key="ellipsis1">
          <PaginationEllipsis className={cn("cursor-pointer")} />
        </PaginationItem>
      );
    }

    // Show 5 pages around the current page
    for (
      let i = Math.max(2, currentPage - 2);
      i <= Math.min(totalPages - 1, currentPage + 2);
      i++
    ) {
      pageLinks.push(
        <PaginationItem key={i}>
          <PaginationLink
            className={cn("cursor-pointer")}
            onClick={() => handlePageChange(i)}
            isActive={currentPage === i}
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }

    // Show ellipsis if there are more than 7 pages and we're not in the last 3 pages
    if (totalPages > 7 && currentPage < totalPages - 2) {
      pageLinks.push(
        <PaginationItem key="ellipsis2">
          <PaginationEllipsis className={cn("cursor-pointer")} />
        </PaginationItem>
      );
    }

    // Always show last page
    if (totalPages > 1) {
      pageLinks.push(
        <PaginationItem key={totalPages}>
          <PaginationLink
            className={cn("cursor-pointer")}
            onClick={() => handlePageChange(totalPages)}
            isActive={currentPage === totalPages}
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }

    return pageLinks;
  };

  return (
    <div className="relative">
      <div className="text-xs text-muted-foreground absolute left-0 top-1/2 -translate-y-1/2">
        Showing <strong>{products.length}</strong> of{" "}
        <strong>{pagination.totalCount}</strong> products
      </div>
      <Pagination className="mt-5">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              className={cn("cursor-pointer", {
                "pointer-events-none opacity-50": pagination.currentPage === 1,
              })}
              onClick={() =>
                handlePageChange(Math.max(1, pagination.currentPage - 1))
              }
            />
          </PaginationItem>

          {renderPageLinks()}

          <PaginationItem>
            <PaginationNext
              className={cn("cursor-pointer", {
                "pointer-events-none opacity-50":
                  pagination.currentPage === pagination.totalPages,
              })}
              onClick={() =>
                handlePageChange(
                  Math.min(pagination.totalPages, pagination.currentPage + 1)
                )
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
