import { Card, CardContent, CardFooter } from "@/components/ui/card";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { getProducts } from "../actions";
import ProductTableRow from "./product-table-row";
import TableEmpty from "@/components/custom/table-empty";

// const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export default async function ProductList() {
  const products = await getProducts();

  // await sleep(2000);

  return (
    <>
      <Card>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="hidden w-[120px] sm:table-cell">
                  <span className="sr-only">Image</span>
                </TableHead>
                <TableHead className="w-[30%]">Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden md:table-cell">Brand</TableHead>
                <TableHead className="hidden md:table-cell">Category</TableHead>

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
        </CardContent>

        {products.length > 0 && (
          <CardFooter>
            <div className="text-xs text-muted-foreground">
              Showing <strong>1-10</strong> of <strong>32</strong> products
            </div>
          </CardFooter>
        )}
      </Card>
    </>
  );
}
