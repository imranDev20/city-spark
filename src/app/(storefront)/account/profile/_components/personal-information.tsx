import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  FaUser,
  FaPencilAlt,
  FaCamera,
  FaSave,
  FaTimes,
  FaUserCircle,
} from "react-icons/fa";

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

const PersonalInformation = ({ profile }: { profile: UserProfile }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: profile.firstName,
    lastName: profile.lastName,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    // Here you would typically save the data to your backend
    console.log("Saving profile data:", formData);
    // Then exit edit mode
    setIsEditing(false);
  };

  const handleCancel = () => {
    // Reset form data to original values
    setFormData({
      firstName: profile.firstName,
      lastName: profile.lastName,
    });
    setIsEditing(false);
  };

  return (
    <Card className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">
              Personal Information
            </h2>
            <p className="text-sm text-gray-500">
              Your account and order details
            </p>
          </div>
          {isEditing ? (
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCancel}
                className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
              >
                <FaTimes className="h-3.5 w-3.5 mr-2" />
                Cancel
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={handleSubmit}
                className="bg-green-600 hover:bg-green-700"
              >
                <FaSave className="h-3.5 w-3.5 mr-2" />
                Save
              </Button>
            </div>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(true)}
              className="border-primary/20 hover:border-primary/30 hover:bg-primary/5"
            >
              <FaPencilAlt className="h-3.5 w-3.5 mr-2" />
              Edit
            </Button>
          )}
        </div>

        <div className="space-y-8">
          {/* Profile Picture & Name Section */}
          <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
            {/* Profile Picture */}
            <div className="relative">
              <div className="h-24 w-24 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border-4 border-white shadow-md">
                {profile.avatar ? (
                  <img
                    src={profile.avatar}
                    alt="Profile"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <FaUserCircle className="h-16 w-16 text-gray-400" />
                )}
              </div>
              <button className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-white text-primary shadow-lg hover:bg-gray-50 transition-colors flex items-center justify-center border border-gray-200">
                <FaCamera className="h-4 w-4" />
              </button>
            </div>

            {/* Name & Summary */}
            <div className="text-center sm:text-left">
              <h3 className="text-xl font-semibold">
                {profile.firstName} {profile.lastName}
              </h3>
              <p className="text-gray-500 text-sm mt-1">{profile.email}</p>

              <div className="mt-3 flex flex-wrap gap-2 justify-center sm:justify-start">
                <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-medium">
                  Customer
                </span>
                <span className="px-3 py-1 rounded-full bg-green-100 text-green-800 text-xs font-medium">
                  {profile.emailVerified ? "Verified Email" : "Email Pending"}
                </span>
              </div>
            </div>
          </div>

          <Separator className="my-6" />

          {/* Form Fields */}
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                First Name
              </label>
              <Input
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className={
                  isEditing
                    ? "border-primary/50 focus-visible:ring-1 bg-white"
                    : "bg-gray-50/50"
                }
                readOnly={!isEditing}
                placeholder="Your first name"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Last Name
              </label>
              <Input
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className={
                  isEditing
                    ? "border-primary/50 focus-visible:ring-1 bg-white"
                    : "bg-gray-50/50"
                }
                readOnly={!isEditing}
                placeholder="Your last name"
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <label className="text-sm font-medium text-gray-700">
                Display Name
              </label>
              <Input
                value={`${formData.firstName} ${formData.lastName}`}
                readOnly
                className="bg-gray-50/50"
                placeholder="Your display name"
              />
              <p className="text-xs text-gray-500 mt-1">
                This is how you&apos;ll appear on invoices and order details
              </p>
            </div>
          </div>

          {isEditing && (
            <div className="pt-4">
              <p className="text-sm text-amber-700 bg-amber-50 p-3 rounded-md border border-amber-200">
                <strong>Note:</strong> Changing your profile information may
                affect how your name appears on future orders and invoices.
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PersonalInformation;
