"use client";
import { usePathname } from "next/navigation";
import BoilerIcon from "@/components/icons/boiler";
import RadiatorIcon from "@/components/icons/radiator";
import HeatingIcon from "@/components/icons/heating";
import PlumbingIcon from "@/components/icons/plumbing";
import BathroomIcon from "@/components/icons/bathroom";
import KitchenTilesIcon from "@/components/icons/kitchen-tiles";
import SparesIcon from "@/components/icons/spares";
import RenewablesIcon from "@/components/icons/renewables";
import ToolsIcon from "@/components/icons/tools";
import ElectricalIcon from "@/components/icons/electrical";
import Link from "next/link";

export const categoryData = [
  {
    label: "Boilers",
    Icon: BoilerIcon,
    route: "/boilers",
  },
  {
    label: "Radiators",
    Icon: RadiatorIcon,
    route: "/categories/radiators",
  },
  {
    label: "Heating",
    Icon: HeatingIcon,
    route: "/categories/heating",
  },
  {
    label: "Plumbing",
    Icon: PlumbingIcon,
    route: "/categories/plumbing",
  },
  {
    label: "Bathrooms",
    Icon: BathroomIcon,
    route: "/categories/bathrooms",
  },
  {
    label: "Kitchen & Tiles",
    Icon: KitchenTilesIcon,
    route: "/categories/kitchen-tiles",
  },
  {
    label: "Spares",
    Icon: SparesIcon,
    route: "/categories/spares",
  },
  {
    label: "Renewables",
    Icon: RenewablesIcon,
    route: "/categories/renewables",
  },
  {
    label: "Tools",
    Icon: ToolsIcon,
    route: "/categories/tools",
  },
  {
    label: "Electrical",
    Icon: ElectricalIcon,
    route: "/categories/electrical",
  },
];

export default function CategoryNavComponent() {
  const pathname = usePathname();
  const excludedRoutes = ["/login", "/register", "/cart", "/checkout"];

  if (excludedRoutes.includes(pathname)) {
    return null;
  }

  return (
    <div className="container mx-auto max-w-screen-xl flex justify-between items-center py-2">
      {categoryData.map((item) => (
        <Link
          href="/products"
          key={item.label}
          className="flex-1 flex flex-col justify-center items-center py-2 cursor-pointer group rounded-md transition-all"
        >
          <item.Icon
            className="group-hover:fill-primary transition-all"
            height={32}
            width={32}
          />
          <h5 className="text-sm mt-1">{item.label}</h5>
        </Link>
      ))}
    </div>
  );
}
