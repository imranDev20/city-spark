import React from "react";
import Link from "next/link";
import {
  FaFacebook,
  FaXTwitter,
  FaSquareInstagram,
  FaYoutube,
} from "react-icons/fa6";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import AcceptedPayments from "@/app/(storefront)/_components/accepted-payments";
import { FaPaperPlane } from "react-icons/fa";
import { PiPaperPlaneRightFill } from "react-icons/pi";

// Footer links organized by column
const footerLinks = {
  aboutUs: [
    { label: "About Us", href: "/about" },
    { label: "Our Stores", href: "/stores" },
    { label: "Blog", href: "/blog" },
    { label: "Careers", href: "/careers" },
  ],
  policies: [
    { label: "Terms & Conditions of Sale", href: "/terms-conditions-sale" },
    { label: "Purchase Terms", href: "/purchase-terms" },
    { label: "Returns Policy", href: "/returns-policy" },
    { label: "Cookies Policy", href: "/cookies-policy" },
    { label: "Privacy Policy", href: "/privacy-policy" },
    { label: "Modern Slavery Act", href: "/modern-slavery-act" },
    { label: "Environmental Policy", href: "/environmental-policy" },
    { label: "Supplier Commitments", href: "/supplier-commitments" },
    { label: "Promotional Terms & Conditions", href: "/promotional-terms" },
    { label: "Consumer Duty Champion", href: "/consumer-duty-champion" },
  ],
  customerService: [
    { label: "Contact Us", href: "/contact" },
    { label: "FAQs", href: "/faq" },
    { label: "Delivery Information", href: "/delivery" },
    { label: "Returns & Refunds", href: "/returns" },
    { label: "Our Brochures", href: "/returns" },
  ],
  accountInfo: [
    { label: "My Account", href: "/account" },
    { label: "Order History", href: "/account/orders" },
    { label: "Track Order", href: "/account/track" },
    { label: "Wishlist", href: "/account/wishlist" },
  ],
  categories: [
    { label: "Boilers", href: "/products/c/boilers/c", icon: "boiler-icon" },
    {
      label: "Radiators",
      href: "/products/c/radiators/c",
      icon: "radiator-icon",
    },
    { label: "Heating", href: "/products/c/heating/c", icon: "heating-icon" },
    {
      label: "Plumbing",
      href: "/products/c/plumbing/c",
      icon: "plumbing-icon",
    },
    {
      label: "Bathrooms",
      href: "/products/c/bathrooms/c",
      icon: "bathroom-icon",
    },
    { label: "Kitchens", href: "/products/c/kitchens/c", icon: "kitchen-icon" },
    { label: "Spares", href: "/products/c/spares/c", icon: "spares-icon" },
    {
      label: "Renewables",
      href: "/products/c/renewables/c",
      icon: "renewables-icon",
    },
    { label: "Tools", href: "/products/c/tools/c", icon: "tools-icon" },
    {
      label: "Electrical",
      href: "/products/c/electrical/c",
      icon: "electrical-icon",
    },
  ],
};

// Social media links
const socialLinks = [
  { icon: FaFacebook, href: "https://facebook.com", label: "Facebook" },
  {
    icon: FaSquareInstagram,
    href: "https://instagram.com",
    label: "Instagram",
  },
  { icon: FaXTwitter, href: "https://twitter.com", label: "Twitter" },
  { icon: FaYoutube, href: "https://youtube.com", label: "YouTube" },
];

