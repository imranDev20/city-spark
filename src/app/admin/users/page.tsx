import React from "react";
import { ContentLayout } from "../_components/content-layout";
import DynamicBreadcrumb from "../_components/dynamic-breadcrumb";
import DesktopUserList from "./_components/desktop-users-list";
import UserTableHeader from "./_components/users-table-header";

const breadcrumbItems = [
  { label: "Dashboard", href: "/admin" },
  { label: "Users", href: "/admin/users", isCurrentPage: true },
];
export default function AdminUsersPage() {
  return (
    <ContentLayout title="Users">
      <DynamicBreadcrumb items={breadcrumbItems} />
      <UserTableHeader />
      <DesktopUserList />
    </ContentLayout>
  );
}
