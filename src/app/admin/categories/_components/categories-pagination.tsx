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
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getAllCategories } from "../actions";

export function CategoriesPagination({ totalPages, currentPage, page }: { totalPages: number, currentPage: number, page: number }) {
 
  const [isClick, setIsClick] = useState<boolean>(false);
  const router = useRouter();
 
  
  return (
    <Pagination className="mt-5">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious onClick={() => {
            if (currentPage > 1) {
              router.push(`categories?page=${currentPage - 1}`);
              setIsClick(true);
              fetch
            }
          }} />
        </PaginationItem>
        {Array.from({ length: totalPages }, (_, i) => (
          <PaginationItem key={i}>
            <PaginationLink
              onClick={() => {
                router.push(`categories?page=${i + 1}`);
                setIsClick(true);
              
              }} 
              isActive={isClick && (i + 1) === page}
            >
              {i + 1}
            </PaginationLink>
          </PaginationItem>
        ))}
        <PaginationItem>
          <PaginationEllipsis />
        </PaginationItem>
        <PaginationItem>
          <PaginationNext onClick={() => {
            if (currentPage < totalPages) {
              router.push(`categories?page=${currentPage + 1}`);
              setIsClick(true);
            }
          }} />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
