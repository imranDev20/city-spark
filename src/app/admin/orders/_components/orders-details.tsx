import {
  Card,
  CardContent, 
  CardFooter,

} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
export default function OrderDetailsList() {
  return (
    <>
     <h1 className="text-xl font-semibold">Order Details</h1>
      <Card>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="hidden w-[100px] sm:table-cell"> 
                ID
                </TableHead>
                <TableHead>Product Name</TableHead>
                <TableHead>Qty</TableHead>
                <TableHead className="hidden md:table-cell">Price</TableHead>
                <TableHead className="hidden md:table-cell">
                  Total
                </TableHead>                             
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="hidden sm:table-cell">
                 #5964
                </TableCell>
                <TableCell className="font-medium">
                  Laser Lemonade Machine
                </TableCell>
                <TableCell>
                  3
                </TableCell>
                <TableCell className="hidden md:table-cell">$499.99</TableCell>
                <TableCell className="hidden md:table-cell">25</TableCell>
              
               
              </TableRow>
              <TableRow>
                <TableCell className="hidden sm:table-cell">
                 #5964
                </TableCell>
                <TableCell className="font-medium">
                  Hypernova Headphones
                </TableCell>
                <TableCell>
                10
                </TableCell>
                <TableCell className="hidden md:table-cell">$129.99</TableCell>
                <TableCell className="hidden md:table-cell">100</TableCell>
               
               
              </TableRow>
              <TableRow>
                <TableCell className="hidden sm:table-cell">
                  #5899
                </TableCell>
                <TableCell className="font-medium">
                  AeroGlow Desk Lamp
                </TableCell>
                <TableCell>
                 15
                </TableCell>
                <TableCell className="hidden md:table-cell">$39.99</TableCell>
                <TableCell className="hidden md:table-cell">50</TableCell>
               
              </TableRow>
              <TableRow>
                <TableCell className="hidden sm:table-cell">
                 #5899
                </TableCell>
                <TableCell className="font-medium">
                  TechTonic Energy Drink
                </TableCell>
                <TableCell>
               20
                </TableCell>
                <TableCell className="hidden md:table-cell">$2.99</TableCell>
                <TableCell className="hidden md:table-cell">0</TableCell>
               
              </TableRow>
              <TableRow>
                <TableCell className="hidden sm:table-cell">
                 #5899
                </TableCell>
                <TableCell className="font-medium">
                  Gamer Gear Pro Controller
                </TableCell>
                <TableCell>
                 14
                </TableCell>
                <TableCell className="hidden md:table-cell">$59.99</TableCell>
                <TableCell className="hidden md:table-cell">75</TableCell>
              
              </TableRow>
              <TableRow>
                <TableCell className="hidden sm:table-cell">
                 #5964
                </TableCell>
                <TableCell className="font-medium">
                  Luminous VR Headset
                </TableCell>
                <TableCell>
                  16
                </TableCell>
                <TableCell className="hidden md:table-cell">$199.99</TableCell>
                <TableCell className="hidden md:table-cell">30</TableCell>
                
              </TableRow>
            </TableBody>
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
