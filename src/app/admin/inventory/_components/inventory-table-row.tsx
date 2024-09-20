"use client";

import { TableCell, TableRow } from "@/components/ui/table";
import { Prisma } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import dayjs from "dayjs";
import React, { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Edit, MoreHorizontal, Link as LinkIcon } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { updateInventoryStock } from "../actions";
import PlaceholderImage from "@/images/placeholder-image.jpg";

export type InventoryWithRelations = Prisma.InventoryGetPayload<{
  include: {
    product: true;
  };
}>;

export default function InventoryTableRow({
  inventory,
}: {
  inventory: InventoryWithRelations;
}) {
  const [stockCount, setStockCount] = useState(inventory.stockCount);
  const { toast } = useToast();

  const handleStockUpdate = async (e: React.FocusEvent<HTMLInputElement>) => {
    e.preventDefault();
    const newStockCount = parseInt(e.target.value, 10);
    if (newStockCount !== inventory.stockCount) {
      try {
        await updateInventoryStock(inventory.id, newStockCount);
        toast({
          title: "Stock Updated",
          description: "The inventory stock has been updated successfully.",
          variant: "success",
        });
      } catch (error) {
        console.error("Error updating stock:", error);
        toast({
          title: "Error",
          description: "Failed to update the stock. Please try again.",
          variant: "destructive",
        });
        setStockCount(inventory.stockCount); // Revert to original value
      }
    }
  };

  return (
    <TableRow key={inventory.id}>
      <TableCell className="hidden sm:table-cell">
        <Image
          alt="Product image"
          className="aspect-square rounded-md object-cover border border-input"
          height="64"
          src={inventory.product.images[0] || PlaceholderImage}
          width="64"
        />
      </TableCell>
      <TableCell className="font-medium p-0">
        <Link
          href={`/admin/inventory/${inventory.id}`}
          className="block w-full h-full p-4 transition-colors"
        >
          {inventory?.product.name}
        </Link>
      </TableCell>
      <TableCell>
        <Input
          type="number"
          value={stockCount}
          onChange={(e) => setStockCount(parseInt(e.target.value, 10))}
          onBlur={handleStockUpdate}
          className="w-24" // Increased width from w-20 to w-24
          onClick={(e) => e.stopPropagation()}
        />
      </TableCell>
      <TableCell>{inventory.soldCount || 0}</TableCell>
      <TableCell>{inventory.heldCount || 0}</TableCell>
      <TableCell className="hidden md:table-cell">
        {dayjs(inventory.createdAt).format("DD-MM-YY hh:mm A")}
      </TableCell>
      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              aria-haspopup="true"
              size="icon"
              variant="ghost"
              onClick={(e) => e.stopPropagation()}
            >
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem asChild>
              <Link
                href={`/admin/inventory/${inventory.id}`}
                className="flex items-center"
              >
                <Edit className="mr-2 h-4 w-4" />
                Edit Inventory
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link
                href={`/admin/products/${inventory.product.id}`}
                className="flex items-center"
              >
                <LinkIcon className="mr-2 h-4 w-4" />
                View Related Product
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}
