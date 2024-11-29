"use client";

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
import { Edit, MoreHorizontal, Trash2 } from "lucide-react";
import Link from "next/link";
import React, { useTransition } from "react";
import Image from "next/image";
import { deleteBrand } from "../actions";
import PlaceholderImage from "@/images/placeholder-image.png";

export type BrandWithRelations = Prisma.BrandGetPayload<{}>;

export default function BrandsTableRow({
  brand,
}: {
  brand: BrandWithRelations;
}) {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleDelete = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.preventDefault();
    e.stopPropagation();

    startTransition(async () => {
      const result = await deleteBrand(brand.id);

      if (result?.success) {
        toast({
          title: "Brand Deleted",
          description: result.message,
          variant: "success",
        });
      } else {
        toast({
          title: "Error Deleting Brand",
          description: result?.message,
          variant: "destructive",
        });
      }
    });
  };

  return (
    <TableRow className={`${isPending ? "opacity-30" : "opacity-100"}`}>
      <Link href={`/admin/brands/${brand.id}`} className="contents">
        <TableCell className="hidden sm:table-cell">
          {brand?.image ? (
            <Image
              alt="Brand Logo"
              className="aspect-square rounded-md object-cover"
              height="64"
              src={brand.image}
              width="64"
            />
          ) : (
            <Image
              alt="Brand Logo"
              className="aspect-square rounded-md object-cover border border-input"
              height="64"
              src={PlaceholderImage}
              loading="lazy"
              width="64"
            />
          )}
        </TableCell>
        <TableCell className="font-medium flex-1">{brand.name}</TableCell>
        <TableCell className="hidden md:table-cell">{brand.status}</TableCell>
        <TableCell className="hidden md:table-cell">
          {brand.countryOfOrigin}
        </TableCell>
        <TableCell className="hidden md:table-cell">
          {dayjs(brand.createdAt).format("DD-MM-YY hh:mm A")}
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
                  window.location.href = `/admin/brands/${brand.id}`;
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
