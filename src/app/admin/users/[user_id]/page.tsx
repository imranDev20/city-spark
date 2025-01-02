"use client";

import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import { AlertCircle, Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ContentLayout } from "../../_components/content-layout";
import DynamicBreadcrumb from "../../_components/dynamic-breadcrumb";
import UserForm from "../_components/user-form";
import { Prisma } from "@prisma/client";
import { fetchUserDetails, UserDetails } from "@/services/admin-users";

export default function AdminUserDetailsPage(props: {
  params: Promise<{ user_id: string }>;
}) {
  const { user_id } = React.use(props.params);

  const {
    data: userDetails,
    isLoading,
    isError,
    error,
  } = useQuery<UserDetails, Error>({
    queryKey: ["user", user_id],
    queryFn: () => fetchUserDetails(user_id),
  });

  const breadcrumbItems = [
    { label: "Dashboard", href: "/admin" },
    { label: "Users", href: "/admin/users" },
    {
      label: isLoading
        ? "Loading..."
        : `Edit ${userDetails?.firstName || "User"}`,
      href: `/admin/users/${user_id}`,
      isCurrentPage: true,
    },
  ];

  if (isLoading) {
    return (
      <ContentLayout title="Edit User">
        <DynamicBreadcrumb items={breadcrumbItems} />
        <div className="flex items-center justify-center h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </ContentLayout>
    );
  }

  if (isError) {
    return (
      <ContentLayout title="Edit User">
        <DynamicBreadcrumb items={breadcrumbItems} />
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error?.message || "Failed to load user details"}
          </AlertDescription>
        </Alert>
      </ContentLayout>
    );
  }

  console.log(userDetails);

  return (
    <ContentLayout title="Edit User" isContainer={false}>
      <div className="container pt-8 pb-4 px-4 sm:px-8">
        <DynamicBreadcrumb items={breadcrumbItems} />
      </div>
      {userDetails && <UserForm userDetails={userDetails} />}
    </ContentLayout>
  );
}
