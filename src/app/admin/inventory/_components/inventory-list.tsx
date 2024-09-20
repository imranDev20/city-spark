import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import InventoryTableRow from "./inventory-table-row";
import TableEmpty from "@/components/custom/table-empty";
import { InventoryWithRelations } from "./inventory-table-row";
import { ReusablePagination } from "@/components/custom/pagination";

export default function InventoryList({
  inventories,
  pagination,
}: {
  inventories: InventoryWithRelations[];
  pagination: {
    currentPage: number;
    totalCount: number;
    totalPages: number;
    pageSize: number;
  };
}) {
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
                  <TableHead>Name</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Sold Count</TableHead>
                  <TableHead>Held Count</TableHead>
                  <TableHead className="hidden md:table-cell">
                    Created at
                  </TableHead>
                  <TableHead className="w-10">
                    <span className="sr-only">Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>

              {inventories.length > 0 ? (
                <TableBody>
                  {inventories.map((inventory) => (
                    <InventoryTableRow
                      key={inventory.id}
                      inventory={inventory}
                    />
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
