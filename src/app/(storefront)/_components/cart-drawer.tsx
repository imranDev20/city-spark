"use client";
import { ScrollArea } from "@/components/ui/scroll-area";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import img from "@/images/placeholder-image.jpg";

import { useCart } from "@/contexts/cart-context";
import { CircleMinus, CirclePlus, ShoppingCartIcon, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function CartDrawer() {
  const {
    collectionCart,
    deliveryCart,
    increaseCollectionQuantity,
    decreaseCollectionQuantity,
    increaseDeliveryQuantity,
    decreaseDeliveryQuantity,
  } = useCart();
  // console.log(cart);
  const totalProduct = collectionCart.length + deliveryCart.length;
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
            <p className="text-sm">{totalProduct} items</p>
          </div>
        </Button>
      </SheetTrigger>

      <SheetContent className="flex-col ">
        <ScrollArea className="h-[50%]">
          <SheetHeader>
            <SheetTitle>Items for Collection</SheetTitle>
            <Separator />
          </SheetHeader>
          <div className="grid gap-4 py-4">
            {collectionCart.map((product) => {
              return (
                <>
                  <div className="grid grid-cols-[5%_35%_50%_10%] gap-1">
                    <div className="flex flex-col justify-center">
                      <button
                        disabled={product.quantity >= product.stock}
                        type="button"
                      >
                        <CirclePlus
                          onClick={() => increaseCollectionQuantity(product.id)}
                          className={`${
                            product.quantity >= product.stock
                              ? "text-gray-400"
                              : "text-primary"
                          }`}
                        />
                      </button>
                      <span className="ms-2">{product?.quantity}</span>
                      <button type="button">
                        <CircleMinus
                          onClick={() => decreaseCollectionQuantity(product.id)}
                          className={`${
                            product.quantity === 1
                              ? "text-gray-400"
                              : "text-primary"
                          }`}
                        />
                      </button>
                    </div>
                    <div className="ms-4">
                      <Image
                        src={img}
                        alt="cartImage"
                        className="w-full h-20"
                      />
                    </div>
                    <div className="flex flex-col ms-2 gap-1">
                      <p className="font-bold line-clamp-2">{product?.name}</p>
                      <small>
                        <span className="text-secondary">
                          ${product?.price}
                        </span>{" "}
                        X <span>1</span>
                      </small>
                      <p className="text-secondary font-bold">
                        ${product?.price}
                      </p>
                    </div>
                    <div className="flex  items-center ">
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
        </ScrollArea>

        <ScrollArea className="h-[50%]">
          <SheetHeader>
            <SheetTitle>Items for Delivery</SheetTitle>
            <Separator />
          </SheetHeader>
          {deliveryCart.length === 0 ? (
            <p className="font-bold flex  justify-center items-center">
              Your Delivery cart is empty
            </p>
          ) : (
            <div className="grid gap-4 py-4">
              {deliveryCart.map((product) => {
                return (
                  <>
                    <div className="grid grid-cols-[5%_35%_50%_10%] gap-1">
                      <div className="flex flex-col justify-center">
                        <button
                          disabled={product.quantity >= product.stock}
                          type="button"
                        >
                          <CirclePlus
                            onClick={() => increaseDeliveryQuantity(product.id)}
                            className={`${
                              product.quantity >= product.stock
                                ? "text-gray-400"
                                : "text-primary"
                            }`}
                          />
                        </button>
                        <span className="ms-2">{product?.quantity}</span>
                        <button type="button">
                          <CircleMinus
                            onClick={() => decreaseDeliveryQuantity(product.id)}
                            className={`${
                              product.quantity === 1
                                ? "text-gray-400"
                                : "text-primary"
                            }`}
                          />
                        </button>
                      </div>
                      <div className="ms-4">
                        <Image
                          src={img}
                          alt="cartImage"
                          className="w-full h-20"
                        />
                      </div>
                      <div className="flex flex-col ms-2 gap-1">
                        <p className="font-bold line-clamp-2">
                          {product?.name}
                        </p>
                        <small>
                          <span className="text-secondary">
                            ${product?.price}
                          </span>{" "}
                          X <span>1</span>
                        </small>
                        <p className="text-secondary font-bold">
                          ${product?.price}
                        </p>
                      </div>
                      <div className="flex items-center">
                        <X />
                      </div>
                    </div>
                    <Separator />
                  </>
                );
              })}
            </div>
          )}
          <SheetFooter>
            <SheetClose asChild>
              <Link className="flex content-center" href="/cart">
                {" "}
                <Button type="button">View Cart</Button>
              </Link>
            </SheetClose>
          </SheetFooter>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
