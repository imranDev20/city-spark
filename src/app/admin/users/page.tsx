import React from "react";
import { ContentLayout } from "../_components/content-layout";
import DynamicBreadcrumb from "../_components/dynamic-breadcrumb";
import UserList from "./_components/users-list";
import { UserPagination } from "./_components/user-pagination";

const breadcrumbItems = [
  { label: "Dashboard", href: "/admin" },
  { label: "Users", href: "/admin/users", isCurrentPage: true },
];
export default function AdminUsersPage() {
  return (
    <ContentLayout title="Users">
      <DynamicBreadcrumb items={breadcrumbItems} />
      <UserList />
      <UserPagination />
    </ContentLayout>
  );
}
