import { Card, CardContent, CardFooter } from "@/components/ui/card";

import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { InventoryPagination } from "./inventory-pagination";
import { Prisma } from "@prisma/client";
import InventoryTableRow from "./inventory-table-row";

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
      <Card>
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
            <TableBody>
              {inventories?.map((inventory) => (
                <InventoryTableRow key={inventory.id} inventory={inventory} />
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter>
          <div className="text-xs text-muted-foreground">
            Showing <strong>1-10</strong> of <strong>32</strong> products
          </div>
        </CardFooter>
      </Card>
      <InventoryPagination />
    </>
  );
}
