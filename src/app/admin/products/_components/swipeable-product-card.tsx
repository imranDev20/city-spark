import React, { useRef } from "react";
import { Card } from "@/components/ui/card";
import { Pencil, Trash2, ChevronRight } from "lucide-react";
import Image from "next/image";
import { formatDistance } from "date-fns";
import { NumericFormat } from "react-number-format";
import { cn } from "@/lib/utils";
import { Prisma } from "@prisma/client";
import { statusMap } from "@/app/data";
import { useDrag } from "@use-gesture/react";
import { animated, useSpring } from "@react-spring/web";

type ProductWithRelations = Prisma.ProductGetPayload<{
  include: {
    brand: true;
    primaryCategory: true;
    secondaryCategory: true;
    tertiaryCategory: true;
    quaternaryCategory: true;
  };
}>;

interface SwipeableProductCardProps {
  product: ProductWithRelations;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function SwipeableProductCard({
  product,
  onEdit,
  onDelete,
}: SwipeableProductCardProps) {
  const isOpen = useRef(false);

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
      // If we're open and swiping right OR closed and swiping left
      const swipeDirection = dx > 0 ? "right" : "left";
      const willOpen =
        (!isOpen.current && swipeDirection === "left") ||
        (isOpen.current && swipeDirection === "left");
      const willClose =
        (isOpen.current && swipeDirection === "right") ||
        (!isOpen.current && swipeDirection === "right");

      if (down) {
        // While dragging, just follow the finger
        api.start({
          x: isOpen.current ? -130 + mx : mx,
          immediate: true,
        });
      } else {
        // On release, decide whether to open or close
        const shouldOpen =
          willOpen && (Math.abs(vx) > 0.5 || Math.abs(mx) > 40);
        const shouldClose =
          willClose && (Math.abs(vx) > 0.5 || Math.abs(mx) > 40);

        if (shouldOpen) {
          api.start({ x: -130 });
          isOpen.current = true;
        } else if (shouldClose || !shouldOpen) {
          api.start({ x: 0 });
          isOpen.current = false;
        }
      }
    },
    {
      axis: "x",
      bounds: { left: -130, right: 0 },
      rubberband: true,
      from: () => [x.get(), 0],
    }
  );

  const handleAction = (action: "edit" | "delete") => {
    api.start({ x: 0 });
    isOpen.current = false;
    if (action === "edit") {
      onEdit(product.id);
    } else {
      onDelete(product.id);
    }
  };

  return (
    <div className="relative overflow-hidden">
      <div className="absolute right-0 top-0 h-full flex items-stretch z-0">
        <animated.div
          style={{
            opacity: x.to([-130, -100, -50, 0], [1, 1, 0.5, 0]),
          }}
          className="flex items-center px-1"
        >
          <button
            onClick={() => handleAction("edit")}
            className="h-full w-16 flex flex-col items-center justify-center gap-1 text-primary"
          >
            <div className="rounded-full bg-primary/10 p-2">
              <Pencil className="w-5 h-5" />
            </div>
            <span className="text-xs font-medium">Edit</span>
          </button>
        </animated.div>

        <animated.div
          style={{
            opacity: x.to([-130, -80, -40, 0], [1, 0.5, 0, 0]),
          }}
          className="flex items-center px-1"
        >
          <button
            onClick={() => handleAction("delete")}
            className="h-full w-16 flex flex-col items-center justify-center gap-1 text-destructive"
          >
            <div className="rounded-full bg-destructive/10 p-2">
              <Trash2 className="w-5 h-5" />
            </div>
            <span className="text-xs font-medium">Delete</span>
          </button>
        </animated.div>
      </div>

      <animated.div
        {...bind()}
        style={{
          x,
          touchAction: "pan-y",
        }}
        className="relative z-10"
      >
        <Card className="shadow-sm bg-white">
          {/* Card content remains the same */}
          <div className="p-4 flex items-center gap-3">
            <div className="relative h-16 w-16 rounded-xl overflow-hidden bg-gray-50 flex-shrink-0">
              <Image
                src={product.images[0] || "/api/placeholder/100/100"}
                alt={product.name}
                fill
                className="object-cover"
                sizes="64px"
              />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-medium text-sm text-gray-900 line-clamp-2">
                  {product.name}
                </h3>
                <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0 mt-1" />
              </div>

              <div className="mt-1 flex items-center gap-2 flex-wrap">
                <div
                  className={cn(
                    "inline-flex items-center px-2 py-0.5 rounded-full text-xs",
                    statusMap[product.status || "DRAFT"].className
                  )}
                >
                  <div
                    className={cn(
                      "h-1.5 w-1.5 rounded-full mr-1",
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

              <div className="mt-1.5 flex items-center justify-between">
                <p className="text-xs text-gray-500">
                  {[product.brand?.name, product.primaryCategory?.name]
                    .filter(Boolean)
                    .join(" • ")}
                </p>
                <div className="text-right">
                  <span className="text-sm font-medium">
                    <NumericFormat
                      value={product.tradePrice}
                      displayType="text"
                      prefix="£"
                      decimalScale={2}
                      fixedDecimalScale
                      thousandSeparator
                    />
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </animated.div>
    </div>
  );
}
