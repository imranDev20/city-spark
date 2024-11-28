"use client";

import React, { useRef } from "react";
import { Card } from "@/components/ui/card";
import { Trash2, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { formatDistance } from "date-fns";
import { NumericFormat } from "react-number-format";
import { cn } from "@/lib/utils";
import { Prisma } from "@prisma/client";
import { statusMap } from "@/app/data";
import { useDrag } from "@use-gesture/react";
import { animated, useSpring } from "@react-spring/web";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import PlaceholderImage from "@/images/placeholder-image.png";

export type ProductWithRelations = Prisma.ProductGetPayload<{
  select: {
    id: true;
    name: true;
    status: true;
    images: true;
    tradePrice: true;
    promotionalPrice: true;
    createdAt: true;
    updatedAt: true;
    brand: {
      select: {
        id: true;
        name: true;
      };
    };
    primaryCategory: {
      select: {
        id: true;
        name: true;
      };
    };
  };
}>;

interface SwipeableProductCardProps {
  product: ProductWithRelations;
  onDelete?: (productId: string) => void;
}

export default function SwipeableProductCard({
  product,
  onDelete,
}: SwipeableProductCardProps) {
  const isOpen = useRef(false);
  const [showDeleteAlert, setShowDeleteAlert] = React.useState(false);
  const SWIPE_DISTANCE = -100;

  const [{ x }, api] = useSpring(() => ({
    x: 0,
    config: {
      tension: 200,
      friction: 20,
      mass: 0.5,
    },
  }));

  const bind = useDrag(
    ({ down, movement: [mx], direction: [dx], velocity: [vx] }) => {
      const swipeDirection = dx > 0 ? "right" : "left";
      const willOpen =
        (!isOpen.current && swipeDirection === "left") ||
        (isOpen.current && swipeDirection === "left");
      const willClose =
        (isOpen.current && swipeDirection === "right") ||
        (!isOpen.current && swipeDirection === "right");

      if (down) {
        api.start({
          x: isOpen.current ? SWIPE_DISTANCE + mx : mx,
          immediate: true,
        });
      } else {
        const shouldOpen =
          willOpen && (Math.abs(vx) > 0.5 || Math.abs(mx) > 40);
        const shouldClose =
          willClose && (Math.abs(vx) > 0.5 || Math.abs(mx) > 40);

        if (shouldOpen) {
          api.start({ x: SWIPE_DISTANCE });
          isOpen.current = true;
        } else if (shouldClose || !shouldOpen) {
          api.start({ x: 0 });
          isOpen.current = false;
        }
      }
    },
    {
      axis: "x",
      bounds: { left: SWIPE_DISTANCE, right: 0 },
      rubberband: true,
      from: () => [x.get(), 0],
    }
  );

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowDeleteAlert(true);
  };

  const handleConfirmDelete = () => {
    api.start({ x: 0 });
    isOpen.current = false;
    setShowDeleteAlert(false);
    onDelete?.(product.id);
  };

  return (
    <>
      <div className="relative overflow-hidden rounded-xl mb-2">
        {/* Delete button container */}
        <div className="absolute inset-y-0 right-0 w-[85px] bg-destructive/10 rounded-xl">
          <animated.div
            style={{
              opacity: x.to([SWIPE_DISTANCE, -40, 0], [1, 0.5, 0]),
            }}
            className="h-full"
          >
            <button
              onClick={handleDeleteClick}
              className="h-full w-full flex flex-col items-center justify-center bg-destructive text-white transition-colors hover:bg-destructive/90 active:bg-destructive/80 rounded-xl"
            >
              <Trash2 className="w-5 h-5 mb-1" />
              <span className="text-xs font-medium">Delete</span>
            </button>
          </animated.div>
        </div>

        {/* Main card content */}
        <animated.div
          {...bind()}
          style={{
            x,
            touchAction: "pan-y",
          }}
          className="relative z-10"
        >
          <Link href={`/admin/products/${product.id}/edit`}>
            <Card className="shadow-none duration-200 bg-white rounded-xl border-gray-200">
              <div className="p-4 flex items-center gap-4">
                {/* Product image */}
                <div className="relative h-16 w-16 rounded-lg overflow-hidden bg-gray-50 flex-shrink-0">
                  <Image
                    src={product.images[0] || PlaceholderImage}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-200 group-hover:scale-105"
                    sizes="64px"
                  />
                </div>

                {/* Product details */}
                <div className="flex-1 min-w-0">
                  {/* Header section */}
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-medium text-sm text-gray-900 leading-5 line-clamp-2">
                      {product.name}
                    </h3>
                    <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0 mt-1" />
                  </div>

                  {/* Status and timestamp */}
                  <div className="mt-2 flex items-center gap-2">
                    <div
                      className={cn(
                        "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium",
                        statusMap[product.status || "DRAFT"].className
                      )}
                    >
                      <div
                        className={cn(
                          "h-1.5 w-1.5 rounded-full mr-1.5",
                          statusMap[product.status || "DRAFT"].indicator
                        )}
                      />
                      {statusMap[product.status || "DRAFT"].label}
                    </div>
                    <span className="text-xs text-gray-500">
                      {formatDistance(new Date(product.updatedAt), new Date(), {
                        addSuffix: true,
                      })}
                    </span>
                  </div>

                  {/* Footer section */}
                  <div className="mt-2 flex items-center justify-between">
                    <p className="text-xs text-gray-600">
                      {[product.brand?.name, product.primaryCategory?.name]
                        .filter(Boolean)
                        .join(" • ")}
                    </p>
                    <div className="text-right">
                      {product.promotionalPrice &&
                      product.promotionalPrice < (product.tradePrice || 0) ? (
                        <div className="flex flex-col items-end">
                          <span className="text-xs text-gray-500 line-through">
                            <NumericFormat
                              value={product.tradePrice}
                              displayType="text"
                              prefix="£"
                              decimalScale={2}
                              fixedDecimalScale
                              thousandSeparator
                            />
                          </span>
                          <span className="text-sm font-medium text-destructive">
                            <NumericFormat
                              value={product.promotionalPrice}
                              displayType="text"
                              prefix="£"
                              decimalScale={2}
                              fixedDecimalScale
                              thousandSeparator
                            />
                          </span>
                        </div>
                      ) : (
                        <span className="text-sm font-medium text-gray-900">
                          <NumericFormat
                            value={product.tradePrice}
                            displayType="text"
                            prefix="£"
                            decimalScale={2}
                            fixedDecimalScale
                            thousandSeparator
                          />
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </Link>
        </animated.div>
      </div>

      {/* Delete confirmation dialog */}
      <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
        <AlertDialogContent className="sm:max-w-[425px]">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Product</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{product.name}&quot;? This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-destructive hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
