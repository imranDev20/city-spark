import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import img from "@/images/payment-options.png";
import Image from "next/image";
import Link from "next/link";
import { FiFacebook, FiInstagram, FiTwitter, FiYoutube } from "react-icons/fi";

const StorefrontFooter = () => {
  return (
    <footer>
      <hr className="border-border mt-8 md:mt-14" />

      {/* Upper Footer Section */}
      <div className="bg-muted">
        <div className="mx-auto w-[90%] md:w-[85%] flex flex-col md:flex-row gap-8 md:gap-0 md:justify-between py-8 md:py-10">
          {/* Newsletter Section */}
          <div className="w-full md:w-auto">
            <h2 className="text-sm font-bold mb-3 md:mb-4 text-foreground">
              Sign up for news and offers
            </h2>
            <form className="flex flex-col sm:flex-row gap-2">
              <Input
                type="email"
                placeholder="Email"
                className="w-full sm:w-60 border-input focus-visible:ring-primary"
                name="email"
                required
              />
              <Button
                type="submit"
                variant="secondary"
                size="lg"
                className="w-full sm:w-auto font-semibold"
              >
                SIGN UP
              </Button>
            </form>
          </div>

          {/* Payment Options Section */}
          <div className="w-full md:w-auto">
            <h2 className="text-sm font-bold mb-3 md:mb-4 text-foreground">
              Easy Payment
            </h2>
            <Image
              src={img}
              alt="payment"
              height={48}
              width={350}
              className="w-auto h-auto"
              priority
            />
          </div>

          {/* Social Media Section */}
          <div className="w-full md:w-auto">
            <h2 className="text-sm font-bold mb-3 md:mb-4 text-foreground">
              Connect with us
            </h2>
            <div className="grid gap-5 grid-cols-4 sm:flex sm:gap-2">
              {[
                { Icon: FiYoutube, href: "#", label: "YouTube" },
                { Icon: FiFacebook, href: "#", label: "Facebook" },
                { Icon: FiInstagram, href: "#", label: "Instagram" },
                { Icon: FiTwitter, href: "#", label: "Twitter" },
              ].map(({ Icon, href, label }) => (
                <Link
                  href={href}
                  key={label}
                  className="block"
                  aria-label={label}
                >
                  <Icon
                    className="w-full h-auto border border-primary/20 p-2.5 md:p-1.5 rounded-md 
                             text-primary hover:bg-primary hover:text-primary-foreground 
                             transition-colors duration-200"
                    size={32}
                  />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Section */}
      <div className="bg-primary pt-8 md:pt-12 pb-6 text-primary-foreground">
        <div className="container mx-auto w-[90%] md:w-[85%]">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 lg:gap-12">
            {/* Products Column */}
            <div className="space-y-2">
              <h4 className="text-base font-semibold mb-3">Products</h4>
              <nav className="grid gap-2 text-xs">
                {[
                  "Boilers",
                  "Boilers Spares",
                  "Heating & Plumbing",
                  "Electricals",
                  "Bathroom & Kitchen",
                  "Offers",
                  "Gift Cards",
                ].map((item) => (
                  <Link
                    key={item}
                    href="#"
                    className="hover:text-secondary transition-colors duration-200"
                  >
                    {item}
                  </Link>
                ))}
              </nav>
            </div>

            {/* Overview Column */}
            <div className="space-y-2">
              <h4 className="text-base font-semibold mb-3">Overview</h4>
              <nav className="grid gap-2 text-xs">
                {[
                  "About us",
                  "Frequently Asked Questions",
                  "Careers at TradeTools",
                  "Tool Repairs",
                  "Franchising",
                  "TradeTools Member Program",
                  "Renegade Project Bike",
                  "Spare Parts Request",
                  "Tradio",
                ].map((item) => (
                  <Link
                    key={item}
                    href="#"
                    className="hover:text-secondary transition-colors duration-200"
                  >
                    {item}
                  </Link>
                ))}
              </nav>
            </div>

            {/* Store Information Column */}
            <div className="space-y-2">
              <h4 className="text-base font-semibold mb-3">
                Store Information
              </h4>
              <nav className="grid gap-2 text-xs">
                {[
                  "Store Listing",
                  "Store Locator",
                  "Contact Us",
                  "Payment Options",
                  "2 Hour Tool Delivery",
                  "Information and Recalls",
                ].map((item) => (
                  <Link
                    key={item}
                    href="#"
                    className="hover:text-secondary transition-colors duration-200"
                  >
                    {item}
                  </Link>
                ))}
              </nav>
            </div>

            {/* Policies Column */}
            <div className="space-y-2">
              <h4 className="text-base font-semibold mb-3">Policies</h4>
              <nav className="grid gap-2 text-xs">
                {[
                  "Privacy Policy",
                  "Copyright Statement",
                  "Notice and Disclaimers",
                  "Member Terms and Conditions",
                  "Social Terms and Conditions",
                  "Returns Policy",
                  "Shipping and Freight",
                  "Warranty Overview and Policy",
                ].map((item) => (
                  <Link
                    key={item}
                    href="#"
                    className="hover:text-secondary transition-colors duration-200"
                  >
                    {item}
                  </Link>
                ))}
              </nav>
            </div>
          </div>

          {/* Copyright Section */}
          <div className="text-primary-foreground/60">
            <hr className="my-8 md:my-10 border-primary-foreground/20" />
            <p className="text-center md:text-left md:ml-14 text-xs">
              Copyright © City Spark 2024
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default StorefrontFooter;
