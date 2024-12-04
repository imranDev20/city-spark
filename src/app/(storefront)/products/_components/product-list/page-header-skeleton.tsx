import { Breadcrumb, BreadcrumbList } from "@/components/ui/breadcrumb";
import { Skeleton } from "@/components/ui/skeleton";

export default function PageHeaderSkeleton() {
  // Create an array of 3 items to show a reasonable loading state
  const items = Array.from({ length: 3 });

  return (
    <section className="hidden lg:block bg-primary py-8">
      <div className="container mx-auto max-w-screen-xl">
        <Breadcrumb>
          <BreadcrumbList>
            {/* Home item skeleton */}
            <div className="flex items-center">
              <div className="h-4 w-4 rounded bg-primary/20 animate-pulse" />
              <div className="ml-1 h-4 w-16 rounded bg-primary/20 animate-pulse" />
            </div>

            {items.map((_, index) => (
              <div key={index} className="flex items-center">
                {/* Separator */}
                <div className="mx-2 text-white">/</div>

                {/* Breadcrumb item skeleton */}
                <div
                  className={`h-4 rounded animate-pulse ${
                    index === items.length - 1
                      ? "w-24 bg-secondary/20"
                      : "w-20 bg-primary/20"
                  }`}
                />
              </div>
            ))}
          </BreadcrumbList>
        </Breadcrumb>

        {/* Title skeleton */}
        <Skeleton className="h-10 w-64 bg-white rounded animate-pulse mt-4" />
      </div>
    </section>
  );
}
