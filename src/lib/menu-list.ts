import {
  Tag,
  Users,
  Settings,
  Bookmark,
  SquarePen,
  LayoutGrid,
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
          active: pathname.includes("/dashboard"),
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
          active: pathname.includes("/posts"),
          icon: SquarePen,
          submenus: [
            {
              href: "/posts",
              label: "All Products",
              active: pathname === "/posts",
            },
            {
              href: "/posts/new",
              label: "Create Product",
              active: pathname === "/posts/new",
            },
          ],
        },
        {
          href: "",
          label: "Brands",
          active: pathname.includes("/brands"),
          icon: SquarePen,
          submenus: [
            {
              href: "/posts",
              label: "All Brands",
              active: pathname === "/posts",
            },
            {
              href: "/posts/new",
              label: "Create Brand",
              active: pathname === "/posts/new",
            },
          ],
        },
        {
          href: "/categories",
          label: "Categories",
          active: pathname.includes("/categories"),
          icon: Bookmark,
          submenus: [
            {
              href: "/posts",
              label: "All Brands",
              active: pathname === "/posts",
            },
            {
              href: "/posts/new",
              label: "Create Brand",
              active: pathname === "/posts/new",
            },
          ],
        },
        {
          href: "/tags",
          label: "Tags",
          active: pathname.includes("/tags"),
          icon: Tag,
          submenus: [],
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
      groupLabel: "Analytics",
      menus: [
        {
          href: "/users",
          label: "Sales Report",
          active: pathname.includes("/users"),
          icon: Users,
          submenus: [],
        },
        {
          href: "/users",
          label: "Customer Report",
          active: pathname.includes("/users"),
          icon: Users,
          submenus: [],
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
