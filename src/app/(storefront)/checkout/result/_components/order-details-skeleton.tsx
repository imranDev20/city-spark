import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";

export default function OrderDetailsSkeleton() {
  return (
    <>
      <div className="text-center mb-14">
        <Skeleton className="h-10 w-2/3 mx-auto mb-4" />
        <Skeleton className="h-6 w-3/4 mx-auto" />
      </div>

      <Card className="bg-white overflow-hidden mb-10">
        <div className="bg-gray-50 px-8 py-5 border-b border-gray-200">
          <Skeleton className="h-7 w-40" />
        </div>

        <div className="p-8">
          <div className="grid grid-cols-1 gap-10">
            {/* Order Details */}
            <div className="grid sm:grid-cols-2 gap-x-8 gap-y-4">
              {[...Array(4)].map((_, i) => (
                <div key={i}>
                  <Skeleton className="h-4 w-24 mb-2" />
                  <Skeleton className="h-6 w-32" />
                </div>
              ))}
            </div>

            <Separator />

            {/* Delivery Items */}
            <div>
              <Skeleton className="h-5 w-40 mb-6" />
              {[...Array(2)].map((_, i) => (
                <div key={i} className="flex justify-between mb-5">
                  <div className="w-2/3">
                    <Skeleton className="h-5 w-40 mb-2" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                  <Skeleton className="h-6 w-20" />
                </div>
              ))}
              <div className="flex justify-end mb-6">
                <Skeleton className="h-7 w-32" />
              </div>
              <Skeleton className="h-32 w-full" />
            </div>

            <Separator />

            {/* Order Total */}
            <div>
              <Skeleton className="h-5 w-32 mb-6" />
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex justify-between">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                ))}
                <Separator className="my-2" />
                <div className="flex justify-between">
                  <Skeleton className="h-6 w-16" />
                  <Skeleton className="h-6 w-24" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 mb-14">
        <Skeleton className="h-12 w-full flex-1" />
        <Skeleton className="h-12 w-full flex-1" />
      </div>
    </>
  );
}
