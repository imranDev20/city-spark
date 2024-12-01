"use client";

import { TableCell, TableRow } from "@/components/ui/table";
import { Prisma } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { formatDistance } from "date-fns";
import { cn } from "@/lib/utils";
import { NumericFormat } from "react-number-format";
import { Checkbox } from "@/components/ui/checkbox";
import { statusMap } from "@/app/data";
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
import { MoreHorizontal, Pencil, Trash2, Eye, Archive } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useTransition } from "react";
import { deleteProduct } from "../actions";

type ProductWithRelations = Prisma.ProductGetPayload<{
  include: {
    brand: true;
    primaryCategory: true;
    images: true;
    tradePrice: true;
    promotionalPrice: true;
    status: true;
    updatedAt: true;
  };
}>;

export default function ProductTableRow({
  product,
}: {
  product: ProductWithRelations;
}) {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleDelete = (e: React.MouseEvent) => {
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
    <TableRow key={product.id} className="group relative">
      <TableCell className="pl-6">
        <Checkbox />
      </TableCell>
      <TableCell className="py-4">
        <Link
          href={`/admin/products/${product.id}`}
          className="absolute inset-0 z-10"
        />
        <div className="relative">
          <div className="h-14 w-14 rounded-lg overflow-hidden bg-gray-50">
            <Image
              src={product.images[0] || PlaceholderImage}
              alt={product.name}
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
              {product.name}
            </span>
            <span className="text-sm text-gray-500 mt-1 line-clamp-1">
              {[product.brand?.name, product.primaryCategory?.name]
                .filter(Boolean)
                .join(" • ")}
            </span>
          </div>
        </div>
      </TableCell>
      <TableCell>
        <div className="relative">
          <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-gray-50">
            <div
              className={cn(
                "h-1.5 w-1.5 rounded-full mr-2",
                statusMap[product.status || "DRAFT"].indicator
              )}
            />
            <span className="text-sm font-medium">
              {statusMap[product.status || "DRAFT"].label}
            </span>
          </div>
        </div>
      </TableCell>
      <TableCell>
        <div className="relative">
          <div className="flex flex-col">
            <span className="font-medium text-base">
              <NumericFormat
                value={product.tradePrice}
                displayType="text"
                prefix="£"
                decimalScale={2}
                fixedDecimalScale
                thousandSeparator
              />
            </span>
            {product.promotionalPrice && (
              <span className="text-sm text-emerald-600 font-medium mt-0.5">
                <NumericFormat
                  value={product.promotionalPrice}
                  displayType="text"
                  prefix="£"
                  decimalScale={2}
                  fixedDecimalScale
                  thousandSeparator
                />{" "}
                promo
              </span>
            )}
          </div>
        </div>
      </TableCell>
      <TableCell className="text-sm text-gray-500">
        <div className="relative">
          {formatDistance(new Date(product.updatedAt), new Date(), {
            addSuffix: true,
          })}
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
                <Link href={`/admin/products/${product.id}`}>
                  <Eye className="mr-2 h-4 w-4" />
                  View Details
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/admin/products/${product.id}`}>
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit Product
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Archive className="mr-2 h-4 w-4" />
                Archive Product
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600" onClick={handleDelete}>
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Product
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </TableCell>
    </TableRow>
  );
}
