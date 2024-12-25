"use client";

import { TableCell, TableRow } from "@/components/ui/table";
import { UserListItem } from "@/services/admin-users";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Pencil, Trash2, Eye, UserCog } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useTransition } from "react";
import { useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

interface UserTableRowProps {
  user: UserListItem;
  isSelected?: boolean;
  onSelect?: (checked: boolean) => void;
}

export default function UserTableRow({
  user,
  isSelected = false,
  onSelect,
}: UserTableRowProps) {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    startTransition(async () => {
      try {
        // Implement delete functionality here
        // const result = await deleteUser(user.id);

        toast({
          title: "User Deleted",
          description: "The user has been successfully deleted.",
          variant: "success",
        });

        await queryClient.invalidateQueries({
          queryKey: ["users"],
        });
      } catch (error) {
        toast({
          title: "Error Deleting User",
          description:
            error instanceof Error
              ? error.message
              : "There was an error deleting the user",
          variant: "destructive",
        });
      }
    });
  };

  const getInitials = (firstName?: string | null, lastName?: string | null) => {
    return `${firstName?.[0] || ""}${lastName?.[0] || ""}`.toUpperCase() || "U";
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "ADMIN":
        return "bg-red-100 text-red-800";
      case "USER":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <TableRow className={cn("group", isSelected && "bg-primary/5")}>
      <TableCell
        className="pl-6 relative z-20"
        onClick={(e) => e.stopPropagation()}
      >
        <Checkbox
          checked={isSelected}
          onCheckedChange={(checked) => onSelect?.(checked as boolean)}
        />
      </TableCell>
      <TableCell className="w-24 py-4 relative">
        <Link
          href={`/admin/users/${user.id}`}
          className="absolute inset-0 z-10"
        />
        <Avatar className="h-12 w-12">
          <AvatarImage
            src={user.avatar || undefined}
            alt={`${user.firstName} ${user.lastName}`}
          />
          <AvatarFallback>
            {getInitials(user.firstName, user.lastName)}
          </AvatarFallback>
        </Avatar>
      </TableCell>
      <TableCell className="min-w-[200px] relative">
        <Link
          href={`/admin/users/${user.id}`}
          className="absolute inset-0 z-10"
        />
        <div className="flex flex-col">
          <span className="font-medium text-gray-900 line-clamp-1">
            {user.firstName} {user.lastName}
          </span>
          <span className="text-sm text-gray-500 mt-1">{user.email}</span>
        </div>
      </TableCell>
      <TableCell className="relative">
        <Link
          href={`/admin/users/${user.id}`}
          className="absolute inset-0 z-10"
        />
        <Badge
          variant="secondary"
          className={cn("w-fit", getRoleBadgeColor(user.role))}
        >
          {user.role}
        </Badge>
      </TableCell>
      <TableCell className="min-w-[180px] relative">
        <Link
          href={`/admin/users/${user.id}`}
          className="absolute inset-0 z-10"
        />
        {user.email}
      </TableCell>
      <TableCell className="min-w-[120px] relative">
        <Link
          href={`/admin/users/${user.id}`}
          className="absolute inset-0 z-10"
        />
        {user.phone || "-"}
      </TableCell>
      <TableCell className="min-w-[140px] relative">
        <Link
          href={`/admin/users/${user.id}`}
          className="absolute inset-0 z-10"
        />
        {format(new Date(user.createdAt), "MMM d, yyyy")}
      </TableCell>
      <TableCell
        className="pr-6 relative z-20"
        onClick={(e) => e.stopPropagation()}
      >
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
              disabled={isPending}
            >
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[160px]">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href={`/admin/users/${user.id}`}>
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={`/admin/users/${user.id}/edit`}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit User
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={`/admin/users/${user.id}/permissions`}>
                <UserCog className="mr-2 h-4 w-4" />
                Permissions
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-red-600 focus:text-red-700"
              onClick={handleDelete}
              disabled={isPending}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete User
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}
