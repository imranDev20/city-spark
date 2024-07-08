import { cartData } from "@/app/data";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { CircleMinus, CirclePlus, ShoppingCartIcon, X } from "lucide-react";
import Link from "next/link";

export default function CartDrawer() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          className="py-6 items-center ml-3 hover:bg-primary/10"
        >
          <ShoppingCartIcon className="text-primary" />
          <div className="flex flex-col items-start ml-2">
            <p className="text-xs text-neutral-500 ">Basket</p>
            <p className="text-sm">{cartData.length} items</p>
          </div>
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Items</SheetTitle>
          <Separator />
        </SheetHeader>
        <div className="grid gap-4 py-4">
          {cartData.map((data) => {
            return (
              <>
                <div className="grid grid-cols-[5%_35%_55%_5%] gap-1">
                  <div className="flex flex-col justify-center">
                    <button type="button">
                      <CirclePlus className="text-primary" />
                    </button>
                    <span className="ms-2">1</span>
                    <button type="button">
                      <CircleMinus className="text-primary" />
                    </button>
                  </div>
                  <div className="ms-4">
                    <img
                      src={data?.src}
                      alt={data?.name}
                      className="w-full h-20 "
                    />
                  </div>
                  <div className="flex flex-col ms-2 gap-1">
                    <p className="font-bold">{data?.name}</p>
                    <small>
                      <span className="text-secondary">${data?.price}</span> X{" "}
                      <span>1</span>
                    </small>
                    <p className="text-secondary font-bold">${data?.price}</p>
                  </div>
                  <div className="flex  justify-end items-center">
                    <X />
                  </div>
                </div>
                <Separator />
              </>
            );
          })}
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <Link className="flex content-center" href="/cart">
              {" "}
              <Button type="button">View Cart</Button>
            </Link>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
