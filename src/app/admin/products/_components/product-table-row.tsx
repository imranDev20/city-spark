"use client";
import { Badge } from "@/components/ui/badge";
import { TableCell, TableRow } from "@/components/ui/table";
import { Prisma } from "@prisma/client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";

import React, { useTransition } from "react";
import { Product } from "@prisma/client";
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
import { title } from "process";

type ProductWithRelations = Prisma.ProductGetPayload<{
  include: {
    images: true;
    brand: true;
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

  const handleDelete = () => {
    startTransition(async () => {
      const result = await deleteProduct(product.id);

      if (result.success) {
        // Handle successful deletion (e.g., show a success message, update UI)
        console.log(result.message);

        toast({
          title: "Product Deleted",
          description: "The product has been successfully deleted.",
          variant: "destructive",
        });
      } else {
        // Handle error (e.g., show an error message)
        console.error(result.message);
      }
    });
  };

  return (
    <TableRow
      key={product.id}
      onClick={() => router.push(`/admin/products/${product.id}`)}
      className={`cursor-pointer ${isPending ? "opacity-30" : "opacity-100"}`}
    >
      <TableCell className="hidden sm:table-cell">
        <Image
          alt="Product image"
          className="aspect-square rounded-md object-cover"
          height="64"
          src={product.images[0].url}
          width="64"
        />
      </TableCell>
      <TableCell className="font-medium">{product.name}</TableCell>
      <TableCell>
        <Badge variant="outline">{product.status}</Badge>
      </TableCell>
      <TableCell className="hidden md:table-cell">
        {product.brand?.name}
      </TableCell>
      <TableCell className="hidden md:table-cell">25</TableCell>
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
                e.stopPropagation();
                handleDelete();
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
