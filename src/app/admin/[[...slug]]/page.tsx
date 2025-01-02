"use client";

import { useQuery } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  ArrowUpRight,
  BarChart3Icon,
  CheckCircle2,
  Clock,
  Eye,
  MapPinIcon,
  Package2Icon,
  PackageCheck,
  PackageIcon,
  TrendingUpIcon,
  Truck,
  TruckIcon,
  Users2Icon,
  XCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Bar,
  BarChart,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState } from "react";
import { ContentLayout } from "../_components/content-layout";

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";

// Dummy data remains the same...
const metrics = [
  {
    name: "Total Orders",
    value: "2,345",
    change: "+12.5%",
    isPositive: true,
    icon: PackageIcon,
  },
  {
    name: "Pending Orders",
    value: "45",
    change: "+3.2%",
    isPositive: false,
    icon: Package2Icon,
  },
  {
    name: "Total Customers",
    value: "1,876",
    change: "+8.1%",
    isPositive: true,
    icon: Users2Icon,
  },
  {
    name: "Active Deliveries",
    value: "156",
    change: "+4.5%",
    isPositive: true,
    icon: TruckIcon,
  },
];

const chartData = [
  { name: "Jan", total: 1200 },
  { name: "Feb", total: 1800 },
  { name: "Mar", total: 2200 },
  { name: "Apr", total: 2800 },
  { name: "May", total: 3200 },
  { name: "Jun", total: 3800 },
];

const analyticsData = [
  { name: "Mon", users: 500, sessions: 700 },
  { name: "Tue", users: 600, sessions: 800 },
  { name: "Wed", users: 400, sessions: 600 },
  { name: "Thu", users: 700, sessions: 900 },
  { name: "Fri", users: 800, sessions: 1000 },
  { name: "Sat", users: 550, sessions: 750 },
  { name: "Sun", users: 450, sessions: 650 },
];

const latestOrders = [
  {
    id: "ORD001",
    customer: "John Doe",
    amount: 234.5,
    status: "Pending",
    date: "2024-03-15T10:00:00",
    items: 3,
    location: { lat: 51.5074, lng: -0.1278 }, // London coordinates
  },
  {
    id: "ORD002",
    customer: "Jane Smith",
    amount: 567.8,
    status: "Processing",
    date: "2024-03-15T09:30:00",
    items: 5,
    location: { lat: 51.5225, lng: -0.1584 }, // Another London location
  },
  {
    id: "ORD003",
    customer: "Bob Wilson",
    amount: 123.45,
    status: "Pending",
    date: "2024-03-15T09:00:00",
    items: 2,
    location: { lat: 51.4975, lng: -0.1357 }, // Another London location
  },
  {
    id: "ORD004",
    customer: "Alice Brown",
    amount: 789.1,
    status: "Processing",
    date: "2024-03-15T08:30:00",
    items: 7,
    location: { lat: 51.5136, lng: -0.1755 }, // Another London location
  },
  {
    id: "ORD005",
    customer: "Charlie Davis",
    amount: 345.67,
    status: "Pending",
    date: "2024-03-15T08:00:00",
    items: 4,
    location: { lat: 51.5074, lng: -0.1278 }, // Another London location
  },
];

const orderStatuses = {
  PENDING: {
    label: "Pending",
    icon: Clock,
    className: "bg-yellow-100 text-yellow-800",
  },
  PROCESSING: {
    label: "Processing",
    icon: PackageCheck,
    className: "bg-blue-100 text-blue-800",
  },
  SHIPPED: {
    label: "Shipped",
    icon: Truck,
    className: "bg-purple-100 text-purple-800",
  },
  DELIVERED: {
    label: "Delivered",
    icon: CheckCircle2,
    className: "bg-green-100 text-green-800",
  },
  CANCELLED: {
    label: "Cancelled",
    icon: XCircle,
    className: "bg-red-100 text-red-800",
  },
};

