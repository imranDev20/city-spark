import { Card, CardContent, CardFooter } from "@/components/ui/card";

import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Prisma } from "@prisma/client";
import { InventoryPagination } from "./inventory-pagination";
import InventoryTableRow from "./inventory-table-row";
import TableEmpty from "@/components/custom/table-empty";

export type InventoryWithRelations = Prisma.InventoryGetPayload<{
  include: {
    product: true;
  };
}>;

export default function InventoryList({
  inventories,
}: {
  inventories: InventoryWithRelations[];
}) {
  return (
    <>
      <Card className="min-h-[calc(100vh-320px)] h-full flex flex-col justify-between">
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="hidden w-[100px] sm:table-cell">
                  <span className="sr-only">Image</span>
                </TableHead>
                <TableHead>Name</TableHead>

                <TableHead className="hidden md:table-cell">Stock</TableHead>
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
                  <InventoryTableRow key={inventory.id} inventory={inventory} />
                ))}
              </TableBody>
            ) : (
              <TableEmpty colSpan={5} />
            )}
          </Table>
        </CardContent>

        {inventories.length > 0 && (
          <CardFooter>
            <div className="text-xs text-muted-foreground">
              Showing <strong>1-10</strong> of <strong>32</strong> inventories
            </div>
          </CardFooter>
        )}
      </Card>
      <InventoryPagination />
    </>
  );
}
