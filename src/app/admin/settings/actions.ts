"use server";

import prisma from "@/lib/prisma";
import { OrderStatus, Settings } from "@prisma/client";

export async function upsertSettings(data?: Partial<Settings>) {
  try {
    // First, try to get existing settings
    const existingSettings = await prisma.settings.findFirst();

    // Default settings data - this ensures we have fallback values
    const defaultSettings = {
      storeName: "City Spark",
      storeEmail: "info@citysparkstore.com",
      storePhone: "+44 20 1234 5678",
      storeLogo: "/images/logo.png",
      currency: "GBP",
      timezone: "Europe/London",
      percentVat: 20.0,
      enableVat: true,
      displayPricesInclusiveVat: true,
      defaultDeliveryCharge: 5.99,
      freeDeliveryThreshold: 50.0,
      minimumOrderValue: 10.0,
      maximumOrderValue: 5000.0,
      defaultDeliveryTimeInDays: 3,
      enableCollectionOption: true,
      collectionPreparationTime: 24,
      lowStockThreshold: 5,
      enableStockManagement: true,
      allowBackorders: false,
      autoConfirmOrders: false,
      orderNumberPrefix: "SPK",
      defaultOrderStatus: "PENDING" as OrderStatus,
      businessAddress: "123 Spark Street, London, UK",
      businessPhone: "+44 20 1234 5678",
      supportEmail: "support@citysparkstore.com",
      facebookUrl: "https://facebook.com/citysparkstore",
      twitterUrl: "https://twitter.com/citysparkstore",
      instagramUrl: "https://instagram.com/citysparkstore",
      linkedinUrl: "https://linkedin.com/company/citysparkstore",
      metaTitle: "City Spark - Your One-Stop Shop for Quality Products",
      metaDescription:
        "Discover a wide range of quality products at City Spark. Free delivery on orders over £50.",
      enableOrderConfirmationEmails: true,
      enableLowStockAlerts: true,
      enableMarketingEmails: true,
      googleAnalyticsId: "G-XXXXXXXXXX",
      enableAnalytics: true,
      maintenanceMode: false,
      allowGuestCheckout: true,
    };

    if (!existingSettings) {
      // If no settings exist, create new settings
      const newSettings = await prisma.settings.create({
        data: {
          ...defaultSettings,
          ...data,
        },
      });

      return {
        success: true,
        message: "Settings created successfully",
        data: newSettings,
      };
    }

    // If settings exist, update them
    const updatedSettings = await prisma.settings.update({
      where: {
        id: existingSettings.id,
      },
      data: {
        ...data,
      },
    });

    return {
      success: true,
      message: "Settings updated successfully",
      data: updatedSettings,
    };
  } catch (error) {
    console.error("Error in upsertSettings:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to manage settings",
    };
  }
}