export default function DashboardOverview() {
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  // Simulate loading state with useQuery
  const { data: orders, isLoading } = useQuery({
    queryKey: ["latestOrders"],
    queryFn: () => Promise.resolve(latestOrders),
  });

  const selectedOrder = orders?.find((order) => order.id === selectedOrderId);

  return (
    <ContentLayout title="Dashboard">
      <div className="space-y-6">
        {/* Top Stats */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {metrics.map((metric) => (
            <Card key={metric.name}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-500">
                    {metric.name}
                  </p>
                  <metric.icon className="h-5 w-5 text-gray-400" />
                </div>
                <div className="mt-2 flex items-baseline gap-2">
                  <h3 className="text-2xl font-semibold">{metric.value}</h3>
                  <div
                    className={cn(
                      "flex items-center text-xs font-medium",
                      metric.isPositive ? "text-green-600" : "text-red-600"
                    )}
                  >
                    {metric.isPositive ? (
                      <ArrowUpIcon className="h-3 w-3" />
                    ) : (
                      <ArrowDownIcon className="h-3 w-3" />
                    )}
                    {metric.change}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Orders and Map Section */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Latest Orders - 3 columns */}
          <Card className="lg:col-span-3">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Latest Orders</CardTitle>
                <CardDescription>
                  Select an order to view delivery location
                </CardDescription>
              </div>
              <Button asChild variant="ghost" className="h-8">
                <Link href="/admin/orders">View all</Link>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                {orders?.map((order) => (
                  <ContextMenu key={order.id}>
                    <ContextMenuTrigger>
                      <div
                        className={cn(
                          "flex items-center p-2 rounded-lg cursor-pointer transition-colors",
                          selectedOrderId === order.id
                            ? "bg-primary/5"
                            : "hover:bg-muted/50"
                        )}
                        onClick={() => setSelectedOrderId(order.id)}
                      >
                        <div className="flex flex-col flex-1 gap-1">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold">{order.id}</span>
                            <span className="rounded-full px-2 py-0.5 text-xs font-medium bg-yellow-100 text-yellow-800">
                              {order.status}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span>{order.customer}</span>
                            <span>•</span>
                            <span>{order.items} items</span>
                            <span>•</span>
                            <span>
                              {format(new Date(order.date), "MMM d, h:mm a")}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="font-semibold">
                            £{order.amount.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </ContextMenuTrigger>
                    <ContextMenuContent className="w-56">
                      <ContextMenuItem asChild>
                        <Link
                          href={`/admin/orders/${order.id}`}
                          className="flex items-center"
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          <span>View Details</span>
                          <ArrowUpRight className="ml-auto h-4 w-4" />
                        </Link>
                      </ContextMenuItem>
                      <ContextMenuSeparator />
                      <ContextMenuSub>
                        <ContextMenuSubTrigger>
                          <Clock className="mr-2 h-4 w-4" />
                          <span>Change Status</span>
                        </ContextMenuSubTrigger>
                        <ContextMenuSubContent className="w-48">
                          {Object.entries(orderStatuses).map(
                            ([status, { label, icon: Icon }]) => (
                              <ContextMenuItem
                                key={status}
                                disabled={order.status === status}
                                className={cn(
                                  order.status === status &&
                                    "bg-muted font-medium"
                                )}
                              >
                                <Icon className="mr-2 h-4 w-4" />
                                <span>{label}</span>
                                {order.status === status && (
                                  <CheckCircle2 className="ml-auto h-4 w-4" />
                                )}
                              </ContextMenuItem>
                            )
                          )}
                        </ContextMenuSubContent>
                      </ContextMenuSub>
                    </ContextMenuContent>
                  </ContextMenu>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Map Section - 2 columns */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPinIcon className="h-5 w-5" />
                Delivery Location
              </CardTitle>
              <CardDescription>
                {selectedOrder
                  ? `Showing location for order ${selectedOrder.id}`
                  : "Select an order to view delivery location"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-muted/50 rounded-lg h-[400px] flex items-center justify-center">
                {selectedOrder ? (
                  <div className="text-center text-muted-foreground">
                    <MapPinIcon className="h-8 w-8 mx-auto mb-2" />
                    <p>Map will be integrated here</p>
                    <p className="text-sm mt-2">
                      Lat: {selectedOrder.location.lat}
                      <br />
                      Lng: {selectedOrder.location.lng}
                    </p>
                  </div>
                ) : (
                  <div className="text-center text-muted-foreground">
                    <MapPinIcon className="h-8 w-8 mx-auto mb-2" />
                    <p>Select an order to view location</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Analytics Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Sales Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3Icon className="h-5 w-5" />
                Sales Overview
              </CardTitle>
              <CardDescription>
                Sales performance over the last 6 months
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <XAxis
                      dataKey="name"
                      stroke="#888888"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      stroke="#888888"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(value) => `£${value}`}
                    />
                    <Bar
                      dataKey="total"
                      fill="currentColor"
                      radius={[4, 4, 0, 0]}
                      className="fill-primary"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Website Analytics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUpIcon className="h-5 w-5" />
                Website Analytics
              </CardTitle>
              <CardDescription>
                User activity over the last 7 days
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={analyticsData}>
                    <XAxis
                      dataKey="name"
                      stroke="#888888"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      stroke="#888888"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <Line
                      type="monotone"
                      dataKey="users"
                      stroke="#2563eb"
                      strokeWidth={2}
                      dot={false}
                    />
                    <Line
                      type="monotone"
                      dataKey="sessions"
                      stroke="#16a34a"
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ContentLayout>
  );
}
