"use client";

import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";

export default function CategoryNavSkeleton() {
  const pathname = usePathname();
  const excludedRoutes = [
    "/login",
    "/register",
    "/cart",
    "/checkout",
    "/basket",
  ];

  if (excludedRoutes.includes(pathname)) {
    return null;
  }

  return (
    <div className="relative bg-white border-b hidden lg:block">
      <div className="container mx-auto max-w-screen-xl px-0">
        <ul className="flex w-full" role="menubar">
          {Array.from({ length: 10 }).map((_, index) => (
            <li
              key={index}
              className="flex-1 relative border-r last:border-r-0 border-border"
            >
              <div
                className={cn(
                  "flex flex-col items-center justify-center gap-1 p-3 w-full",
                  "relative overflow-hidden"
                )}
              >
                <Skeleton className="h-8 w-8 rounded-md" />{" "}
                {/* Icon skeleton */}
                <Skeleton className="h-3 w-16 mt-1 rounded-md" />{" "}
                {/* Text skeleton */}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
