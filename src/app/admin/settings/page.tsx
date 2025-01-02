"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertCircle,
  Building2,
  Mail,
  MapPin,
  ShieldCheck,
  Settings2,
  Globe,
  PoundSterling,
  Brush,
  Bell,
  ChevronRight,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { cn } from "@/lib/utils";
import { ContentLayout } from "../_components/content-layout";

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState("#basic-settings");

  const navItems = [
    {
      title: "General",
      icon: Settings2,
      items: [
        { title: "Basic Settings", href: "#basic-settings" },
        { title: "Security", href: "#security" },
      ],
    },
    {
      title: "Business",
      icon: Building2,
      items: [
        { title: "Company Details", href: "#company-details" },
        { title: "Address", href: "#address" },
      ],
    },
    {
      title: "Payment & VAT",
      icon: PoundSterling,
      items: [
        { title: "VAT Settings", href: "#vat-settings" },
        { title: "Currency", href: "#currency" },
      ],
    },
    {
      title: "Appearance",
      icon: Brush,
      items: [
        { title: "Theme", href: "#theme" },
        { title: "Branding", href: "#branding" },
      ],
    },
    {
      title: "Notifications",
      icon: Bell,
      items: [
        { title: "Email Settings", href: "#email-settings" },
        { title: "Alert Preferences", href: "#alert-preferences" },
      ],
    },
  ];

  return (
    <ContentLayout isContainer={false} title="Settings">
      <div className="flex h-[calc(100vh-4rem)]">
        {/* Sidebar */}
        <div className="w-64 border-r bg-gray-50/40 overflow-y-auto">
          <div className="p-4">
            {/* <h2 className="text-lg font-semibold mb-4">Settings</h2> */}
            <nav className="space-y-2">
              {navItems.map((section) => (
                <div key={section.title} className="space-y-1">
                  <div className="px-2 py-1.5 text-sm font-medium text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <section.icon className="w-4 h-4" />
                      {section.title}
                    </div>
                  </div>
                  {section.items.map((item) => (
                    <Button
                      key={item.href}
                      variant="ghost"
                      className={cn(
                        "w-full justify-start pl-8 mb-1 font-normal",
                        activeSection === item.href
                          ? "bg-primary text-primary-foreground hover:bg-primary/90"
                          : ""
                      )}
                      onClick={() => setActiveSection(item.href)}
                    >
                      <span className="flex items-center gap-2">
                        <ChevronRight className="w-3 h-3" />
                        {item.title}
                      </span>
                    </Button>
                  ))}
                </div>
              ))}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="container max-w-4xl py-6 px-8">
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Maintenance Mode is Active</AlertTitle>
              <AlertDescription>
                Your store is currently in maintenance mode. Only administrators
                can access the site.
              </AlertDescription>
            </Alert>

            {/* Basic Settings */}
            <div
              id="basic-settings"
              className={cn(
                "space-y-6",
                activeSection !== "#basic-settings" && "hidden"
              )}
            >
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Basic Settings</h2>
                <Button>Save Changes</Button>
              </div>
              <Card>
                <CardHeader>
                  <CardTitle>Store Configuration</CardTitle>
                  <CardDescription>
                    Configure your store&apos;s basic settings
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Maintenance Mode</Label>
                      <p className="text-sm text-muted-foreground">
                        Enable to temporary disable public access
                      </p>
                    </div>
                    <Switch />
                  </div>
                  <Separator />
                  <div className="space-y-4">
                    <div className="grid gap-2">
                      <Label htmlFor="store-url">Store URL</Label>
                      <Input id="store-url" placeholder="https://example.com" />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="support-email">Support Email</Label>
                      <Input
                        id="support-email"
                        type="email"
                        placeholder="support@example.com"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="timezone">Timezone</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select timezone" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="london">London (GMT+0)</SelectItem>
                          <SelectItem value="newyork">
                            New York (GMT-5)
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Security Settings */}
            <div
              id="security"
              className={cn(
                "space-y-6",
                activeSection !== "#security" && "hidden"
              )}
            >
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Security Settings</h2>
                <Button>Save Changes</Button>
              </div>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5" />
                    Security Configuration
                  </CardTitle>
                  <CardDescription>
                    Configure security and access settings
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Two-Factor Authentication</Label>
                      <p className="text-sm text-muted-foreground">
                        Require 2FA for admin access
                      </p>
                    </div>
                    <Switch />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>IP Whitelist</Label>
                      <p className="text-sm text-muted-foreground">
                        Restrict admin access to specific IPs
                      </p>
                    </div>
                    <Switch />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Similar sections for other settings... */}
            {/* Each section would follow the same pattern with its own Card components */}
            {/* They would be shown/hidden based on the activeSection state */}
          </div>
        </div>
      </div>
    </ContentLayout>
  );
}
