import { Card, CardContent} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
export default function PaidByCustomerList() {
  return (
    <>
      <h1 className="text-xl font-semibold">Paid by Customer</h1>
      <Card>
        <CardContent>
          <Table>
            <TableHeader>
              {/* <TableRow>
                <TableHead className="hidden w-[100px] sm:table-cell"> 
                ID
                </TableHead>
                <TableHead>Product Name</TableHead>
                <TableHead>Qty</TableHead>
                <TableHead className="hidden md:table-cell">Price</TableHead>
                <TableHead className="hidden md:table-cell">
                  Total
                </TableHead>
               
              
              </TableRow> */}
              <TableRow>
                <TableHead className="hidden sm:table-cell">
                  Sub total
                </TableHead>
                <TableHead className="font-medium">3 items</TableHead>
                <TableHead>$130</TableHead>
              </TableRow>
              <TableRow>
                <TableHead className="hidden sm:table-cell">Shipping</TableHead>
                <TableHead className="font-medium">
                  Expedited (0.43)lb
                </TableHead>
                <TableHead>10</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="hidden sm:table-cell col-span-2">
                  Total paid by customer
                </TableCell>

                <TableCell className="hidden sm:table-cell "></TableCell>
                <TableCell className="hidden sm:table-cell font-medium ">
                  $136
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
       
      </Card>
    </>
  );
}
