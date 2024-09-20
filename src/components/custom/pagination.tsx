"use client";

import React from "react";
import Link from "next/link";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { usePathname } from "next/navigation";
import useQueryString from "@/hooks/use-query-string";
import { cn } from "@/lib/utils";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  siblings?: number;
}

export function ReusablePagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  siblings = 2,
}: PaginationProps) {
  const pathname = usePathname();
  const { createQueryString } = useQueryString();

  const getPageHref = (page: number) =>
    `${pathname}?${createQueryString({ page: page.toString() })}`;

  const renderPageLinks = () => {
    const pageLinks = [];

    // Always show first page
    pageLinks.push(
      <PaginationItem key={1}>
        <Link href={getPageHref(1)} passHref legacyBehavior>
          <PaginationLink isActive={currentPage === 1}>1</PaginationLink>
        </Link>
      </PaginationItem>
    );

    // Show ellipsis if there are more than 7 pages and we're not in the first 3 pages
    if (totalPages > 7 && currentPage > 3) {
      pageLinks.push(
        <PaginationItem key="ellipsis1">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }

    // Show sibling pages around the current page
    for (
      let i = Math.max(2, currentPage - siblings);
      i <= Math.min(totalPages - 1, currentPage + siblings);
      i++
    ) {
      pageLinks.push(
        <PaginationItem key={i}>
          <Link href={getPageHref(i)} passHref legacyBehavior>
            <PaginationLink isActive={currentPage === i}>{i}</PaginationLink>
          </Link>
        </PaginationItem>
      );
    }

    // Show ellipsis if there are more than 7 pages and we're not in the last 3 pages
    if (totalPages > 7 && currentPage < totalPages - 2) {
      pageLinks.push(
        <PaginationItem key="ellipsis2">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }

    // Always show last page
    if (totalPages > 1) {
      pageLinks.push(
        <PaginationItem key={totalPages}>
          <Link href={getPageHref(totalPages)} passHref legacyBehavior>
            <PaginationLink isActive={currentPage === totalPages}>
              {totalPages}
            </PaginationLink>
          </Link>
        </PaginationItem>
      );
    }

    return pageLinks;
  };

  return (
    <div className="relative">
      <div className="text-xs text-muted-foreground absolute left-0 top-1/2 -translate-y-1/2">
        Showing{" "}
        <strong>
          {Math.min(
            itemsPerPage,
            totalItems - (currentPage - 1) * itemsPerPage
          )}
        </strong>{" "}
        of <strong>{totalItems}</strong> items
      </div>
      <Pagination className="mt-5">
        <PaginationContent>
          <PaginationItem>
            <Link
              href={getPageHref(Math.max(1, currentPage - 1))}
              passHref
              legacyBehavior
            >
              <PaginationPrevious
                className={cn({
                  "pointer-events-none opacity-50": currentPage === 1,
                })}
              />
            </Link>
          </PaginationItem>

          {renderPageLinks()}

          <PaginationItem>
            <Link
              href={getPageHref(Math.min(totalPages, currentPage + 1))}
              passHref
              legacyBehavior
            >
              <PaginationNext
                className={cn({
                  "pointer-events-none opacity-50": currentPage === totalPages,
                })}
              />
            </Link>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
