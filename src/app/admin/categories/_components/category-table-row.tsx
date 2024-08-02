"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenu,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TableCell, TableRow } from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import { Prisma } from "@prisma/client";
import dayjs from "dayjs";
import { MoreHorizontal } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useTransition } from "react";

import Image from "next/image";
import useQueryString from "@/hooks/use-query-string";
import { deleteCategory } from "../actions";

export type CategoryWithRelations = Prisma.CategoryGetPayload<{
  include: {
    parentCategory: true;
  };
}>;

export default function CategoriesTableRow({
  category,
}: {
  category: CategoryWithRelations;
}) {
  const router = useRouter();
  const { createQueryString } = useQueryString();
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleDelete = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation();

    startTransition(async () => {
      const result = await deleteCategory(category.id);

      if (result?.success) {
        toast({
          title: "Category Deleted",
          description: result.message,
          variant: "success",
        });
      } else {
        toast({
          title: "Error Deleting Category",
          description: result?.message,
          variant: "destructive",
        });
      }
    });
  };

  return (
    <TableRow
      key={category.id}
      onClick={() =>
        router.push(
          `/admin/categories/${category.id}?${createQueryString({
            category_type: category.type,
            parent_category_id: category.parentId || "",
          })}`
        )
      }
      className={`cursor-pointer ${isPending ? "opacity-30" : "opacity-100"}`}
    >
      <TableCell className="hidden sm:table-cell">
        {category?.image && (
          <Image
            alt="Category Image"
            className="aspect-square rounded-md object-cover"
            height="64"
            src={category.image}
            // src=''
            width="64"
          />
        )}
      </TableCell>
      <TableCell className="font-medium flex-1">{category.name} </TableCell>
      <TableCell className="hidden md:table-cell">{category.type} </TableCell>
      <TableCell className="hidden md:table-cell">
        {category?.parentCategory
          ? `${category.parentCategory.name} (${
              category.parentCategory.type.charAt(0).toUpperCase() +
              category.parentCategory.type.slice(1).toLowerCase()
            })`
          : "N/A"}
      </TableCell>

      <TableCell className="hidden md:table-cell">
        {dayjs(category.createdAt).format("DD-MM-YY hh:mm A")}
      </TableCell>

      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button aria-haspopup="true" size="icon" variant="ghost">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => router.push(`/admin/categories/${category.id}`)}
            >
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={(e) => {
                handleDelete(e);
              }}
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}
