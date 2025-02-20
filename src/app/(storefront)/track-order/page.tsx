"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  FaSearch,
  FaTruck,
  FaMapMarkedAlt,
  FaBoxes,
  FaCheckCircle,
  FaClipboardList,
  FaClock,
  FaCalendarAlt,
  FaBarcode,
  FaPrint,
  FaFileDownload,
  FaUserClock,
  FaPhoneAlt,
  FaEnvelope,
} from "react-icons/fa";
import { cn } from "@/lib/utils";

export default function TrackOrderPage() {
  const [orderNumber, setOrderNumber] = useState("");
  const [isTracking, setIsTracking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Mock shipping progress percentage
  const shippingProgress = 75;

  const handleTrackOrder = () => {
    if (orderNumber) {
      setIsLoading(true);
      setTimeout(() => {
        setIsTracking(true);
        setIsLoading(false);
      }, 800);
    }
  };

  return (
    <div className="min-h-screen py-12 lg:py-20 px-4 sm:px-6 lg:px-8">
      <div className="container max-w-5xl mx-auto">
        {/* Header Section */}

        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Order Tracking System</h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Enter your order number to track your shipment and see real-time
            delivery updates
          </p>
        </div>

        {/* Search Card */}
        <Card className="bg-white shadow-md mb-8 overflow-hidden">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                  <FaBarcode className="w-5 h-5 text-gray-400" />
                </div>
                <Input
                  type="text"
                  placeholder="Enter your order number"
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value)}
                  className="pl-10 h-12 bg-gray-50 border-gray-200"
                />
              </div>
              <Button
                onClick={handleTrackOrder}
                className="h-12 px-8 bg-primary hover:bg-primary/90"
                disabled={!orderNumber || isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/20 border-t-white animate-spin rounded-full" />
                    <span>Searching...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <FaSearch className="w-4 h-4" />
                    <span>Track Order</span>
                  </div>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {isTracking && (
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Main Tracking Info */}
            <div className="lg:col-span-2 space-y-6">
              {/* Order Summary */}
              <Card className="bg-white shadow-md overflow-hidden">
                <CardHeader className="border-b bg-gray-50/50 p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl font-bold">
                        Order #{orderNumber}
                      </CardTitle>
                      <p className="text-sm text-gray-500 mt-1">
                        Placed on December 15, 2023
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="h-9">
                        <FaPrint className="w-4 h-4 mr-2" />
                        Print
                      </Button>
                      <Button variant="outline" size="sm" className="h-9">
                        <FaFileDownload className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid sm:grid-cols-3 gap-6">
                    <div className="space-y-1">
                      <p className="text-sm text-gray-500">
                        Estimated Delivery
                      </p>
                      <p className="font-medium flex items-center gap-2">
                        <FaCalendarAlt className="text-primary/70" />
                        Dec 18, 2023
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-gray-500">Shipping Method</p>
                      <p className="font-medium flex items-center gap-2">
                        <FaTruck className="text-primary/70" />
                        Express Delivery
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-gray-500">Tracking Number</p>
                      <p className="font-medium flex items-center gap-2">
                        <FaClipboardList className="text-primary/70" />
                        1Z999AA1234567890
                      </p>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-8">
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all duration-500"
                        style={{ width: `${shippingProgress}%` }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Detailed Timeline */}
              <Card className="bg-white shadow-md overflow-hidden">
                <CardHeader className="border-b bg-gray-50/50 p-6">
                  <CardTitle>Shipment Timeline</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="relative">
                    <div className="absolute left-[17px] top-0 bottom-0 w-[2px] bg-gray-100" />

                    <div className="space-y-8">
                      {[
                        {
                          status: "Out for Delivery",
                          desc: "Package is out for delivery",
                          time: "08:00 AM",
                          date: "Dec 18, 2023",
                          icon: FaTruck,
                          isActive: true,
                          location: "London Distribution Center",
                        },
                        {
                          status: "Arrived at Facility",
                          desc: "Package arrived at delivery facility",
                          time: "11:30 PM",
                          date: "Dec 17, 2023",
                          icon: FaBoxes,
                          isActive: true,
                          location: "London South Hub",
                        },
                        {
                          status: "In Transit",
                          desc: "Package is in transit to delivery facility",
                          time: "03:15 PM",
                          date: "Dec 16, 2023",
                          icon: FaMapMarkedAlt,
                          isActive: true,
                          location: "Manchester Sorting Center",
                        },
                        {
                          status: "Order Processed",
                          desc: "Order has been processed and picked up by courier",
                          time: "10:30 AM",
                          date: "Dec 15, 2023",
                          icon: FaCheckCircle,
                          isActive: true,
                          location: "Central Warehouse",
                        },
                      ].map((step, index) => (
                        <div key={index} className="relative flex gap-6 group">
                          <div
                            className={cn(
                              "w-9 h-9 rounded-full border-2 flex items-center justify-center bg-white z-10 transition-all duration-300",
                              step.isActive
                                ? "border-primary text-primary"
                                : "border-gray-200 text-gray-400"
                            )}
                          >
                            <step.icon className="w-4 h-4" />
                          </div>
                          <div className="flex-1">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                              <div>
                                <h4 className="font-semibold text-gray-900">
                                  {step.status}
                                </h4>
                                <p className="text-sm text-gray-500 mt-1">
                                  {step.desc}
                                </p>
                                <div className="flex items-center gap-2 text-sm text-gray-400 mt-2">
                                  <FaMapMarkedAlt className="w-4 h-4" />
                                  {step.location}
                                </div>
                              </div>
                              <div className="text-right text-sm text-gray-500 mt-2 sm:mt-0">
                                <div className="font-medium">{step.time}</div>
                                <div>{step.date}</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Delivery Info */}
              <Card className="bg-white shadow-md overflow-hidden">
                <CardHeader className="border-b bg-gray-50/50 p-6">
                  <CardTitle>Delivery Information</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-medium text-gray-900 mb-2">
                        Delivery Address
                      </h3>
                      <p className="text-gray-600 text-sm">
                        John Smith
                        <br />
                        123 Example Street
                        <br />
                        London, EC1A 1BB
                        <br />
                        United Kingdom
                      </p>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 mb-2">
                        Delivery Window
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <FaClock className="text-primary/70" />
                        14:00 - 16:00
                      </div>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 mb-2">
                        Contact Driver
                      </h3>
                      <div className="text-sm text-gray-600">
                        Available when driver is assigned
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Need Help Card */}
              <Card className="bg-white shadow-md overflow-hidden">
                <CardHeader className="border-b bg-gray-50/50 p-6">
                  <CardTitle>Need Help?</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <FaUserClock className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900">
                          24/7 Support
                        </p>
                        <p className="text-sm text-gray-500">
                          Always here to help
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <Button variant="outline" className="w-full">
                        <FaPhoneAlt className="w-4 h-4 mr-2" />
                        Call Us
                      </Button>
                      <Button variant="outline" className="w-full">
                        <FaEnvelope className="w-4 h-4 mr-2" />
                        Email
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
