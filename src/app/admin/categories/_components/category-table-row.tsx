"use client";

import { TableCell, TableRow } from "@/components/ui/table";
import { Prisma } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import dayjs from "dayjs";
import { Checkbox } from "@/components/ui/checkbox";
import PlaceholderImage from "@/images/placeholder-image.png";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Pencil, Trash2, Eye } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useTransition } from "react";
import { deleteCategory } from "../actions";

export type CategoryWithRelations = Prisma.CategoryGetPayload<{
  include: {
    parentPrimaryCategory: true;
    parentSecondaryCategory: true;
    parentTertiaryCategory: true;
  };
}>;

export default function CategoriesTableRow({
  category,
}: {
  category: CategoryWithRelations;
}) {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
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

  const directParent =
    category.parentTertiaryCategory ||
    category.parentSecondaryCategory ||
    category.parentPrimaryCategory;

  return (
    <TableRow
      key={category.id}
      className={`group relative ${isPending ? "opacity-30" : "opacity-100"}`}
    >
      <TableCell className="pl-6">
        <Checkbox />
      </TableCell>
      <TableCell className="py-4">
        <Link
          href={`/admin/categories/${category.id}`}
          className="absolute inset-0 z-10"
        />
        <div className="relative">
          <div className="h-14 w-14 rounded-lg overflow-hidden bg-gray-50">
            <Image
              src={category?.image || PlaceholderImage}
              alt={category.name}
              fill
              className="object-cover"
            />
          </div>
        </div>
      </TableCell>
      <TableCell className="py-4">
        <div className="relative">
          <div className="flex flex-col">
            <span className="font-medium text-gray-900 line-clamp-1">
              {category.name}
            </span>
            <span className="text-sm text-gray-500 mt-1">{category.type}</span>
          </div>
        </div>
      </TableCell>
      <TableCell>
        <div className="relative">
          {directParent ? (
            <div className="text-sm">
              {directParent.name}{" "}
              <span className="text-gray-500">
                (
                {directParent.type?.charAt(0).toUpperCase() +
                  directParent.type?.slice(1).toLowerCase()}
                )
              </span>
            </div>
          ) : (
            <span className="text-sm text-gray-500">N/A</span>
          )}
        </div>
      </TableCell>
      <TableCell className="text-sm text-gray-500">
        <div className="relative">
          {dayjs(category.createdAt).format("DD-MM-YY hh:mm A")}
        </div>
      </TableCell>
      <TableCell className="pr-6">
        <div className="relative z-20">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[160px]">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href={`/admin/categories/${category.id}`}>
                  <Eye className="mr-2 h-4 w-4" />
                  View Details
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/admin/categories/${category.id}`}>
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit Category
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600" onClick={handleDelete}>
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Category
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </TableCell>
    </TableRow>
  );
}
