import {
  Users,
  LayoutGrid,
  Package2,
  Network,
  ShoppingCart,
  Award,
  Blocks,
} from "lucide-react";

type Submenu = {
  href: string;
  label: string;
  active: boolean;
};

type Menu = {
  href: string;
  label: string;
  active: boolean;
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
      groupLabel: "",
      menus: [
        {
          href: "/dashboard",
          label: "Dashboard",
          active: pathname === "/admin" || pathname.includes("/dashboard"),
          icon: LayoutGrid,
          submenus: [],
        },
      ],
    },
    {
      groupLabel: "Products",
      menus: [
        {
          href: "",
          label: "Products",
          active: pathname.includes("/products"),
          icon: Package2,
          submenus: [
            {
              href: "/products",
              label: "All Products",
              active: pathname === "/products",
            },
            {
              href: "/products/new",
              label: "Create Product",
              active: pathname === "/products/new",
            },
          ],
        },
        {
          href: "",
          label: "Templates",
          active: pathname.includes("/templates"),
          icon: Blocks,
          submenus: [
            {
              href: "/templates",
              label: "All Templates",
              active: pathname === "/templates",
            },
            {
              href: "/templates/new",
              label: "Create Template",
              active: pathname === "/templates/new",
            },
          ],
        },
        {
          href: "",
          label: "Brands",
          active: pathname.includes("/brands"),
          icon: Award,
          submenus: [
            {
              href: "/brands",
              label: "All Brands",
              active: pathname === "/brands",
            },
            {
              href: "/brands/new",
              label: "Create Brand",
              active: pathname === "/brands/new",
            },
          ],
        },
        {
          href: "/categories",
          label: "Categories",
          active: pathname.includes("/categories"),
          icon: Network,
          submenus: [
            {
              href: "/categories",
              label: "All Categories",
              active: pathname === "/categories",
            },
            {
              href: "/categories/new",
              label: "Create Category",
              active: pathname === "/categories/new",
            },
          ],
        },
      ],
    },
    {
      groupLabel: "Sales",
      menus: [
        {
          href: "/users",
          label: "Orders",
          active: pathname.includes("/users"),
          icon: ShoppingCart,
          submenus: [
            {
              href: "/posts",
              label: "All Users",
              active: pathname === "/posts",
            },
            {
              href: "/posts",
              label: "All Users",
              active: pathname === "/posts",
            },
          ],
        },
        {
          href: "/users",
          label: "Users",
          active: pathname.includes("/users"),
          icon: Users,
          submenus: [
            {
              href: "/posts",
              label: "All Users",
              active: pathname === "/posts",
            },
            {
              href: "/posts",
              label: "All Users",
              active: pathname === "/posts",
            },
          ],
        },
      ],
    },

    {
      groupLabel: "Others",
      menus: [
        {
          href: "/users",
          label: "Settings",
          active: pathname.includes("/users"),
          icon: Users,
          submenus: [],
        },
      ],
    },
  ];
}
