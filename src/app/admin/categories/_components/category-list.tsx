import { Card, CardContent } from "@/components/ui/card";

import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import CategoriesTableRow from "./category-table-row";
import TableEmpty from "@/components/custom/table-empty";
import { CategoryType, Prisma } from "@prisma/client";
import { ReusablePagination } from "@/components/custom/pagination";
import { getCategories } from "../actions";

export type CategoryWithRelations = Prisma.CategoryGetPayload<{
  include: {
    parentPrimaryCategory: true;
    parentSecondaryCategory: true;
    parentTertiaryCategory: true;
  };
}>;

export default async function CategoryList({
  searchParams,
}: {
  searchParams: {
    search?: string;
    page?: string;
    sort_by?: string;
    sort_order?: "asc" | "desc";
    filter_type?: CategoryType;
  };
}) {
  const { search, page, sort_by, sort_order, filter_type } = searchParams;

  const { categories, pagination } = await getCategories({
    page: page ? parseInt(page) : 1,
    pageSize: 10,
    sortBy: sort_by as "name" | "createdAt" | undefined,
    sortOrder: sort_order,
    filterType: filter_type,
    searchTerm: search,
  });

  const { currentPage, totalCount, totalPages, pageSize } = pagination;

  return (
    <>
      <Card className=" flex flex-col justify-between overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-auto h-[calc(100vh-325px)] relative">
            <Table>
              <TableHeader className="sticky top-0 bg-white shadow-sm">
                <TableRow>
                  <TableHead className="hidden w-[120px] sm:table-cell">
                    <span className="sr-only">Image</span>
                  </TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Parent</TableHead>
                  <TableHead className="hidden md:table-cell">
                    Created at
                  </TableHead>
                  <TableHead className="w-10">
                    <span className="sr-only">Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>

              {categories.length > 0 ? (
                <TableBody>
                  {categories.map((category) => (
                    <CategoriesTableRow key={category.id} category={category} />
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
