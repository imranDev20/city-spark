import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import BrandsTableRow from "./brand-table-row";
import TableEmpty from "@/components/custom/table-empty";
import { Status, Prisma } from "@prisma/client";
import { ReusablePagination } from "@/components/custom/pagination";
import { getBrands } from "../actions";

export default async function BrandList({
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

  const { brands, pagination } = await getBrands({
    page: page ? parseInt(page) : 1,
    pageSize: 10,
    sortBy: sort_by as "name" | "createdAt" | undefined,
    sortOrder: sort_order,
    filterStatus: filter_status,
    searchTerm: search,
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
                    <span className="sr-only">Logo</span>
                  </TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Country of Origin</TableHead>
                  <TableHead className="hidden md:table-cell">
                    Created at
                  </TableHead>
                  <TableHead className="w-10">
                    <span className="sr-only">Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>

              {brands.length > 0 ? (
                <TableBody>
                  {brands.map((brand) => (
                    <BrandsTableRow key={brand.id} brand={brand} />
                  ))}
                </TableBody>
              ) : (
                <TableEmpty colSpan={6} />
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
