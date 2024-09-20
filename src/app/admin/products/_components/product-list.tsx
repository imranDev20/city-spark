import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import ProductTableRow, { ProductWithRelations } from "./product-table-row";
import TableEmpty from "@/components/custom/table-empty";
import { ReusablePagination } from "@/components/custom/pagination";
import { getProducts } from "../actions";
import { Status } from "@prisma/client";

export default async function ProductList({
  searchParams,
}: {
  searchParams: {
    search?: string;
    page?: string;
    sort_by?: string;
    sort_order?: "asc" | "desc";
    filter_status?: Status;
  };
}) {
  const { search, page, sort_by, sort_order, filter_status } = searchParams;

  const { products, pagination } = await getProducts({
    page: page ? parseInt(page) : 1,
    pageSize: 10,
    search,
    sortBy: sort_by,
    sortOrder: sort_order as "asc" | "desc" | undefined,
    filterStatus: filter_status,
  });

  const { currentPage, totalCount, totalPages, pageSize } = pagination;

  return (
    <>
      <Card className="flex flex-col justify-between overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-auto h-[calc(100vh-325px)] relative">
            <Table>
              <TableHeader className="sticky top-0 bg-white shadow-sm">
                <TableRow>
                  <TableHead className="hidden w-[120px] sm:table-cell">
                    <span className="sr-only">Image</span>
                  </TableHead>
                  <TableHead className="w-[30%]">Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden md:table-cell">Brand</TableHead>
                  <TableHead className="hidden md:table-cell">
                    Category
                  </TableHead>
                  <TableHead className="hidden md:table-cell w-[16%]">
                    Created at
                  </TableHead>
                  <TableHead className="w-10">
                    <span className="sr-only">Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>

              {products.length > 0 ? (
                <TableBody>
                  {products.map((product) => (
                    <ProductTableRow key={product.id} product={product} />
                  ))}
                </TableBody>
              ) : (
                <TableEmpty colSpan={7} />
              )}
            </Table>
          </div>
        </CardContent>
      </Card>

      <ReusablePagination
        currentPage={currentPage}
        itemsPerPage={pageSize}
        totalItems={totalCount}
        totalPages={totalPages}
      />
    </>
  );
}
