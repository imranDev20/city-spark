"use client";

import React from "react";
import { FaCheck, FaUser, FaTruck, FaCreditCard, FaBox } from "react-icons/fa";

interface DesktopStepperProps {
  currentStep: number;
  steps: number;
}

export default function DesktopStepper({
  currentStep,
  steps,
}: DesktopStepperProps) {
  // Define step data
  const stepsData = [
    {
      id: "contact",
      label: "Contact Details",
      icon: FaUser,
      description: "Your personal information",
    },
    {
      id: "fulfillment",
      label: "Delivery & Collection",
      icon: FaTruck,
      description: "Address and collection details",
    },
    {
      id: "payment",
      label: "Payment",
      icon: FaCreditCard,
      description: "Review and pay",
    },
    {
      id: "review",
      label: "Confirmation",
      icon: FaBox,
      description: "Confirm your order",
    },
  ];

  return (
    <div className="hidden lg:block container max-w-screen-xl mx-auto px-4 py-8 lg:py-12">
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-4 gap-6">
          {stepsData.map((step, index) => {
            const isCompleted = index + 1 < currentStep;
            const isCurrent = index + 1 === currentStep;

            return (
              <div
                key={step.id}
                className={`relative ${
                  isCompleted
                    ? "text-emerald-600"
                    : isCurrent
                    ? "text-primary"
                    : "text-gray-400"
                }`}
              >
                <div className="flex items-center mb-3">
                  <div
                    className={`
                    flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors
                    ${
                      isCompleted
                        ? "border-emerald-600 bg-emerald-600 text-white"
                        : isCurrent
                        ? "border-primary bg-primary text-white"
                        : "border-border bg-white"
                    }
                  `}
                  >
                    {isCompleted ? (
                      <FaCheck className="w-5 h-5" />
                    ) : (
                      <step.icon className="w-5 h-5" />
                    )}
                  </div>
                  {index < stepsData.length - 1 && (
                    <div
                      className={`h-0.5 flex-1 transition-colors ${
                        isCompleted ? "bg-emerald-600" : "bg-gray-200"
                      }`}
                    />
                  )}
                </div>
                <h3
                  className={`text-sm font-semibold ${
                    isCurrent ? "text-gray-900" : ""
                  }`}
                >
                  {step.label}
                </h3>
                <p className="text-xs text-gray-500 mt-1">{step.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
