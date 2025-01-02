"use server";

import prisma from "@/lib/prisma";
import { format } from "date-fns";

export async function generateOrderNumber(): Promise<string> {
  const PREFIX = "ORD";
  const dateStr = format(new Date(), "yyyyMMdd");

  // Find the last order
  const lastOrder = await prisma.order.findFirst({
    orderBy: {
      orderNumber: "desc",
    },
  });

  let sequentialNumber = 0;
  let currentLetter = "A";

  if (lastOrder?.orderNumber) {
    // Parse the last order number
    // Format: ORD-0000A-20240324
    const parts = lastOrder.orderNumber.split("-");
    if (parts.length === 3) {
      const numberWithLetter = parts[1];
      const currentNumber = parseInt(numberWithLetter.slice(0, 4));
      const currentAlpha = numberWithLetter.charAt(4);

      if (currentNumber === 9999) {
        // If we've reached 9999, increment the letter and reset number
        sequentialNumber = 0;
        currentLetter = String.fromCharCode(currentAlpha.charCodeAt(0) + 1);
        if (currentLetter > "Z") {
          throw new Error("Order number sequence exhausted");
        }
      } else {
        // Just increment the number
        sequentialNumber = currentNumber + 1;
        currentLetter = currentAlpha;
      }
    }
  }

  // Format: ORD-0000A-20240324
  const orderNumber = `${PREFIX}-${String(sequentialNumber).padStart(
    4,
    "0"
  )}${currentLetter}-${dateStr}`;
  return orderNumber;
}
