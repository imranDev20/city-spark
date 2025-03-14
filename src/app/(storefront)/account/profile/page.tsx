"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { FaUser } from "react-icons/fa";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import PersonalInformationSection from "./_components/personal-information-section";
import SecuritySection from "./_components/security-section";

// Create a client for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      retry: 1,
    },
  },
});

export default function AccountProfilePage() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="space-y-8">
        {/* Welcome Banner - Consistent with other account pages */}
        <Card className="bg-gradient-to-r from-primary to-primary/90 text-white border-0">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 bg-white/10 flex items-center justify-center rounded-full">
                <FaUser className="h-8 w-8" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">My Profile</h1>
                <p className="text-primary-foreground/90 mt-1">
                  Update your personal information and account security
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Personal Information Section */}
        <PersonalInformationSection />

        {/* Security Section with integrated password dialog */}
        <SecuritySection />
      </div>
    </QueryClientProvider>
  );
}
