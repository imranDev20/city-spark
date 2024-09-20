"use client";

import { Badge } from "@/components/ui/badge";
import { TableCell, TableRow } from "@/components/ui/table";
import { Prisma } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import dayjs from "dayjs";

import React, { useTransition } from "react";
import { deleteProduct } from "../actions";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Edit, Trash2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import PlaceholderImage from "@/images/placeholder-image.jpg";

export type ProductWithRelations = Prisma.ProductGetPayload<{
  include: {
    images: true;
    brand: true;
    primaryCategory: true;
  };
}>;

export default function ProductTableRow({
  product,
}: {
  product: ProductWithRelations;
}) {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleDelete = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.preventDefault();
    e.stopPropagation();

    startTransition(async () => {
      const result = await deleteProduct(product.id);

      if (result.success) {
        toast({
          title: "Product Deleted",
          description: "The product has been successfully deleted.",
          variant: "success",
        });
      } else {
        toast({
          title: "Error Deleting Product",
          description:
            result.message ||
            "There was an error deleting the product. Please try again.",
          variant: "destructive",
        });
      }
    });
  };

  return (
    <TableRow
      key={product.id}
      className={`${isPending ? "opacity-30" : "opacity-100"}`}
    >
      <Link href={`/admin/products/${product.id}`} className="contents">
        <TableCell className="hidden sm:table-cell">
          <Image
            alt="Product image"
            className="aspect-square rounded-md object-cover border border-input"
            height="64"
            src={product.images[0] || PlaceholderImage}
            width="64"
          />
        </TableCell>
        <TableCell className="font-medium flex-1">{product.name}</TableCell>
        <TableCell>
          <Badge variant="outline">{product.status}</Badge>
        </TableCell>
        <TableCell className="hidden md:table-cell">
          {product.brand?.name || "N/A"}
        </TableCell>
        <TableCell className="hidden md:table-cell">
          {product.primaryCategory?.name || "N/A"}
        </TableCell>
        <TableCell className="hidden md:table-cell">
          {dayjs(product.createdAt).format("DD-MM-YY hh:mm A")}
        </TableCell>

        <TableCell>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                aria-haspopup="true"
                size="icon"
                variant="ghost"
                onClick={(e) => e.preventDefault()}
              >
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={(e) => {
                  e.preventDefault();
                  window.location.href = `/admin/products/${product.id}`;
                }}
              >
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleDelete}>
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </TableCell>
      </Link>
    </TableRow>
  );
}
