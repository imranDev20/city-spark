import {
  Users,
  LayoutGrid,
  Package2,
  Network,
  ShoppingCart,
  Award,
  Blocks,
  PackagePlus,
  Settings,
  Bell,
  LifeBuoy,
  Ticket,
} from "lucide-react";

type Submenu = {
  href: string;
  label: string;
  active: boolean;
};

type Menu = {
  href: string;
  label: string;
  active?: boolean;
  icon: any;
  submenus: Submenu[];
};

type Group = {
  groupLabel: string;
  menus: Menu[];
};

export function getMenuList(pathname: string): Group[] {
  return [
    {
      groupLabel: "General",
      menus: [
        {
          href: "/dashboard",
          label: "Dashboard",
          active: pathname === "/admin" || pathname.includes("/dashboard"),
          icon: LayoutGrid,
          submenus: [],
        },
        {
          href: "/notifications",
          label: "Notifications",
          active: pathname.includes("/notifications"),
          icon: Bell,
          submenus: [],
        },
      ],
    },
    {
      groupLabel: "Orders & Inventory",
      menus: [
        {
          href: "/orders",
          label: "Orders",
          active: pathname.includes("/orders"),
          icon: ShoppingCart,
          submenus: [],
        },
        {
          href: "/inventory",
          label: "Inventory",
          active: pathname.includes("/inventory"),
          icon: PackagePlus,
          submenus: [],
        },
      ],
    },
    {
      groupLabel: "Catalog Management",
      menus: [
        {
          href: "/products",
          label: "Products",
          active: pathname.includes("/products"),
          icon: Package2,
          submenus: [],
        },
        {
          href: "/categories",
          label: "Categories",
          active: pathname.includes("/categories"),
          icon: Network,
          submenus: [],
        },
        {
          href: "/brands",
          label: "Brands",
          active: pathname.includes("/brands"),
          icon: Award,
          submenus: [],
        },
        {
          href: "/templates",
          label: "Templates",
          active: pathname.includes("/templates"),
          icon: Blocks,
          submenus: [],
        },
      ],
    },
    {
      groupLabel: "Marketing & Sales",
      menus: [
        {
          href: "/promocodes",
          label: "Promo Codes",
          active: pathname.includes("/promocodes"),
          icon: Ticket,
          submenus: [],
        },
        {
          href: "/users",
          label: "Users",
          active: pathname.includes("/users"),
          icon: Users,
          submenus: [],
        },
        {
          href: "/support-tickets",
          label: "Support Tickets",
          active: pathname.includes("/support-tickets"),
          icon: LifeBuoy,
          submenus: [],
        },
      ],
    },
    {
      groupLabel: "Configuration",
      menus: [
        {
          href: "/settings",
          label: "Settings",
          active: pathname.includes("/settings"),
          icon: Settings,
          submenus: [],
        },
      ],
    },
  ];
}
