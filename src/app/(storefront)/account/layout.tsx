"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  FaUser,
  FaHeart,
  FaTachometerAlt,
  FaMapMarkerAlt,
  FaCog,
  FaShoppingCart,
} from "react-icons/fa";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Loader2 } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import LogoutDialog from "./_components/logout-dialog";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

const navigation = [
  {
    name: "Dashboard",
    href: "/account",
    icon: FaTachometerAlt,
  },
  {
    name: "Orders",
    href: "/account/orders",
    icon: FaShoppingCart,
  },
  {
    name: "Wishlist",
    href: "/account/wishlist",
    icon: FaHeart,
  },
  {
    name: "Addresses",
    href: "/account/addresses",
    icon: FaMapMarkerAlt,
  },
  {
    name: "Profile",
    href: "/account/profile",
    icon: FaUser,
  },
];

const getInitials = (firstName?: string | null, lastName?: string | null) => {
  const first = firstName?.charAt(0) || "";
  const last = lastName?.charAt(0) || "";
  return (first + last).toUpperCase();
};

const NavLink = ({
  item,
  className,
  isMobile = false,
}: {
  item: (typeof navigation)[0];
  className?: string;
  isMobile?: boolean;
}) => {
  const pathname = usePathname();

  // Fixed active state logic
  const normalizedPathname = pathname.endsWith("/")
    ? pathname.slice(0, -1)
    : pathname;

  const isActive =
    // For dashboard, it should be active when the path is /account with or without trailing slash
    (item.href === "/account" && normalizedPathname === "/account") ||
    // For other items, check if the pathname starts with the item's href
    // but make sure it's not the dashboard catching /account/something
    (item.href !== "/account" && normalizedPathname.startsWith(item.href));

  return (
    <Link
      href={item.href}
      className={cn(
        "flex items-center rounded-lg group relative",
        "transition-colors duration-200",
        isActive
          ? "bg-primary text-primary-foreground"
          : "hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary bg-white border lg:border-0 border-border",
        isMobile ? "flex-col p-3 gap-2" : "px-4 py-2.5 gap-3",
        className
      )}
    >
      <item.icon
        className={cn(
          "flex-shrink-0",
          isMobile ? "h-6 w-6" : "h-5 w-5",
          !isActive &&
            cn(
              "text-muted-foreground transition-colors duration-200",
              "group-hover:text-primary"
            )
        )}
      />
      <span
        className={cn(
          isMobile ? "text-xs" : "text-sm",
          "font-medium",
          !isActive &&
            cn(
              "text-muted-foreground transition-colors duration-200",
              "group-hover:text-primary"
            )
        )}
      >
        {item.name}
      </span>
    </Link>
  );
};

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    dragFree: true,
  });

  useEffect(() => {
    if (emblaApi) {
      const normalizedPathname = pathname.endsWith("/")
        ? pathname.slice(0, -1)
        : pathname;

      // Use the same fixed logic for finding active index
      const activeIndex = navigation.findIndex(
        (item) =>
          (item.href === "/account" && normalizedPathname === "/account") ||
          (item.href !== "/account" && normalizedPathname.startsWith(item.href))
      );

      if (activeIndex !== -1) {
        // Add a small delay to ensure carousel is ready
        setTimeout(() => {
          emblaApi.scrollTo(activeIndex, true);
        }, 100);
      }
    }
  }, [emblaApi, pathname]);

  // Redirect to login if not authenticated
  if (status === "unauthenticated") {
    redirect("/login");
  }

  // Show centered loading state while checking authentication
  if (status === "loading") {
    return (
      <div className="min-h-[calc(100vh-260px)] flex items-center justify-center">
        <Loader2 className="h-10 w-10 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="container max-w-screen-xl mx-auto px-4 py-8">
        {/* Mobile Navigation Slider */}
        <div className="lg:hidden mb-6">
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex">
              {navigation.map((item) => (
                <div
                  key={item.name}
                  className="flex-[0_0_28%] min-w-0 pl-4 first:pl-0"
                >
                  <NavLink
                    item={item}
                    className="whitespace-nowrap"
                    isMobile={true}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block lg:col-span-3">
            <Card className="sticky top-8 p-4 bg-white">
              <div className="flex items-center gap-3 px-2 mb-6">
                <Avatar className="h-10 w-10">
                  {session?.user?.image ? (
                    <AvatarImage
                      src={session.user.image}
                      alt={`${session.user.firstName} ${session.user.lastName}`}
                      width={40}
                      height={40}
                    />
                  ) : (
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {getInitials(
                        session?.user?.firstName,
                        session?.user?.lastName
                      )}
                    </AvatarFallback>
                  )}
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">
                    {session?.user.firstName} {session?.user.lastName}
                  </p>
                  <p className="text-sm text-muted-foreground truncate">
                    {session?.user?.email}
                  </p>
                </div>
              </div>

              <Separator className="mb-4" />

              <nav className="space-y-1">
                {navigation.map((item) => (
                  <NavLink key={item.name} item={item} isMobile={false} />
                ))}
                <LogoutDialog />
              </nav>
            </Card>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-9">{children}</main>
        </div>
      </div>
    </div>
  );
}
