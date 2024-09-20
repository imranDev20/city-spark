import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import img from "@/images/payment-options.png";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { FiFacebook, FiInstagram, FiTwitter, FiYoutube } from "react-icons/fi";

const StorefrontFooter: React.FC = () => {
  return (
    <footer>
      <hr className="border-gray-300   mt-14" />
      <div className="mx-auto w-[85%] flex justify-between mb-10 mt-8">
        <div>
          <h2 className="text-sm font-bold mb-4">
            Sign up for news and offers
          </h2>
          <div className="flex gap-2">
            <Input type="email" placeholder="Email" className="w-60" />
            <Button className="bg-black hover:bg-black text-white font-semibold py-1 px-4 rounded-md">
              SIGN UP
            </Button>
          </div>
        </div>
        <div>
          <h2 className="text-sm font-bold mb-4">Easy Payment</h2>
          <Image src={img} alt="payment" height={48} width={350} />
        </div>
        <div>
          <h2 className="text-sm font-bold mb-4">Connect with us</h2>
          <div className="flex space-x-2   ">
            <Link href={"#"}>
              <FiYoutube
                className="border border-black p-2 rounded-md"
                size={40}
              />
            </Link>
            <Link href={"#"}>
              <FiFacebook
                className="border border-black p-2 rounded-md"
                size={40}
              />
            </Link>
            <Link href={"#"}>
              <FiInstagram
                className="border border-black p-2 rounded-md"
                size={40}
              />
            </Link>
            <Link href={"#"}>
              <FiTwitter
                className="border border-black p-2 rounded-md"
                size={40}
              />
            </Link>
          </div>
        </div>
      </div>
      <div className="bg-black pt-12 pb-6 text-white ">
        <div className="container grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4 lg:gap-12 w-[85%] mx-auto">
          <div className="grid gap-2 text-xs">
            <h4 className=" text-base  font-semibold">Products</h4>
            <Link href="#" className="  hover:text-gray-400  ">
              Boilers
            </Link>
            <Link href="#" className=" hover:text-gray-400">
              Boilers Spares
            </Link>
            <Link href="#" className="hover:text-gray-400">
              Heating & Plumbing
            </Link>
            <Link href="#" className="hover:text-gray-400">
              Electricals
            </Link>
            <Link href="#" className="hover:text-gray-400">
              Bathroom & Kitchen
            </Link>
            <Link href="#" className="hover:text-gray-400">
              Offers
            </Link>
            <Link href="#" className="hover:text-gray-400">
              Gift Cards
            </Link>
          </div>
          <div className="grid gap-2 text-xs">
            <h4 className=" text-base  font-semibold">Overview</h4>
            <Link href="#" className="  hover:text-gray-400  ">
              About us
            </Link>
            <Link href="#" className=" hover:text-gray-400">
              Frequently Asked Questions
            </Link>
            <Link href="#" className="hover:text-gray-400">
              Careers at TradeTools
            </Link>
            <Link href="#" className="hover:text-gray-400">
              Tool Repairs
            </Link>
            <Link href="#" className="hover:text-gray-400">
              Franchising
            </Link>
            <Link href="#" className="hover:text-gray-400">
              TradeTools Member Program
            </Link>
            <Link href="#" className="hover:text-gray-400">
              Renegade Project Bike
            </Link>
            <Link href="#" className="hover:text-gray-400">
              Spare Parts Request
            </Link>
            <Link href="#" className="hover:text-gray-400">
              Tradio
            </Link>
          </div>

          <div className="grid gap-2 text-xs">
            <h4 className=" text-base  font-semibold">Store Information</h4>
            <Link href="#" className="  hover:text-gray-400  ">
              Store Listing
            </Link>
            <Link href="#" className=" hover:text-gray-400">
              Store Locator
            </Link>
            <Link href="#" className="hover:text-gray-400">
              Contact Us
            </Link>
            <Link href="#" className="hover:text-gray-400">
              Payment Options
            </Link>
            <Link href="#" className="hover:text-gray-400">
              2 Hour Tool Delivery
            </Link>
            <Link href="#" className="hover:text-gray-400">
              Information and Recalls
            </Link>
          </div>
          <div className="grid gap-2 text-xs">
            <h4 className=" text-base  font-semibold">Policies</h4>
            <Link href="#" className="  hover:text-gray-400  ">
              Privacy Policy
            </Link>
            <Link href="#" className=" hover:text-gray-400">
              Copyright Statement
            </Link>
            <Link href="#" className="hover:text-gray-400">
              Notice and Disclaimers
            </Link>
            <Link href="#" className="hover:text-gray-400">
              Member Terms and Conditions
            </Link>
            <Link href="#" className="hover:text-gray-400">
              Social Terms and Conditions
            </Link>
            <Link href="#" className="hover:text-gray-400">
              Returns Policy
            </Link>
            <Link href="#" className="hover:text-gray-400">
              Shipping and Freight
            </Link>
            <Link href="#" className="hover:text-gray-400">
              Warranty Overview and Policy
            </Link>
          </div>
        </div>
        <div className="text-gray-600">
          <hr className="my-10 border-gray-600" />
          <p className="ml-14">Copyright © City Spark 2024</p>
        </div>
      </div>
    </footer>
  );
};

export default StorefrontFooter;
