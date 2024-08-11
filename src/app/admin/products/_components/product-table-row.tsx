"use client";

import { Badge } from "@/components/ui/badge";
import { TableCell, TableRow } from "@/components/ui/table";
import { Prisma } from "@prisma/client";
import Image from "next/image";
import { useRouter } from "next/navigation";
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
import { MoreHorizontal } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import PlaceholderImage from "@/images/placeholder-image.jpg";
import useQueryString from "@/hooks/use-query-string";

export type ProductWithRelations = Prisma.ProductGetPayload<{
  include: {
    images: true;
    brand: true;
    primaryCategory: true;
    secondaryCategory: true;
    tertiaryCategory: true;
    quaternaryCategory: true;
  };
}>;

export default function ProductTableRow({
  product,
}: {
  product: ProductWithRelations;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const { createQueryString } = useQueryString();

  const handleDelete = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation(); // Stop the propagation to prevent routing

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
            "There was an error deleting the product. Please try again.",
          variant: "destructive",
        });
      }
    });
  };

  return (
    <TableRow
      key={product.id}
      onClick={() =>
        router.push(
          `/admin/products/${product.id}?${createQueryString({
            primary_category_id: product.primaryCategory?.id || "",
            secondary_category_id: product.secondaryCategory?.id || "",
            tertiary_category_id: product.tertiaryCategory?.id || "",
            quaternary_category_id: product.quaternaryCategory?.id || "",
          })}`
        )
      }
      className={`cursor-pointer ${isPending ? "opacity-30" : "opacity-100"}`}
    >
      <TableCell className="hidden sm:table-cell">
        {product.images[0] ? (
          <Image
            alt="Product image"
            className="aspect-square rounded-md object-cover border border-input"
            height="64"
            src={product.images[0]}
            width="64"
          />
        ) : (
          <Image
            alt="Product image"
            className="aspect-square rounded-md object-cover border border-input"
            height="64"
            src={PlaceholderImage}
            loading="lazy"
            width="64"
          />
        )}
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
            <Button aria-haspopup="true" size="icon" variant="ghost">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem>Edit</DropdownMenuItem>
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
