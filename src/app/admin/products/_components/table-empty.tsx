"use client";

import Lottie from "lottie-react";
import EmptyBox from "@/images/empty-box.json";
import { TableBody, TableCell, TableRow } from "@/components/ui/table";

export default function TableEmpty() {
  return (
    <TableBody>
      <TableRow>
        <TableCell colSpan={7} className="text-center">
          <div className="flex justify-center items-center h-full flex-col">
            <div className="w-48 h-w-48">
              <Lottie animationData={EmptyBox} loop={true} />
            </div>
          </div>
        </TableCell>
      </TableRow>
    </TableBody>
  );
}
