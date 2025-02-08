"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ReusablePagination } from "@/components/custom/pagination";
import { Package2, Trash2, X } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { fetchUsers, FetchUsersParams } from "@/services/admin-users";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import UserTableRow from "./user-table-row";
import UsersLoading from "./users-loading";

export default function DesktopUserList() {
  const searchParams = useSearchParams();
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const currentParams: FetchUsersParams = {
    page: searchParams.get("page") || "1",
    page_size: "10",
    search: searchParams.get("search") || "",
    sort_by: searchParams.get("sort_by") || "createdAt",
    sort_order:
      (searchParams.get("sort_order") as FetchUsersParams["sort_order"]) ||
      "desc",
    role: searchParams.get("role") || "",
  };

  const { data, isLoading, isError, isFetching } = useQuery({
    queryKey: ["users", currentParams],
    queryFn: () => fetchUsers(currentParams),
  });

  const handleSelectAll = (checked: boolean) => {
    if (checked && data) {
      setSelectedUsers(new Set(data.users.map((user) => user.id)));
    } else {
      setSelectedUsers(new Set());
    }
  };

  const handleSelectUser = (userId: string, checked: boolean) => {
    const newSelected = new Set(selectedUsers);
    if (checked) {
      newSelected.add(userId);
    } else {
      newSelected.delete(userId);
    }
    setSelectedUsers(newSelected);
  };

  const handleBulkDelete = () => {
    setShowDeleteDialog(true);
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      // Implement delete users functionality here
      toast({
        title: "Success",
        description: "Users deleted successfully",
        variant: "success",
      });
      setSelectedUsers(new Set());
      await queryClient.invalidateQueries({ queryKey: ["users"] });
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  const handleRoleChange = (role: string) => {
    // Implement bulk role change functionality
    console.log(
      "Changing role to:",
      role,
      "for users:",
      Array.from(selectedUsers)
    );
  };

  if (isLoading || isFetching) {
    return <UsersLoading />;
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-[400px] text-red-500">
        Error loading users. Please try again later.
      </div>
    );
  }

  if (!data?.users?.length) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-gray-500">
        <Package2 className="h-12 w-12 mb-4" />
        <p>No users found</p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4 hidden lg:block">
        <Card className="shadow-sm border-border overflow-hidden">
          <CardContent className="p-0 relative">
            {/* Floating Selection Header */}
            <div
              className={cn(
                "absolute inset-x-0 top-0 z-20 bg-primary/5 border-b transform transition-transform bg-white",
                selectedUsers.size > 0 ? "translate-y-0" : "-translate-y-full"
              )}
            >
              <div className="flex items-center justify-between px-6 py-2">
                <div className="flex items-center gap-4">
                  <Checkbox
                    checked={
                      data?.users.length > 0 &&
                      selectedUsers.size === data.users.length
                    }
                    onCheckedChange={handleSelectAll}
                  />
                  <span className="text-sm font-medium">
                    {selectedUsers.size} selected
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Select onValueChange={handleRoleChange}>
                    <SelectTrigger className="h-8 w-[140px]">
                      <SelectValue placeholder="Change Role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USER">User</SelectItem>
                      <SelectItem value="ADMIN">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={handleBulkDelete}
                    className="h-8"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedUsers(new Set())}
                    className="h-8"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>
                </div>
              </div>
            </div>

            {/* Table with fixed height */}
            <div className="overflow-auto h-[calc(100vh-325px)] relative">
              <Table>
                <TableHeader className="bg-gray-50 sticky top-0 z-10 shadow-sm">
                  <TableRow>
                    <TableHead className="w-14 pl-6">
                      <Checkbox
                        checked={
                          data?.users.length > 0 &&
                          selectedUsers.size === data.users.length
                        }
                        onCheckedChange={handleSelectAll}
                      />
                    </TableHead>
                    <TableHead className="w-24 py-5">
                      <span className="sr-only">Avatar</span>
                    </TableHead>
                    <TableHead className="w-[25%] min-w-[200px]">
                      User Details
                    </TableHead>
                    <TableHead className="w-[15%] min-w-[120px]">
                      Role
                    </TableHead>
                    <TableHead className="w-[20%] min-w-[180px]">
                      Email
                    </TableHead>
                    <TableHead className="w-[15%] min-w-[120px]">
                      Phone
                    </TableHead>
                    <TableHead className="w-[15%] min-w-[140px]">
                      Joined Date
                    </TableHead>
                    <TableHead className="w-14 pr-6"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.users.map((user) => (
                    <UserTableRow
                      key={user.id}
                      user={user}
                      isSelected={selectedUsers.has(user.id)}
                      onSelect={(checked) => handleSelectUser(user.id, checked)}
                    />
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <ReusablePagination
          currentPage={data.pagination.currentPage}
          totalPages={data.pagination.totalPages}
          totalCount={data.pagination.totalCount}
          itemsPerPage={data.pagination.pageSize}
        />
      </div>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="max-w-[400px]">
          <AlertDialogHeader>
            <div className="mx-auto w-12 h-12 rounded-full bg-red-100/80 flex items-center justify-center mb-4">
              <Trash2 className="w-6 h-6 text-red-600" />
            </div>
            <AlertDialogTitle className="text-center text-xl">
              Delete Selected Users
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center pt-2 pb-4">
              You are about to delete{" "}
              <span className="font-semibold text-red-600">
                {selectedUsers.size}
              </span>{" "}
              selected users. This action cannot be undone and all associated
              data will be permanently removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex justify-center gap-3 sm:justify-center">
            <AlertDialogCancel
              disabled={isDeleting}
              className="rounded-lg mt-0 sm:mt-0 w-32"
            >
              <X className="w-4 h-4 mr-2" />
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-destructive hover:bg-destructive/90 rounded-lg w-32"
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <span className="w-4 h-4 mr-2 border-2 border-white/20 border-t-white animate-spin rounded-full" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
