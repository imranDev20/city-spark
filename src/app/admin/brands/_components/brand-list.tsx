import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getBrands } from "../actions";
import BrandTableRow from "./brand-table-row";
import TableEmpty from "@/components/custom/table-empty";

export default async function BrandsList() {
  const brands = await getBrands();

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
                <TableHead className="w-[50%]">Name</TableHead>
                <TableHead>Status</TableHead>
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
                  <BrandTableRow key={brand.id} brand={brand} />
                ))}
              </TableBody>
            ) : (
              <TableEmpty colSpan={5} />
            )}
          </Table>
        </CardContent>

        {brands.length > 0 && (
          <CardFooter>
            <div className="text-xs text-muted-foreground">
              Showing <strong>1-10</strong> of <strong>32</strong> brands
            </div>
          </CardFooter>
        )}
      </Card>
    </>
  );
}
