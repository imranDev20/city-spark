
import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getAllCategories } from "../actions";
import CategoriesTableRow from "./category-table-row";
import { CategoriesPagination } from "./categories-pagination";


export default async function CategoriesList({page}:{page:number}) {
  const pages = page | 1;
  const categories = await getAllCategories(pages);
console.log(`categories`, categories);


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
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Parent</TableHead>
                <TableHead className="hidden md:table-cell">
                  Created at
                </TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories?.categories?.map((category) => (
                <CategoriesTableRow key={category.id} category={category} />
              ))}
            </TableBody>
          </Table>
        </CardContent>
       
      </Card>

      <CategoriesPagination totalPages={categories.totalPages} currentPage={categories.currentPage}  page={pages} />
    </>
  );
}
