"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect, useRef } from "react";
import {
  LogIn,
  UserCircle,
  Heart,
  Package,
  MapPin,
  LogOut,
  LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";

type MenuItemProps = {
  icon: LucideIcon;
  label: string;
  href?: string;
  onClick?: () => void;
};

const MenuItem = ({ icon: Icon, label, href, onClick }: MenuItemProps) => {
  const content = (
    <>
      <Icon className="inline-block mr-2 h-4 w-4" />
      {label}
    </>
  );

  const className =
    "block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors rounded-md hover:text-primary";

  return href ? (
    <Link href={href} className={className}>
      {content}
    </Link>
  ) : (
    <button onClick={onClick} className={className}>
      {content}
    </button>
  );
};

export default function AccountDropdown() {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleOpen = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsOpen(true);
  };

  const handleClose = () => {
    timeoutRef.current = setTimeout(() => setIsOpen(false), 100);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  if (!session) {
    return (
      <Link
        href="/login"
        className="flex items-center text-white hover:text-yellow-300 transition-colors"
      >
        <LogIn className="mr-2 h-5 w-5" />
        Sign In
      </Link>
    );
  }

  const menuItems = [
    { icon: UserCircle, label: "Profile", href: "/profile" },
    { icon: Heart, label: "Wishlist", href: "/wishlist" },
    { icon: Package, label: "Orders", href: "/orders" },
    { icon: MapPin, label: "Addresses", href: "/addresses" },
  ];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        className="flex items-center text-white hover:text-yellow-300 transition-colors"
        onMouseEnter={handleOpen}
        onMouseLeave={handleClose}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="w-8 h-8 rounded-full bg-gray-300 mr-2 flex items-center justify-center overflow-hidden">
          {session.user?.image ? (
            <Image
              src={session.user.image}
              alt={session.user.firstName || ""}
              className="w-full h-full object-cover"
              width={32}
              height={32}
            />
          ) : (
            <span className="text-secondary text-xs font-semibold">
              {session.user?.firstName?.charAt(0) || "U"}
            </span>
          )}
        </div>
        Account
      </button>

      {isOpen && (
        <div
          className="absolute right-1/2 transform translate-x-1/2 mt-2 w-64 bg-white rounded-md shadow-xl py-1 z-10 animate-fadeIn"
          onMouseEnter={handleOpen}
          onMouseLeave={handleClose}
        >
          <div className="px-4 py-3">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-gray-300 mr-3 flex items-center justify-center overflow-hidden">
                {session.user?.image ? (
                  <Image
                    src={session.user.image}
                    alt={session.user.firstName || ""}
                    className="w-full h-full object-cover"
                    width={40}
                    height={40}
                  />
                ) : (
                  <span className="text-secondary text-sm font-semibold">
                    {session.user?.firstName?.charAt(0) || "U"}
                  </span>
                )}
              </div>
              <div>
                <p className="text-base font-medium text-gray-900">
                  {`${session.user.firstName} ${session.user.lastName}`}
                </p>
                <p className="text-xs text-gray-500">{session.user.email}</p>
              </div>
            </div>
          </div>

          <Separator className="my-1" />

          <div className="py-1 px-2">
            {menuItems.map((item) => (
              <MenuItem key={item.label} {...item} />
            ))}
          </div>

          <Separator className="my-1" />

          <div className="px-2 py-1">
            <MenuItem icon={LogOut} label="Log out" onClick={() => signOut()} />
          </div>
        </div>
      )}
    </div>
  );
}
