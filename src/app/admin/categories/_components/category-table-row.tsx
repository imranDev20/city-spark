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
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  return (
    <TableRow
      key={category.id}
      onClick={() => router.push(`/admin/categories/${category.id}`)}
      className={`cursor-pointer ${isPending ? "opacity-30" : "opacity-100"}`}
    >
      <TableCell className="font-medium flex-1">{category.name} </TableCell>
      <TableCell className="font-medium flex-1">{category.type} </TableCell>
      <TableCell className="font-medium flex-1">
        {category?.parentCategory ?
          `${category.parentCategory.name} (${
            category.parentCategory.type.charAt(0).toUpperCase() +
            category.parentCategory.type.slice(1).toLowerCase()
          })` : 'N/A' }
      </TableCell>

      <TableCell className="font-medium flex-1">
        {" "}
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
            <DropdownMenuItem>Edit</DropdownMenuItem>
            <DropdownMenuItem>Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}
