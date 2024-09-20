"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenu,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TableCell, TableRow } from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import { Template } from "@prisma/client";
import dayjs from "dayjs";
import { Edit, MoreHorizontal, Trash2 } from "lucide-react";
import Link from "next/link";
import React, { useTransition } from "react";
import { deleteTemplate } from "../actions";
import { Badge } from "@/components/ui/badge";

export default function TemplateTableRow({ template }: { template: Template }) {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleDelete = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.preventDefault();
    e.stopPropagation();

    startTransition(async () => {
      const result = await deleteTemplate(template.id);

      if (result?.success) {
        toast({
          title: "Template Deleted",
          description: result.message,
          variant: "success",
        });
      } else {
        toast({
          title: "Error Deleting Template",
          description: result?.message,
          variant: "destructive",
        });
      }
    });
  };

  return (
    <TableRow className={`${isPending ? "opacity-30" : "opacity-100"}`}>
      <Link href={`/admin/templates/${template.id}`} className="contents">
        <TableCell className="font-medium">{template.name}</TableCell>
        <TableCell>
          <Badge variant="outline">{template.status}</Badge>
        </TableCell>
        <TableCell className="hidden md:table-cell">
          {dayjs(template.createdAt).format("DD-MM-YY hh:mm A")}
        </TableCell>
        <TableCell>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                aria-haspopup="true"
                size="icon"
                variant="ghost"
                onClick={(e) => e.preventDefault()}
              >
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={(e) => {
                  e.preventDefault();
                  window.location.href = `/admin/templates/${template.id}`;
                }}
              >
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleDelete}>
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </TableCell>
      </Link>
    </TableRow>
  );
}
