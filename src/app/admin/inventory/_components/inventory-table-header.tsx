import { Input } from "@/components/ui/input";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";


import { PackagePlus } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function InventoryTableHeader() {
  return (
    <>
      <div className="flex items-center gap-4 mb-5 mt-7">
        <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0 flex items-center">
          <PackagePlus className="mr-3 text-primary" />
          My Inventory
        </h1>

        <div className="hidden items-center gap-2 md:ml-auto md:flex opacity-0 pointer-events-none">
          <Button variant="outline" size="sm">
            Download Excel
          </Button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto mb-5">
        <Input
          type="search"
          placeholder="Search inventory"
          className="w-full sm:w-auto flex-1"
        />
        <Select>
          <SelectTrigger className="w-full sm:w-auto">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="name">Name</SelectItem>
            <SelectItem value="status">Status</SelectItem>
            <SelectItem value="price">Price</SelectItem>
            <SelectItem value="totalSales">Total Sales</SelectItem>
            <SelectItem value="createdAt">Created at</SelectItem>
          </SelectContent>
        </Select>

        <Select>
          <SelectTrigger className="w-full sm:w-auto">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </>
  );
}
