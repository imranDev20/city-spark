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
import { Package2 } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { fetchProducts, FetchProductsParams } from "@/services/admin-products";
import ProductsLoading from "./products-loading";
import ProductTableRow from "./product-table-row";

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

  const { data, isLoading, isError, isFetching, isFetchedAfterMount } =
    useQuery({
      queryKey: ["products", currentParams],
      queryFn: () => fetchProducts(currentParams),
    });

  if (isLoading || isFetching) {
    return <ProductsLoading />;
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
      <Card className="shadow-sm border-gray-200 overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-auto h-[calc(100vh-325px)] relative">
            <Table>
              <TableHeader className="bg-gray-50 sticky top-0 z-10">
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
                  <ProductTableRow key={product.id} product={product} />
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
