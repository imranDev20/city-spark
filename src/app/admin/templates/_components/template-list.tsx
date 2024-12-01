import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import TemplateTableRow from "./template-table-row";
import TableEmpty from "@/components/custom/table-empty";
import { ReusablePagination } from "@/components/custom/pagination";
import { getTemplates } from "../actions";
import { Status } from "@prisma/client";

export default async function TemplateList({
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

  const { templates, pagination } = await getTemplates({
    page: page ? parseInt(page) : 1,
    page_size: 10,
    sortBy: sort_by as "name" | "createdAt" | undefined,
    sortOrder: sort_order,
    filterStatus: filter_status,
    searchTerm: search,
  });

  const { currentPage, totalCount, totalPages, page_size } = pagination;

  return (
    <>
      <Card className="flex flex-col justify-between overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-auto h-[calc(100vh-325px)] relative">
            <Table>
              <TableHeader className="sticky top-0 bg-white shadow-sm">
                <TableRow>
                  <TableHead className="w-[60%]">Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden md:table-cell">
                    Created at
                  </TableHead>
                  <TableHead className="w-10">
                    <span className="sr-only">Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>

              {templates.length > 0 ? (
                <TableBody>
                  {templates.map((template) => (
                    <TemplateTableRow key={template.id} template={template} />
                  ))}
                </TableBody>
              ) : (
                <TableEmpty colSpan={4} />
              )}
            </Table>
          </div>
        </CardContent>
      </Card>

      <ReusablePagination
        currentPage={currentPage}
        itemsPerPage={page_size}
        totalItems={totalCount}
        totalPages={totalPages}
      />
    </>
  );
}
