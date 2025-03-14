import React from "react";
import PayoneerImage from "@/images/payoneer.png";
import VisaImage from "@/images/visa.png";
import MasterCardImage from "@/images/mastercard.png";
import KlarnaImage from "@/images/klarna.png";
import PaypalImage from "@/images/paypal.png";
import Image from "next/image";
import { cn } from "@/lib/utils";

export default function AcceptedPayments({ small = false }) {
  const payments = [
    { image: VisaImage, alt: "Visa Card" },
    { image: PaypalImage, alt: "Paypal" },
    { image: MasterCardImage, alt: "MasterCard" },
    { image: PayoneerImage, alt: "Payoneer" },
    { image: KlarnaImage, alt: "Klarna" },
  ];

  return (
    <div className="grid gap-2 grid-cols-5">
      {payments.map((payment) => (
        <span
          key={payment.alt}
          className={cn(
            "border border-border rounded-md flex justify-center items-center bg-white",
            small ? "px-1.5 py-1" : "px-3 py-2"
          )}
        >
          <Image
            src={payment.image}
            alt={payment.alt}
            width={small ? 28 : 48}
            height={small ? 28 : 48}
            style={{
              objectFit: "contain",
            }}
            loading="lazy"
            placeholder="blur"
          />
        </span>
      ))}
    </div>
  );
}
