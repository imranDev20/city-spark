"use client";

import { useState } from "react";
import { ContentLayout } from "../_components/content-layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  AlertCircle,
  Bell,
  Check,
  Clock,
  Info,
  Package,
  Settings,
  ShoppingCart,
  User,
} from "lucide-react";

// Mock data for notifications
const mockNotifications = {
  all: [
    {
      id: 1,
      title: "New Order Received",
      description: "Order #12345 has been placed and is awaiting processing",
      time: "5 minutes ago",
      type: "order",
      read: false,
    },
    {
      id: 2,
      title: "Low Stock Alert",
      description:
        "Product 'Premium Widget' is running low on stock (5 remaining)",
      time: "1 hour ago",
      type: "inventory",
      read: false,
    },
    {
      id: 3,
      title: "Payment Received",
      description: "Payment of £299.99 received for Order #12342",
      time: "2 hours ago",
      type: "payment",
      read: true,
    },
    {
      id: 4,
      title: "New Customer Registration",
      description: "John Doe has created a new account",
      time: "3 hours ago",
      type: "customer",
      read: true,
    },
    {
      id: 5,
      title: "System Update",
      description: "System maintenance scheduled for tonight at 2 AM GMT",
      time: "5 hours ago",
      type: "system",
      read: true,
    },
  ],
  unread: [] as any[],
  orders: [] as any[],
  inventory: [] as any[],
  system: [] as any[],
};

// Filter notifications for different tabs
mockNotifications.unread = mockNotifications.all.filter((n) => !n.read);
mockNotifications.orders = mockNotifications.all.filter(
  (n) => n.type === "order"
);
mockNotifications.inventory = mockNotifications.all.filter(
  (n) => n.type === "inventory"
);
mockNotifications.system = mockNotifications.all.filter(
  (n) => n.type === "system"
);

const getNotificationIcon = (type: string) => {
  switch (type) {
    case "order":
      return <ShoppingCart className="h-5 w-5 text-blue-500" />;
    case "inventory":
      return <Package className="h-5 w-5 text-orange-500" />;
    case "payment":
      return <Check className="h-5 w-5 text-green-500" />;
    case "customer":
      return <User className="h-5 w-5 text-purple-500" />;
    case "system":
      return <AlertCircle className="h-5 w-5 text-red-500" />;
    default:
      return <Info className="h-5 w-5 text-gray-500" />;
  }
};

export default function NotificationsPage() {
  const [activeTab, setActiveTab] = useState("all");

  return (
    <ContentLayout title="Notifications">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <Bell className="h-8 w-8 text-primary" />
          <h1 className="text-2xl font-semibold text-gray-900">
            Notifications
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <Clock className="h-4 w-4" />
            Clear All
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <Settings className="h-4 w-4" />
            Settings
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5 mb-8">
          <TabsTrigger value="all" className="gap-2">
            All
            <span className="bg-primary/10 text-primary rounded-full px-2 py-0.5 text-xs">
              {mockNotifications.all.length}
            </span>
          </TabsTrigger>
          <TabsTrigger value="unread" className="gap-2">
            Unread
            <span className="bg-primary/10 text-primary rounded-full px-2 py-0.5 text-xs">
              {mockNotifications.unread.length}
            </span>
          </TabsTrigger>
          <TabsTrigger value="orders" className="gap-2">
            Orders
            <span className="bg-primary/10 text-primary rounded-full px-2 py-0.5 text-xs">
              {mockNotifications.orders.length}
            </span>
          </TabsTrigger>
          <TabsTrigger value="inventory" className="gap-2">
            Inventory
            <span className="bg-primary/10 text-primary rounded-full px-2 py-0.5 text-xs">
              {mockNotifications.inventory.length}
            </span>
          </TabsTrigger>
          <TabsTrigger value="system" className="gap-2">
            System
            <span className="bg-primary/10 text-primary rounded-full px-2 py-0.5 text-xs">
              {mockNotifications.system.length}
            </span>
          </TabsTrigger>
        </TabsList>

        {Object.entries(mockNotifications).map(([key, notifications]) => (
          <TabsContent key={key} value={key} className="space-y-4">
            {notifications.map((notification) => (
              <Card
                key={notification.id}
                className={`p-4 transition-all hover:shadow-md ${
                  !notification.read ? "bg-primary/5 border-primary/10" : ""
                }`}
              >
                <div className="flex gap-4">
                  <div className="flex-shrink-0 mt-1">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <p className="text-sm font-medium text-gray-900">
                        {notification.title}
                      </p>
                      <span className="text-xs text-gray-500 whitespace-nowrap ml-4">
                        {notification.time}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      {notification.description}
                    </p>
                  </div>
                </div>
              </Card>
            ))}

            {notifications.length === 0 && (
              <div className="text-center py-12">
                <Bell className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-semibold text-gray-900">
                  No notifications
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  There are no notifications in this category yet.
                </p>
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </ContentLayout>
  );
}
