import { Flame, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import AccountDropdown from "./account-dropdown";
import SearchInput from "./search-input";
import { cn } from "@/lib/utils";

export default async function Header() {
  // const cart = await getCart();
  const cartItemCount = 0;

  return (
    <header className="w-full bg-primary py-2">
      <div className="container h-16 flex items-center justify-between mx-auto max-w-screen-xl">
        <Link
          href="/"
          className="flex items-center transition-opacity duration-300"
        >
          <Flame className="w-9 h-9 mr-1 text-primary text-yellow-300" />
          <span className="font-extrabold text-nowrap text-yellow-300 text-2xl">
            City Spark
          </span>
          <span className="sr-only">City Spark</span>
        </Link>

        <SearchInput />

        <div className="flex items-center space-x-5 text-white">
          <AccountDropdown />
          <Separator orientation="vertical" className="h-6 w-px bg-white" />
          <Link
            href="/basket"
            className="flex items-center group cursor-pointer"
          >
            <div className="relative">
              <ShoppingCart className="w-5 h-5 group-hover:text-yellow-300 transition-colors duration-200" />
              {cartItemCount > 0 && (
                <span
                  className={cn(
                    "absolute -top-2 -right-2 bg-yellow-300 text-secondary text-xs font-bold rounded-full flex items-center justify-center",
                    cartItemCount > 9 ? "w-5 h-5 text-[10px]" : "w-4 h-4"
                  )}
                >
                  {cartItemCount}
                </span>
              )}
            </div>
            <span className="ml-2 text-base group-hover:text-yellow-300 transition-colors duration-200">
              Basket
            </span>
          </Link>
        </div>
      </div>
    </header>
  );
}
