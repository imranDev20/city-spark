"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  FaShoppingBag,
  FaMapMarkerAlt,
  FaUser,
  FaHeart,
  FaClock,
  FaLock,
  FaFileAlt,
  FaHome,
  FaCog,
} from "react-icons/fa";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { fetchAccountData } from "@/services/account";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useSession } from "next-auth/react";
import Image from "next/image";

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

// Dashboard stats card component

// Action card component
const ActionCard = ({
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
  <Link href={href} className="block group">
    <Card className="h-full transition-all duration-200 hover:border-primary hover:shadow-md bg-white">
      <CardContent className="p-6 flex items-start gap-4">
        <div className="h-12 w-12 bg-primary/10 flex items-center justify-center group-hover:bg-primary/15 transition-colors duration-200 rounded-xl">
          <Icon className="h-6 w-6 text-primary" />
        </div>

        <div className="flex-1">
          <h3 className="font-medium group-hover:text-primary transition-colors">
            {title}
          </h3>
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
        </div>
      </CardContent>
    </Card>
  </Link>
);

export default function AccountDashboard() {
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
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 animate-spin text-primary border-4 border-current border-t-transparent rounded-full" />
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

      {/* Account Management Actions */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Manage Your Account</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <ActionCard
            title="Order History"
            description="View and track all your previous orders"
            icon={FaShoppingBag}
            href="/account/orders"
          />
          <ActionCard
            title="Personal Details"
            description="Update your name, email and contact information"
            icon={FaUser}
            href="/account/profile"
          />
          <ActionCard
            title="Address Book"
            description="Manage your delivery and billing addresses"
            icon={FaMapMarkerAlt}
            href="/account/addresses"
          />
          <ActionCard
            title="Wishlist"
            description="View and manage your saved items"
            icon={FaHeart}
            href="/account/wishlist"
          />
          <ActionCard
            title="Change Password"
            description="Update your account password"
            icon={FaLock}
            href="/account/password"
          />
        </div>
      </div>

      {/* Additional Resources */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Additional Resources</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <ActionCard
            title="Help Center"
            description="Get support and find answers to questions"
            icon={FaFileAlt}
            href="/help"
          />
          <ActionCard
            title="Account Settings"
            description="Manage your preferences and notifications"
            icon={FaCog}
            href="/account/settings"
          />
          <ActionCard
            title="Return to Store"
            description="Continue shopping for great products"
            icon={FaHome}
            href="/products"
          />
        </div>
      </div>
    </div>
  );
}
