"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TableCell, TableRow } from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import { Template } from "@prisma/client";
import { MoreHorizontal } from "lucide-react";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { deleteTemplate } from "../actions";
import dayjs from "dayjs";

export default function TemplateTableRow({ template }: { template: Template }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleDelete = () => {
    startTransition(async () => {
      const result = await deleteTemplate(template.id);

      if (result.success) {
        console.log(result.message);

        toast({
          title: "Template Deleted",
          description: "The template has been successfully deleted.",
          variant: "destructive",
        });
      } else {
        console.error(result.message);
      }
    });
  };

  return (
    <TableRow
      key={template.id}
      onClick={() => router.push(`/admin/templates/${template.id}`)}
      className={`cursor-pointer ${isPending ? "opacity-30" : "opacity-100"}`}
    >
      <TableCell className="font-medium"> {template.name} </TableCell>
      <TableCell>
        <Badge variant="outline">{template.status}</Badge>
      </TableCell>
      <TableCell className="hidden md:table-cell">
        {dayjs(template.createdAt).format("DD-MM-YY hh:mm A")}
      </TableCell>
      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button aria-haspopup="true" size="icon" variant="ghost">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem>Edit</DropdownMenuItem>
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                handleDelete();
              }}
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}
