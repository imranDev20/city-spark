import { Card, CardContent, CardFooter } from "@/components/ui/card";

import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { getCategories } from "../actions";
import CategoriesTableRow from "./category-table-row";
import TableEmpty from "@/components/custom/table-empty";

export default async function CategoryList() {
  const categories = await getCategories();

  return (
    <>
      <Card className="min-h-[calc(100vh-320px)] h-full flex flex-col justify-between">
        <CardContent>
          <Table>
            <TableHeader>
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
        </CardContent>
        <CardFooter>
          <div className="text-xs text-muted-foreground">
            Showing <strong>1-10</strong> of <strong>32</strong> products
          </div>
        </CardFooter>
      </Card>
    </>
  );
}
