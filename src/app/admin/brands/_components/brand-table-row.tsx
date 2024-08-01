"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TableCell, TableRow } from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import { Brand, Prisma } from "@prisma/client";
import { MoreHorizontal } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { deleteBrand } from "../actions";
import PlaceholderImage from "@/images/placeholder-image.jpg";

export default function BrandTableRow({ brand }: { brand: Brand }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleDelete = () => {
    startTransition(async () => {
      const result = await deleteBrand(brand.id);

      if (result.success) {
        toast({
          title: "Brand Deleted",
          description: result.message,
          variant: "success",
        });
      } else {
        toast({
          title: "Failed",
          description: result.message,
          variant: "destructive",
        });
      }
    });
  };
  return (
    <TableRow
      key={brand.id}
      onClick={() => router.push(`/admin/brands/${brand.id}`)}
      className={`cursor-pointer ${isPending ? "opacity-30" : "opacity-100"}`}
    >
      <TableCell className="hidden sm:table-cell">
        {brand.image ? (
          <Image
            alt="Product image"
            className="aspect-square rounded-md object-cover border border-input"
            height="64"
            src={brand.image}
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
      <TableCell className="font-medium">{brand.name}</TableCell>
      <TableCell>
        <Badge variant="outline">Draft</Badge>
      </TableCell>
      <TableCell className="hidden md:table-cell">$499.99</TableCell>
      <TableCell className="hidden md:table-cell">25</TableCell>
      <TableCell className="hidden md:table-cell">
        2023-07-12 10:42 AM
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
