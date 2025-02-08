"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect, useRef, useTransition } from "react";
import {
  FaUser,
  FaSpinner,
  FaUserCircle,
  FaHeart,
  FaBox,
  FaMapMarkerAlt,
  FaSignOutAlt,
} from "react-icons/fa";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";

type MenuItemProps = {
  icon: React.ElementType;
  label: string;
  href?: string;
  onClick?: () => void | Promise<void>;
  loading?: boolean;
};

const MenuItem = ({
  icon: Icon,
  label,
  href,
  onClick,
  loading,
}: MenuItemProps) => {
  const className = cn(
    "flex items-center w-full rounded-lg transition-all duration-200", // Added w-full here
    "px-4 py-2.5 gap-3",
    loading
      ? "opacity-70 cursor-not-allowed"
      : "text-gray-700 hover:bg-gray-100"
  );

  const content = (
    <>
      <Icon className="h-5 w-5 flex-shrink-0" />
      <span className="text-sm font-medium">{label}</span>
    </>
  );

  if (href) {
    return (
      <Link href={href} className={className}>
        {content}
      </Link>
    );
  }

  return (
    <button onClick={onClick} disabled={loading} className={className}>
      {content}
    </button>
  );
};

export default function AccountDropdown() {
  const { data: session, status } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleOpen = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsOpen(true);
  };

  const handleClose = () => {
    timeoutRef.current = setTimeout(() => setIsOpen(false), 100);
  };

  const handleSignOut = () => {
    startTransition(async () => {
      await signOut();
    });
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

  if (status === "loading") {
    return (
      <div className="flex flex-col items-center gap-1 px-3 py-2">
        <Skeleton className="h-7 w-7 rounded-full mb-1" />
        <Skeleton className="h-4 w-[65px] mb-1" />
        <Skeleton className="h-3 w-14" />
      </div>
    );
  }

  if (!session) {
    return (
      <Link
        href="/login"
        className={cn(
          "flex flex-col items-center gap-1 px-3 py-2 text-white rounded-md transition-colors duration-200",
          "hover:bg-white/10",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-white/20"
        )}
      >
        <FaUser className="h-8 w-8" />
        <span className="text-base font-semibold">Account</span>
        <span className="text-xs font-light -mt-1">Sign In</span>
      </Link>
    );
  }

  const menuItems = [
    { icon: FaUserCircle, label: "Profile", href: "/account" },
    { icon: FaHeart, label: "Wishlist", href: "/wishlist" },
    { icon: FaBox, label: "Orders", href: "/orders" },
    { icon: FaMapMarkerAlt, label: "Notifications", href: "/notifications" },
  ];

  const initials = `${session.user?.firstName?.[0] || ""}${
    session.user?.lastName?.[0] || ""
  }`.toUpperCase();

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        className={cn(
          "flex flex-col items-center gap-1 px-3 py-2 text-white rounded-md transition-colors duration-200",
          "hover:bg-white/10",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-white/20"
        )}
        onMouseEnter={handleOpen}
        onMouseLeave={handleClose}
        onClick={() => setIsOpen(!isOpen)}
      >
        <Avatar className="h-8 w-8 border border-white bg-white">
          <AvatarImage
            src={session.user?.image || undefined}
            alt={session.user?.firstName || ""}
            className="object-cover"
          />
          <AvatarFallback className="bg-white/10 text-primary">
            {initials}
          </AvatarFallback>
        </Avatar>
        <span className="text-base font-semibold">Account</span>
        <span className="text-xs font-light -mt-1">
          {session.user?.firstName || "Account"}
        </span>
      </button>

      {isOpen && (
        <div
          className={cn(
            "absolute right-1/2 transform translate-x-1/2 mt-2 w-64",
            "bg-white text-card-foreground rounded-md shadow-lg",
            "border border-border py-1 z-50 animate-fadeIn"
          )}
          onMouseEnter={handleOpen}
          onMouseLeave={handleClose}
        >
          <div className="p-1">
            <Link
              href="/account"
              className="block w-full text-left px-4 py-3 text-sm text-foreground hover:bg-accent/60 transition-colors rounded-md hover:text-accent-foreground focus:outline-none focus:bg-accent/60"
            >
              <div className="flex items-center">
                <Avatar className="h-10 w-10 border border-border mr-3 shrink-0">
                  <AvatarImage
                    src={session.user?.image || undefined}
                    alt={session.user?.firstName || ""}
                    className="object-cover"
                  />
                  <AvatarFallback className="bg-gray-700 text-white">
                    {initials}
                  </AvatarFallback>
                </Avatar>

                <div className="min-w-0">
                  <p className="text-base font-medium truncate">
                    {`${session.user.firstName} ${session.user.lastName}`}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {session.user.email}
                  </p>
                </div>
              </div>
            </Link>
          </div>

          <Separator />

          <div className="py-1 px-2">
            {menuItems.map((item) => (
              <MenuItem key={item.label} {...item} />
            ))}
          </div>

          <Separator />

          <div className="px-2 py-1">
            <MenuItem
              icon={FaSignOutAlt}
              label="Log out"
              onClick={handleSignOut}
              loading={isPending}
            />
          </div>
        </div>
      )}
    </div>
  );
}
