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

type DashboardCardProps = {
  title: string;
  value: number | string;
  description?: string;
  icon: React.ElementType;
  href: string;
};

// Dummy data
const userData = {
  firstName: "John",
  lastName: "Doe",
  email: "john.doe@example.com",
  phone: "+44 7700 900077",
  stats: {
    orders: 12,
    wishlist: 5,
    addresses: 2,
  },
  recentOrders: [
    {
      id: "ORD-123",
      date: "2024-02-01",
      status: "In Transit",
      total: 299.99,
    },
    {
      id: "ORD-122",
      date: "2024-01-28",
      status: "Delivered",
      total: 149.5,
    },
  ],
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

export default function AccountPage() {
  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <Card className="bg-gradient-to-r from-primary to-primary/90 text-white border-0">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-white/10 flex items-center justify-center">
              <FaUser className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">
                Welcome back, {userData.firstName}!
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
          value="2"
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
            <Link
              href="/account/orders"
              className="text-sm text-primary hover:underline"
            >
              View all
            </Link>
          </CardHeader>
          <CardContent>
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
                  <p className="font-medium">{`${userData.firstName} ${userData.lastName}`}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{userData.email}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="font-medium">{userData.phone}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
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
