"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  FaCog,
  FaBell,
  FaEnvelope,
  FaMobile,
  FaReceipt,
  FaUserShield,
} from "react-icons/fa";

const dummySettings = {
  notifications: {
    email: {
      orderUpdates: true,
      deliveryUpdates: true,
      stockAlerts: false,
      priceDropAlerts: true,
      orderConfirmations: true,
      securityAlerts: true,
    },
    sms: {
      orderUpdates: true,
      deliveryUpdates: true,
      securityAlerts: true,
    },
  },
  preferences: {
    showPricesWithVat: true,
    orderSummaryWithVat: true,
    saveOrderHistory: true,
    autoSaveBasket: true,
  },
};

export default function AccountSettingsPage() {
  return (
    <div className="space-y-8">
      {/* Header Card */}
      <Card className="bg-gradient-to-r from-primary to-primary/90 text-white border-0">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-white/10 flex items-center justify-center">
              <FaCog className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Account Settings</h1>
              <p className="text-primary-foreground/90 mt-1">
                Manage your shopping preferences and notifications
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Price Display Preferences */}
        <Card className="bg-white">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-10 w-10 rounded-lg bg-primary/5 flex items-center justify-center text-primary">
                <FaReceipt className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg font-semibold">Price Display</h2>
                <p className="text-sm text-gray-500">
                  Customize how prices are shown
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Show Prices with VAT</p>
                  <p className="text-sm text-gray-500">
                    Display prices including VAT by default
                  </p>
                </div>
                <Switch
                  checked={dummySettings.preferences.showPricesWithVat}
                  onCheckedChange={() => {}}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Order Summary with VAT</p>
                  <p className="text-sm text-gray-500">
                    Show VAT breakdown in order summary
                  </p>
                </div>
                <Switch
                  checked={dummySettings.preferences.orderSummaryWithVat}
                  onCheckedChange={() => {}}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Email Notifications */}
        <Card className="bg-white">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-10 w-10 rounded-lg bg-primary/5 flex items-center justify-center text-primary">
                <FaEnvelope className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg font-semibold">Email Notifications</h2>
                <p className="text-sm text-gray-500">
                  Manage order and product alerts
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Order Updates</p>
                  <p className="text-sm text-gray-500">
                    Status changes and confirmations
                  </p>
                </div>
                <Switch
                  checked={dummySettings.notifications.email.orderUpdates}
                  onCheckedChange={() => {}}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Stock Alerts</p>
                  <p className="text-sm text-gray-500">
                    When saved items are back in stock
                  </p>
                </div>
                <Switch
                  checked={dummySettings.notifications.email.stockAlerts}
                  onCheckedChange={() => {}}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Price Drop Alerts</p>
                  <p className="text-sm text-gray-500">
                    When saved items go on sale
                  </p>
                </div>
                <Switch
                  checked={dummySettings.notifications.email.priceDropAlerts}
                  onCheckedChange={() => {}}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* SMS Notifications */}
        <Card className="bg-white">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-10 w-10 rounded-lg bg-primary/5 flex items-center justify-center text-primary">
                <FaMobile className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg font-semibold">SMS Notifications</h2>
                <p className="text-sm text-gray-500">Manage delivery updates</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Delivery Updates</p>
                  <p className="text-sm text-gray-500">
                    Get SMS updates about your deliveries
                  </p>
                </div>
                <Switch
                  checked={dummySettings.notifications.sms.deliveryUpdates}
                  onCheckedChange={() => {}}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Order Confirmations</p>
                  <p className="text-sm text-gray-500">
                    Receive order confirmation texts
                  </p>
                </div>
                <Switch
                  checked={dummySettings.notifications.sms.orderUpdates}
                  onCheckedChange={() => {}}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Shopping Preferences */}
        <Card className="bg-white">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-10 w-10 rounded-lg bg-primary/5 flex items-center justify-center text-primary">
                <FaUserShield className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg font-semibold">Shopping Preferences</h2>
                <p className="text-sm text-gray-500">
                  Customize your shopping experience
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Save Order History</p>
                  <p className="text-sm text-gray-500">
                    Keep track of your past orders
                  </p>
                </div>
                <Switch
                  checked={dummySettings.preferences.saveOrderHistory}
                  onCheckedChange={() => {}}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Auto-save Basket</p>
                  <p className="text-sm text-gray-500">
                    Save items in your basket for later
                  </p>
                </div>
                <Switch
                  checked={dummySettings.preferences.autoSaveBasket}
                  onCheckedChange={() => {}}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
