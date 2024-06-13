import { Button } from "@/components/ui/button";
import { Flame, ShoppingCartIcon } from "lucide-react";
import Link from "next/link";
import ChangePostcodeDialog from "./change-postcode-dialog";
import SearchInput from "./search-input";
import AuthDialog from "./auth-dialog";

export default function MiddleHeader() {
  return (
    <div className="container h-16 flex items-center">
      <Link
        href="/"
        className="flex justify-start items-center hover:opacity-85 transition-opacity duration-300"
      >
        <Flame className="w-6 h-6 mr-1" />
        <span className="font-bold text-nowrap">City Spark</span>
        <span className="sr-only">City Spark</span>
      </Link>

      <ChangePostcodeDialog />

      <SearchInput />

      <AuthDialog />

      <Button variant="ghost" className="py-6 items-center ml-3 ">
        <ShoppingCartIcon />
        <div className="flex flex-col items-start ml-2">
          <p className="text-xs text-neutral-500 font-light">Basket</p>
          <p className="text-sm">0 items</p>
        </div>
      </Button>
    </div>
  );
}
