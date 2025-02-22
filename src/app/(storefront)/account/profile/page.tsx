"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaLock,
  FaPencilAlt,
  FaCamera,
  FaCheckCircle,
  FaExclamationCircle,
  FaUserCircle,
  FaTimes,
  FaSave,
} from "react-icons/fa";
import { Form } from "@/components/ui/form";
import PersonalInformation from "./_components/personal-information";

interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  emailVerified: boolean;
  phone?: string;
  phoneVerified?: boolean;
  contactEmail?: string;
  avatar?: string;
}

// Dummy data
const dummyProfile: UserProfile = {
  firstName: "John",
  lastName: "Doe",
  email: "john.doe@example.com",
  emailVerified: true,
  phone: "+44 7700 900123",
  phoneVerified: false,
  contactEmail: "john.business@example.com",
  avatar: "/images/placeholder-avatar.png",
};

export default function AccountProfilePage() {
  return (
    <div className="space-y-8">
      {/* Header Card */}
      <Card className="bg-gradient-to-r from-primary to-primary/90 text-white border-0">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-white/10 flex items-center justify-center">
              <FaUserCircle className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">My Profile</h1>
              <p className="text-primary-foreground/90 mt-1">
                Manage your account details and contact information
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Personal Information */}

        <PersonalInformation profile={dummyProfile} />

        {/* Contact Information */}
        <Card className="bg-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold">Contact Details</h2>
                <p className="text-sm text-gray-500">
                  Your contact information for orders and notifications
                </p>
              </div>
              <Button variant="outline" size="sm">
                <FaPencilAlt className="h-3.5 w-3.5 mr-2" />
                Edit
              </Button>
            </div>
            <div className="space-y-4">
              {/* Email */}
              <div className="p-4 rounded-lg bg-gray-50/50 space-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm font-medium text-gray-500">
                    <FaEnvelope className="h-4 w-4" />
                    Primary Email
                  </div>
                  {dummyProfile.emailVerified ? (
                    <span className="inline-flex items-center gap-1 text-green-600 text-sm">
                      <FaCheckCircle className="h-4 w-4" />
                      Verified
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-amber-600 text-sm">
                      <FaExclamationCircle className="h-4 w-4" />
                      Unverified
                    </span>
                  )}
                </div>
                <p className="text-gray-900 font-medium">
                  {dummyProfile.email}
                </p>
              </div>

              {/* Phone */}
              <div className="p-4 rounded-lg bg-gray-50/50 space-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm font-medium text-gray-500">
                    <FaPhone className="h-4 w-4" />
                    Phone Number
                  </div>
                  {dummyProfile.phoneVerified ? (
                    <span className="inline-flex items-center gap-1 text-green-600 text-sm">
                      <FaCheckCircle className="h-4 w-4" />
                      Verified
                    </span>
                  ) : (
                    <Button variant="outline" size="sm">
                      Verify Phone
                    </Button>
                  )}
                </div>
                <p className="text-gray-900 font-medium">
                  {dummyProfile.phone}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security Information */}
        <Card className="bg-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold">Security</h2>
                <p className="text-sm text-gray-500">
                  Secure your account and shopping experience
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-gray-50/50">
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-10 w-10 rounded-lg bg-primary/5 flex items-center justify-center text-primary">
                    <FaLock className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-medium">Password</h3>
                    <p className="text-sm text-gray-500">
                      Last changed 3 months ago
                    </p>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="w-full">
                  Change Password
                </Button>
              </div>

              <div className="p-4 rounded-lg bg-gray-50/50">
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-10 w-10 rounded-lg bg-primary/5 flex items-center justify-center text-primary">
                    <FaUserCircle className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-medium">Two-Factor Authentication</h3>
                    <p className="text-sm text-gray-500">
                      Add extra account security
                    </p>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="w-full">
                  Enable 2FA
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Marketing Preferences */}
        <Card className="bg-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold">Communication</h2>
                <p className="text-sm text-gray-500">
                  Manage your marketing preferences
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-gray-50/50">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-primary/5 flex items-center justify-center text-primary">
                    <FaEnvelope className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-medium">Promotional Emails</h3>
                    <p className="text-sm text-gray-500">
                      Receive special offers and promotions
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