const Footer = () => {
  return (
    <footer className="mt-20">
      {/* Upper Footer - Trustpilot and Payment Options */}
      <div className="bg-primary text-primary-foreground">
        <div className="container mx-auto max-w-screen-xl px-4 py-3 md:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 md:gap-0">
            {/* Trustpilot Score */}
            <div className="text-white p-4 rounded-lg flex items-center space-x-3">
              <span className="text-lg font-semibold">Excellent</span>
              <div className="flex space-x-1">
                {Array(5)
                  .fill(0)
                  .map((_, index) => (
                    <span
                      key={index}
                      className="text-white bg-green-500 w-6 h-6 flex justify-center items-center"
                    >
                      ★
                    </span>
                  ))}
              </div>
              <span className="text-sm">
                4.8 out of 5 based on <strong>427 reviews</strong>
              </span>
              <span className="text-green-500 font-semibold flex items-center space-x-1">
                <svg
                  className="w-4 h-4 text-green-500"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21L12 17.77L5.82 21L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                </svg>
                <span className="text-white font-normal">Trustpilot</span>
              </span>
            </div>

            {/* Payment Options */}
            <div className="flex items-center gap-3">
              <p className="text-xs font-medium whitespace-nowrap">
                Secure Payment Options
              </p>
              <div className="w-full">
                <AcceptedPayments small />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="bg-gray-900 text-white">
        <div className="container mx-auto max-w-screen-xl px-4 py-12 md:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-5">
            {/* Logo and About */}
            <div className="lg:col-span-2 bg-gray-800 p-6 rounded-lg">
              {/* Newsletter Signup */}
              <div className="space-y-5">
                <div>
                  <h3 className="text-lg font-semibold text-gray-100 mb-2">
                    Join Our Newsletter
                  </h3>
                  <p className="text-sm text-gray-300 mb-4">
                    Get the latest updates, promotions and product news straight
                    to your inbox.
                  </p>
                </div>

                <form className="flex flex-col sm:flex-row">
                  <div className="relative flex-1 rounded-lg overflow-hidden">
                    <Input
                      className="w-full bg-white text-gray-800 rounded-r-none border-r-0 h-11"
                      placeholder="Your email address"
                      type="email"
                      required
                    />
                    <Button
                      type="submit"
                      className="absolute right-0 top-0 bg-secondary hover:bg-secondary/90 transition-colors h-11 px-5 whitespace-nowrap rounded-l-none"
                    >
                      <PiPaperPlaneRightFill />
                    </Button>
                  </div>
                </form>

                <p className="text-xs text-gray-400 mt-2">
                  By subscribing, you agree to receive marketing communications
                  and our Privacy Policy. You can unsubscribe at any time.
                </p>

                <div className="pt-3 border-t border-gray-700">
                  <p className="text-gray-300 text-sm leading-relaxed mt-3">
                    Your trusted supplier of heating, plumbing, and bathroom
                    products with over 25 years of experience serving trade and
                    retail customers.
                  </p>
                </div>
              </div>
            </div>
            {/* Links Columns */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">About Us</h3>
              <ul className="space-y-0.5 leading-tight">
                {footerLinks.aboutUs.map((link, index) => (
                  <li key={index} className="py-1">
                    <Link
                      href={link.href}
                      className="text-gray-300 hover:text-white transition-colors duration-200 text-sm"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>

              <h3 className="text-lg font-semibold mt-6">Customer Service</h3>
              <ul className="space-y-0.5 leading-tight">
                {footerLinks.customerService.map((link, index) => (
                  <li key={index} className="py-1">
                    <Link
                      href={link.href}
                      className="text-gray-300 hover:text-white transition-colors duration-200 text-sm"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Legal Information</h3>
              <ul className="space-y-0.5 leading-tight max-h-64">
                {footerLinks.policies.map((link, index) => (
                  <li key={index} className="py-1">
                    <Link
                      href={link.href}
                      className="text-gray-300 hover:text-white transition-colors duration-200 text-sm"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Shop by Category</h3>
              <ul className="space-y-0.5 leading-tight">
                {footerLinks.categories.map((link, index) => (
                  <li key={index} className="py-1">
                    <Link
                      href={link.href}
                      className="text-gray-300 hover:text-white transition-colors duration-200 text-sm"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer - Improved with gradient background */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 text-white">
        <div className="container mx-auto max-w-screen-xl px-4 py-6 md:px-6 lg:px-8">
          <div className="md:flex md:items-center md:justify-between">
            {/* Copyright and Address */}
            <div className="text-base text-gray-400 leading-tight">
              <p>
                © {new Date().getFullYear()} City Spark Ltd. All rights
                reserved.
              </p>
              <p className="mt-1">123 Plumbing Street, London, UK SE1 2AB</p>
            </div>

            {/* Social Media Links */}
            <div className="flex space-x-6 mt-4 md:mt-0">
              {socialLinks.map((link, index) => (
                <Link
                  key={index}
                  href={link.href}
                  className="text-gray-300 hover:text-white transition-colors duration-200"
                  aria-label={link.label}
                >
                  <link.icon className="h-6 w-6" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
