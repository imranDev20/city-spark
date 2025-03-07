"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  FaBox,
  FaShoppingCart,
  FaMapMarkerAlt,
  FaUser,
  FaHeart,
  FaCog,
  FaClock,
  FaCreditCard,
} from "react-icons/fa";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { fetchAccountData } from "@/services/account";
import { Loader2 } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useSession } from "next-auth/react";
import Image from "next/image";

type DashboardCardProps = {
  title: string;
  value: number | string;
  description?: string;
  icon: React.ElementType;
  href: string;
};

const DashboardCard = ({
  title,
  value,
  description,
  icon: Icon,
  href,
}: DashboardCardProps) => (
  <Link href={href} className="block group">
    <Card className="relative h-full overflow-hidden transition-all duration-200 hover:border-primary hover:shadow-md bg-white">
      <CardContent className="p-8 flex flex-col items-center text-center">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />

        <div className="relative mb-6 transition-transform duration-200 group-hover:-translate-y-1">
          <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/15 transition-colors duration-200">
            <Icon className="h-7 w-7 text-primary" />
          </div>
        </div>

        <div className="relative space-y-2">
          <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
            {title}
          </h3>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
          {description && (
            <p className="text-sm text-muted-foreground mt-1.5">
              {description}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  </Link>
);

const QuickActionCard = ({
  title,
  description,
  icon: Icon,
  href,
}: {
  title: string;
  description: string;
  icon: React.ElementType;
  href: string;
}) => (
  <Link href={href}>
    <Card className="transition-all duration-200 hover:border-primary/50 hover:shadow-md bg-white">
      <CardContent className="p-6">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
            <Icon className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="font-medium">{title}</p>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  </Link>
);

// Helper function for getting initials
function getInitials(
  firstName: string | null | undefined,
  lastName: string | null | undefined
): string {
  if (!firstName && !lastName) return "U";
  return `${(firstName?.[0] || "").toUpperCase()}${(
    lastName?.[0] || ""
  ).toUpperCase()}`;
}

export default function AccountPage() {
  const {
    data: userData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["account"],
    queryFn: fetchAccountData,
  });

  const { data: session, status } = useSession();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] animate-spin">
        <Loader2 className="w-8 h-8" />
      </div>
    );
  }

  if (error || !userData) {
    return (
      <Card className="p-6 text-center">
        <p className="text-red-500">
          {error instanceof Error
            ? error.message
            : "Failed to load account data"}
        </p>
        <Button
          variant="outline"
          onClick={() => window.location.reload()}
          className="mt-4"
        >
          Try Again
        </Button>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <Card className="bg-gradient-to-r from-primary to-primary/90 text-white border-0">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              {session?.user?.image ? (
                <Image
                  src={session.user.image}
                  alt={`${session.user.firstName} ${session.user.lastName}`}
                  width={64}
                  height={64}
                  className="object-cover"
                />
              ) : (
                <AvatarFallback className="bg-white/10 text-white text-xl">
                  {getInitials(
                    session?.user?.firstName,
                    session?.user?.lastName
                  )}
                </AvatarFallback>
              )}
            </Avatar>
            <div>
              <h1 className="text-2xl font-bold">
                Welcome back, {session?.user?.firstName || "User"}!
              </h1>
              <p className="text-primary-foreground/90 mt-1">
                Manage your account and view your orders
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Dashboard Stats */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <DashboardCard
          title="Total Orders"
          value={userData.stats.orders}
          description="All time orders"
          icon={FaShoppingCart}
          href="/account/orders"
        />
        <DashboardCard
          title="Active Orders"
          value={
            userData.recentOrders.filter(
              (order) =>
                order.status === "PENDING" || order.status === "PROCESSING"
            ).length
          }
          description="Currently in progress"
          icon={FaBox}
          href="/account/orders"
        />
        <DashboardCard
          title="Wishlist"
          value={userData.stats.wishlist}
          description="Saved items"
          icon={FaHeart}
          href="/account/wishlist"
        />
        <DashboardCard
          title="Addresses"
          value={userData.stats.addresses}
          description="Saved addresses"
          icon={FaMapMarkerAlt}
          href="/account/addresses"
        />
      </div>

      {/* Recent Orders and Personal Info Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent Orders */}
        <Card className="bg-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-semibold">
              Recent Orders
            </CardTitle>
            {userData.recentOrders && userData.recentOrders.length > 0 && (
              <Link
                href="/account/orders"
                className="text-sm text-primary hover:underline"
              >
                View all
              </Link>
            )}
          </CardHeader>
          <CardContent>
            {userData.recentOrders && userData.recentOrders.length > 0 ? (
              <div className="space-y-4">
                {userData.recentOrders.map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between p-4 rounded-lg"
                  >
                    <div className="space-y-1">
                      <p className="font-medium">{order.id}</p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <FaClock className="h-4 w-4" />
                        <span>{new Date(order.date).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">£{order.total.toFixed(2)}</p>
                      <p className="text-sm text-emerald-600">{order.status}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <FaBox className="h-12 w-12 text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-1">
                  No orders yet
                </h3>
                <p className="text-sm text-gray-500 mb-4">
                  When you place an order, it will appear here
                </p>
                <Link href="/products">
                  <Button variant="outline" size="sm">
                    Start Shopping
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Personal Information */}
        <Card className="bg-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-semibold">
              Personal Information
            </CardTitle>
            <Button variant="ghost" size="sm" className="text-primary">
              <FaCog className="h-4 w-4 mr-2" />
              Edit
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Full Name</p>
                  <p className="font-medium">
                    {`${userData.firstName || ""} ${
                      userData.lastName || ""
                    }`.trim() || "Not set"}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{userData.email}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="font-medium">{userData.phone || "Not set"}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions section remains the same */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold px-1">Quick Actions</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <QuickActionCard
            href="/account/profile"
            icon={FaCog}
            title="Edit Profile"
            description="Update your information"
          />
          <QuickActionCard
            href="/account/payment"
            icon={FaCreditCard}
            title="Payment Methods"
            description="Manage your cards"
          />
        </div>
      </div>
    </div>
  );
}
