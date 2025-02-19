import { Metadata } from "next";
import FAQPage from "./_components/faq";

export const metadata: Metadata = {
  title: "FAQ - Frequently Asked Questions",
  description:
    "Find answers to commonly asked questions about our products, services, delivery, returns, and more.",
};

export default function FAQ() {
  return <FAQPage />;
}
