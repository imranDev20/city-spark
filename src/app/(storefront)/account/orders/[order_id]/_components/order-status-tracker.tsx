"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { OrderStatus } from "@prisma/client";
import {
  FaClock,
  FaBox,
  FaShippingFast,
  FaCheck,
  FaTimes,
} from "react-icons/fa";
import { Card } from "@/components/ui/card";

// Define props for the component
interface OrderStatusTrackerProps {
  currentStatus: OrderStatus;
  className?: string;
}

// Define a type for the status step
type OrderStatusStep = {
  key: OrderStatus;
  label: string;
  icon: React.ComponentType<React.SVGAttributes<SVGElement>>;
  description: string;
};

// Order status tracking steps with icons and descriptions
const orderStatusSteps: OrderStatusStep[] = [
  {
    key: "PENDING",
    label: "Order Placed",
    icon: FaClock,
    description: "We've received your order and are processing it.",
  },
  {
    key: "PROCESSING",
    label: "Processing",
    icon: FaBox,
    description: "Your order is being prepared for shipping.",
  },
  {
    key: "SHIPPED",
    label: "Shipped",
    icon: FaShippingFast,
    description: "Your order is on its way to you.",
  },
  {
    key: "DELIVERED",
    label: "Delivered",
    icon: FaCheck,
    description: "Your order has been delivered.",
  },
  {
    key: "CANCELLED",
    label: "Cancelled",
    icon: FaTimes,
    description: "This order has been cancelled.",
  },
];

const OrderStatusTracker: React.FC<OrderStatusTrackerProps> = ({
  currentStatus,
  className,
}) => {
  // Find the index of the current status in our steps
  const currentIndex = orderStatusSteps.findIndex(
    (step) => step.key === currentStatus
  );

  // Handle cancelled or other special statuses
  if (currentStatus === "CANCELLED") {
    return (
      <div className="bg-white rounded-lg p-4 mb-6 border border-gray-200">
        <div className="flex items-center justify-center text-red-500 mb-2">
          <FaTimes className="h-12 w-12" />
        </div>
        <h3 className="text-center font-medium text-lg">Order Cancelled</h3>
        <p className="text-center text-gray-500 text-sm mt-1">
          This order has been cancelled.
        </p>
      </div>
    );
  }

  // Filter out CANCELLED for normal flow
  const normalSteps = orderStatusSteps.filter(
    (step) => step.key !== "CANCELLED"
  );

  return (
    <Card className="bg-white p-4 mb-6">
      <div className="flex justify-between items-center">
        {normalSteps.map((step, index) => {
          // Determine if this step is active, completed, or upcoming
          const isCompleted = index <= currentIndex && currentIndex !== -1;
          const isActive = index === currentIndex;
          const StepIcon = step.icon;

          return (
            <div
              key={step.key}
              className="flex flex-col items-center relative flex-1"
            >
              {/* Connecting line */}
              {index < normalSteps.length - 1 && (
                <div
                  className={cn(
                    "absolute top-5 w-full h-1 left-1/2",
                    isCompleted ? "bg-primary" : "bg-gray-200"
                  )}
                />
              )}

              {/* Icon circle */}
              <div
                className={cn(
                  "z-10 flex items-center justify-center w-10 h-10 rounded-full border-2",
                  isCompleted
                    ? "border-primary bg-primary text-white"
                    : "border-gray-200 bg-white text-gray-400"
                )}
              >
                <StepIcon className="h-5 w-5" />
              </div>

              {/* Label */}
              <span
                className={cn(
                  "mt-2 text-xs font-medium",
                  isActive
                    ? "text-primary"
                    : isCompleted
                    ? "text-gray-900"
                    : "text-gray-500"
                )}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

export default OrderStatusTracker;
