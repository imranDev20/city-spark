"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  Filter,
  Loader2,
  MoreHorizontal,
  PlusCircle,
  Search,
  XCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { ContentLayout } from "../_components/content-layout";

const statusStyles = {
  OPEN: "bg-green-100 text-green-700 border-green-300",
  IN_PROGRESS: "bg-blue-100 text-blue-700 border-blue-300",
  RESOLVED: "bg-gray-100 text-gray-700 border-gray-300",
  CLOSED: "bg-red-100 text-red-700 border-red-300",
  PENDING: "bg-yellow-100 text-yellow-700 border-yellow-300",
};

const priorityIcons = {
  HIGH: <AlertCircle className="h-4 w-4 text-red-500" />,
  MEDIUM: <Clock className="h-4 w-4 text-yellow-500" />,
  LOW: <CheckCircle2 className="h-4 w-4 text-green-500" />,
};

const mockTickets = [
  {
    id: "T-1001",
    subject: "Cannot access my account",
    status: "OPEN",
    priority: "HIGH",
    customer: "John Doe",
    createdAt: new Date(2024, 2, 25),
    lastUpdate: new Date(2024, 2, 26),
    category: "Account Access",
  },
  {
    id: "T-1002",
    subject: "Product delivery delayed",
    status: "IN_PROGRESS",
    priority: "MEDIUM",
    customer: "Jane Smith",
    createdAt: new Date(2024, 2, 24),
    lastUpdate: new Date(2024, 2, 26),
    category: "Shipping",
  },
  {
    id: "T-1003",
    subject: "Refund request",
    status: "RESOLVED",
    priority: "LOW",
    customer: "Bob Wilson",
    createdAt: new Date(2024, 2, 23),
    lastUpdate: new Date(2024, 2, 25),
    category: "Billing",
  },
];

export default function AdminSupportTicketsPage() {
  return (
    <ContentLayout title="Support Tickets">
      <div className="space-y-6">
        {/* Header Stats */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Tickets
              </CardTitle>
              <Loader2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">245</div>
              <p className="text-xs text-muted-foreground">
                +20.1% from last month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Open Tickets
              </CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">23</div>
              <p className="text-xs text-muted-foreground">
                -5% from last month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Average Response Time
              </CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2.4h</div>
              <p className="text-xs text-muted-foreground">
                +12% from last month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Resolution Rate
              </CardTitle>
              <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">92%</div>
              <p className="text-xs text-muted-foreground">
                +2.5% from last month
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Tickets Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Support Tickets</CardTitle>
                <CardDescription>
                  Manage and respond to customer support tickets
                </CardDescription>
              </div>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                New Ticket
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search tickets..." className="pl-8" />
                </div>
              </div>
              <div className="flex gap-2">
                <Select defaultValue="all">
                  <SelectTrigger className="w-[160px]">
                    <Filter className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="open">Open</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
                <Select defaultValue="all">
                  <SelectTrigger className="w-[160px]">
                    <Filter className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Priority</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Table */}
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Ticket ID</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Last Update</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockTickets.map((ticket) => (
                    <TableRow key={ticket.id}>
                      <TableCell className="font-medium">{ticket.id}</TableCell>
                      <TableCell>{ticket.subject}</TableCell>
                      <TableCell>
                        {/* <Badge
                          className={cn("border", statusStyles[ticket.status])}
                        >
                          {ticket.status.replace("_", " ")}
                        </Badge> */}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {/* {priorityIcons[ticket.priority]} */}
                          {ticket.priority}
                        </div>
                      </TableCell>
                      <TableCell>{ticket.customer}</TableCell>
                      <TableCell>
                        {formatDistanceToNow(ticket.createdAt, {
                          addSuffix: true,
                        })}
                      </TableCell>
                      <TableCell>
                        {formatDistanceToNow(ticket.lastUpdate, {
                          addSuffix: true,
                        })}
                      </TableCell>
                      <TableCell>{ticket.category}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </ContentLayout>
  );
}
