"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FaLock, FaGoogle } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { useQuery } from "@tanstack/react-query";
import { getUserProfile } from "@/services/account-profile";
import { Loader2 } from "lucide-react";
import PasswordChangeDialog from "./password-change-dialog";
import GoogleIcon from "@/components/icons/google";

export default function SecuritySection() {
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);

  // Fetch auth info directly in this component
  const {
    data: profile,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["user-profile"],
    queryFn: getUserProfile,
  });

  // Default values if data isn't loaded yet
  const authInfo = profile?.authInfo || {
    hasPassword: false,
    providers: [],
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-40">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center h-40">
        <p className="text-red-500">Failed to load security information</p>
        <Button onClick={() => window.location.reload()} className="mt-2">
          Try Again
        </Button>
      </div>
    );
  }

  // Determine if the button should say "Add Password" or "Change Password"
  const buttonText = authInfo.hasPassword ? "Change Password" : "Add Password";

  const getProviderIcon = (provider: string) => {
    switch (provider.toLowerCase()) {
      case "google":
        return <GoogleIcon />;
      case "credentials":
        return <MdEmail className="h-5 w-5 text-gray-700" />;
      default:
        return null;
    }
  };

  const getProviderName = (provider: string) => {
    switch (provider.toLowerCase()) {
      case "google":
        return "Google";
      case "credentials":
        return "Email & Password";
      default:
        return provider;
    }
  };

  return (
    <>
      {/* Password Change Dialog */}
      <PasswordChangeDialog
        open={passwordDialogOpen}
        onOpenChange={setPasswordDialogOpen}
        authInfo={authInfo}
      />

      {/* Security Section */}
      <Card className="bg-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold">Security</h2>
              <p className="text-sm text-muted-foreground">
                Manage your account security
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="h-12 w-12 bg-primary/10 flex items-center justify-center rounded-xl">
              <FaLock className="h-6 w-6 text-primary" />
            </div>

            <div className="flex-1 flex items-center justify-between">
              <div>
                <h3 className="font-medium">Password</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {authInfo.hasPassword
                    ? "Change your password to keep your account secure"
                    : "Add a password to enable direct login to your account"}
                </p>
              </div>
              <Button
                variant="outline"
                onClick={() => setPasswordDialogOpen(true)}
              >
                {buttonText}
              </Button>
            </div>
          </div>

          {/* Connected accounts section */}
          {authInfo.providers.length > 0 && (
            <div className="mt-6 pt-6 border-t">
              <h3 className="font-medium mb-3">Connected Accounts</h3>
              <div className="space-y-4">
                {authInfo.providers.map((provider) => (
                  <div
                    key={provider}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 bg-gray-100 flex items-center justify-center rounded-full">
                        {getProviderIcon(provider)}
                      </div>
                      <div>
                        <p className="font-medium">
                          {getProviderName(provider)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Connected
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}
