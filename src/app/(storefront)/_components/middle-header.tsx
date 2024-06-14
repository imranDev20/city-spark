import { Flame, ShoppingCartIcon } from "lucide-react";
import Link from "next/link";
import ChangePostcodeDialog from "./change-postcode-dialog";
import SearchInput from "./search-input";
import AuthDialog from "./auth-dialog";
import CartDrawer from "./cart-drawer";

export default function MiddleHeader() {
  return (
    <div className="container h-16 flex items-center">
      <Link
        href="/"
        className="flex justify-start items-center hover:opacity-85 transition-opacity duration-300"
      >
        <Flame className="w-6 h-6 mr-1 text-primary" />
        <span className="font-bold text-nowrap">City Spark</span>
        <span className="sr-only">City Spark</span>
      </Link>

      <ChangePostcodeDialog />

      <SearchInput />

      <AuthDialog />

      <CartDrawer />
    </div>
  );
}
