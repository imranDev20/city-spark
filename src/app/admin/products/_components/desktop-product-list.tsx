"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ReusablePagination } from "@/components/custom/pagination";
import { Package2, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { Checkbox } from "@/components/ui/checkbox";
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
import Link from "next/link";
import { formatDistance } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { fetchProducts, FetchProductsParams } from "@/services/admin-products";
import { NumericFormat } from "react-number-format";
import { statusMap } from "@/app/data";

export default function DesktopProductList() {
  const searchParams = useSearchParams();

  const currentParams: FetchProductsParams = {
    page: searchParams.get("page") || "1",
    pageSize: "10",
    search: searchParams.get("search") || "",
    sort_by: searchParams.get("sort_by") || "updatedAt",
    sort_order:
      (searchParams.get("sort_order") as FetchProductsParams["sort_order"]) ||
      "desc",
    filter_status: searchParams.get("filter_status") || "",
  };

  const { data, isLoading, isError } = useQuery({
    queryKey: ["products", currentParams],
    queryFn: () => fetchProducts(currentParams),
  });

  if (isLoading) {
    return (
      <div className="hidden lg:flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-[400px] text-red-500">
        Error loading products. Please try again later.
      </div>
    );
  }

  if (!data || !data.products.length) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-gray-500">
        <Package2 className="h-12 w-12 mb-4" />
        <p>No products found</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 hidden lg:block">
      <Card className="shadow-sm border-gray-200">
        <CardContent className="p-0">
          <div className="roverflow-auto h-[calc(100vh-325px)] relative">
            <Table>
              <TableHeader className="bg-gray-50/80 sticky top-0">
                <TableRow>
                  <TableHead className="w-14 pl-6">
                    <Checkbox />
                  </TableHead>
                  <TableHead className="w-24 py-5">
                    <span className="sr-only">Image</span>
                  </TableHead>
                  <TableHead className="w-[40%] min-w-[300px]">
                    Product Details
                  </TableHead>
                  <TableHead className="w-[15%] min-w-[120px]">
                    Status
                  </TableHead>
                  <TableHead className="w-[15%] min-w-[140px]">Price</TableHead>
                  <TableHead className="w-[15%] min-w-[140px]">
                    Last Updated
                  </TableHead>
                  <TableHead className="w-14 pr-6"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.products.map((product) => (
                  <TableRow key={product.id} className="group relative">
                    <TableHead className="pl-6">
                      <Checkbox />
                    </TableHead>
                    <TableHead className="py-4">
                      <Link
                        href={`/admin/products/${product.id}`}
                        className="absolute inset-0 z-10"
                      />
                      <div className="relative">
                        <div className="h-14 w-14 rounded-lg overflow-hidden bg-gray-50">
                          <Image
                            src={
                              product.images[0] || "/api/placeholder/100/100"
                            }
                            alt={product.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                      </div>
                    </TableHead>
                    <TableHead className="py-4">
                      <div className="relative">
                        <div className="flex flex-col">
                          <span className="font-medium text-gray-900 line-clamp-1">
                            {product.name}
                          </span>
                          <span className="text-sm text-gray-500 mt-1 line-clamp-1">
                            {[
                              product.brand?.name,
                              product.primaryCategory?.name,
                            ]
                              .filter(Boolean)
                              .join(" • ")}
                          </span>
                        </div>
                      </div>
                    </TableHead>
                    <TableHead>
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
                    </TableHead>
                    <TableHead>
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
                    </TableHead>
                    <TableHead className="text-sm text-gray-500">
                      <div className="relative">
                        {formatDistance(
                          new Date(product.updatedAt),
                          new Date(),
                          {
                            addSuffix: true,
                          }
                        )}
                      </div>
                    </TableHead>
                    <TableHead className="pr-6">
                      <div className="relative">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            align="end"
                            className="w-[160px]"
                          >
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild>
                              <Link href={`/admin/products/${product.id}`}>
                                <Eye className="mr-2 h-4 w-4" />
                                View Details
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link href={`/admin/products/${product.id}/edit`}>
                                <Pencil className="mr-2 h-4 w-4" />
                                Edit Product
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Archive className="mr-2 h-4 w-4" />
                              Archive Product
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600">
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete Product
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableHead>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <ReusablePagination
        currentPage={data.pagination.currentPage}
        totalPages={data.pagination.totalPages}
        totalItems={data.pagination.totalCount}
        itemsPerPage={data.pagination.pageSize}
      />
    </div>
  );
}
