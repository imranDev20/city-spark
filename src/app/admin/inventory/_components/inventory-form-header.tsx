"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LoadingButton } from "@/components/ui/loading-button";
import { Box, Check, ChevronLeft, Eye, X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useFormContext } from "react-hook-form";
import { customSlugify } from "@/lib/functions";
import { Prisma } from "@prisma/client";
import { cn } from "@/lib/utils";

type InventoryWithRelations = Prisma.InventoryGetPayload<{
  include: {
    product: true;
  };
}>;

interface InventoryFormHeaderProps {
  inventoryDetails: InventoryWithRelations;
  isPending: boolean;
}

export default function InventoryFormHeader({
  inventoryDetails,
  isPending,
}: InventoryFormHeaderProps) {
  const {
    formState: { isDirty },
  } = useFormContext();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const productStoreUrl = `/products/p/${customSlugify(
    inventoryDetails.product.name
  )}/p/${inventoryDetails.id}`;

  return (
    <>
      <div
        className={cn(
          "sticky top-0 z-[10] w-full",
          isScrolled ? "bg-white shadow-md" : "bg-zinc-50"
        )}
      >
        <div
          className={cn(
            "px-8 py-3 transition-all duration-200",
            "container pb-4 px-4 sm:px-8"
          )}
        >
          <div className="flex items-center gap-4">
            <Link href="/admin/inventory">
              <Button variant="outline" size="icon" className="h-9 w-9">
                <ChevronLeft className="h-5 w-5" />
                <span className="sr-only">Back</span>
              </Button>
            </Link>

            <div className="flex-1 min-w-0">
              <h1 className="text-xl font-semibold tracking-tight truncate">
                Edit {inventoryDetails.product.name}
              </h1>

              <div className="flex items-center space-x-4 mt-2">
                <Link
                  href={productStoreUrl}
                  className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Eye className="h-4 w-4 mr-1.5" />
                  View in store
                </Link>

                <Link
                  href={`/admin/products/${inventoryDetails.productId}`}
                  className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  <Box className="h-4 w-4 mr-1.5" />
                  View Product
                </Link>
              </div>
            </div>

            <div className="hidden items-center gap-2 md:flex">
              <Link href="/admin/inventory">
                <Button type="button" variant="outline" className="h-9">
                  <X className="mr-2 h-4 w-4" />
                  Cancel
                </Button>
              </Link>
              <LoadingButton
                type="submit"
                className="h-9"
                disabled={!isDirty || isPending}
                loading={isPending}
              >
                {!isPending && <Check className="mr-2 h-4 w-4" />}
                Save Changes
              </LoadingButton>
            </div>
          </div>
        </div>
      </div>

      {isDirty && (
        <div className="mt-4 container px-4 sm:px-8">
          <Card className="bg-amber-50 border-amber-200">
            <CardContent className="p-3">
              <div className="text-sm text-amber-600 flex items-center">
                <div className="h-1.5 w-1.5 rounded-full bg-amber-500 mr-2" />
                You have unsaved changes. Don&apos;t forget to save your work.
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}
