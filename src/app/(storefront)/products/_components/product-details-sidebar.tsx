"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Heart, Loader2, StarIcon } from "lucide-react";
import {
  FaMapMarkerAlt,
  FaPencilAlt,
  FaStore,
  FaTruckMoving,
} from "react-icons/fa";
import { Prisma } from "@prisma/client";
import { useToast } from "@/components/ui/use-toast";
import { useTransition } from "react";
import {
  addToCart,
  toggleWishlistItem,
  checkWishlistStatus,
} from "@/app/(storefront)/products/actions";
import Image from "next/image";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import DeliveryDialog from "@/app/(storefront)/_components/delivery-dialog";
import { useDeliveryStore } from "@/hooks/use-delivery-store";
import { useQueryClient } from "@tanstack/react-query";

type InventoryItemWithRelation = Prisma.InventoryGetPayload<{
  include: {
    product: {
      include: {
        brand: true;
        primaryCategory: true;
        secondaryCategory: true;
        tertiaryCategory: true;
        quaternaryCategory: true;
        productTemplate: {
          include: {
            fields: {
              include: {
                templateField: true;
              };
            };
            template: true;
          };
        };
      };
    };
  };
}>;

interface LocationContentProps {
  postcode: string;
  setPostcode: (postcode: string) => void;
  setIsOpen: (isOpen: boolean) => void;
}

const LocationContent = ({
  postcode,
  setPostcode,
  setIsOpen,
}: LocationContentProps) => (
  <div className="p-4 space-y-4">
    <div className="space-y-2">
      <label htmlFor="postcode" className="font-medium text-sm">
        Postcode
      </label>
      <div className="flex gap-2">
        <Input
          id="postcode"
          placeholder="Enter postcode"
          value={postcode}
          onChange={(e) => setPostcode(e.target.value.toUpperCase())}
        />
        <Button onClick={() => setIsOpen(false)} disabled={!postcode}>
          Check
        </Button>
      </div>
    </div>
  </div>
);

export default function ProductDetailsSidebar({
  inventoryItem,
}: {
  inventoryItem: InventoryItemWithRelation;
}) {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [inputValue, setInputValue] = useState("1");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [openDeliveryDialog, setOpenDeliveryDialog] = useState<boolean>(false);
  const { postcode, setPostcode } = useDeliveryStore();
  const { product } = inventoryItem;
  const queryClient = useQueryClient();
  const [loadingType, setLoadingType] = useState<
    "FOR_DELIVERY" | "FOR_COLLECTION" | null
  >(null);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isWishlistLoading, setIsWishlistLoading] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Check if product is in user's wishlist on component mount
  useEffect(() => {
    const fetchWishlistStatus = async () => {
      try {
        const result = await checkWishlistStatus(inventoryItem.id);
        setIsWishlisted(result.isWishlisted);
      } catch (error) {
        console.error("Error checking wishlist status:", error);
      }
    };

    fetchWishlistStatus();
  }, [inventoryItem.id]);

  const handleQuantityChange = (newValue: number) => {
    setInputValue(Math.max(1, newValue).toString());
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleBlur = () => {
    const parsedValue = parseInt(inputValue) || 1;
    setInputValue(parsedValue.toString());
  };

  const handleDeliveryClick = () => {
    if (isMobile) {
      setIsDrawerOpen(true);
    } else {
      setOpenDeliveryDialog(true);
    }
  };

  const handleAddToCart = async (
    e: React.MouseEvent<HTMLButtonElement>,
    type: "FOR_DELIVERY" | "FOR_COLLECTION"
  ) => {
    e.preventDefault();
    const quantity = parseInt(inputValue);

    // Set loading type
    setLoadingType(type);

    startTransition(async () => {
      try {
        const result = await addToCart(inventoryItem.id, quantity, type);

        await queryClient.invalidateQueries({ queryKey: ["cart"] });

        if (result?.success) {
          toast({
            title: "Added to Cart",
            description: result.message,
            variant: "success",
          });
        } else {
          toast({
            title: "Error",
            description: result?.message,
            variant: "destructive",
          });
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "An unexpected error occurred",
          variant: "destructive",
        });
      } finally {
        setLoadingType(null);
        setInputValue("1");
      }
    });
  };

  const handleWishlistToggle = async () => {
    setIsWishlistLoading(true);
    try {
      const result = await toggleWishlistItem(inventoryItem.id);

      if (result.success) {
        setIsWishlisted(!!result.isWishlisted);

        toast({
          title: result.isWishlisted
            ? "Added to Wishlist"
            : "Removed from Wishlist",
          description: result.message,
          variant: "success",
        });
      } else {
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update wishlist",
        variant: "destructive",
      });
    } finally {
      setIsWishlistLoading(false);
    }
  };

  return (
    <>
      <Card className="hidden lg:block bg-white">
        <CardContent className="p-6">
          {product.brand?.image ? (
            <div className="mb-4">
              <div className="relative w-16 h-8">
                <Image
                  src={product.brand.image}
                  alt="Brand logo"
                  fill
                  className="object-contain"
                  sizes="64px"
                />
              </div>
            </div>
          ) : null}

          <h1 className="text-2xl font-semibold text-gray-900 mb-3 leading-tight">
            {product.name}
          </h1>

          <div className="flex items-center justify-between mb-7">
            <div className="flex items-center">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <StarIcon
                    key={i}
                    className="w-4 h-4 text-secondary fill-current"
                  />
                ))}
              </div>
              <span className="ml-2 text-sm text-gray-600">4.99</span>
            </div>
            <span className="text-sm text-gray-500">CP123456</span>
          </div>

          <div className="flex flex-col gap-1 mb-7">
            <div className="flex items-baseline justify-between">
              <div className="flex items-baseline gap-2">
                {product.promotionalPrice ? (
                  <>
                    <span className="text-4xl font-semibold tracking-tight">
                      £{product.promotionalPrice.toFixed(2)}
                    </span>
                    <div className="text-sm text-gray-500 font-medium">
                      inc. VAT
                    </div>
                    {product.retailPrice &&
                      product.retailPrice > product.promotionalPrice && (
                        <span className="text-xl text-gray-500 line-through">
                          £{product.retailPrice.toFixed(2)}
                        </span>
                      )}
                  </>
                ) : (
                  <>
                    <span className="text-4xl font-semibold tracking-tight">
                      £{(product.retailPrice || 0).toFixed(2)}
                    </span>
                    <div className="text-sm text-gray-500 font-medium">
                      inc. VAT
                    </div>
                  </>
                )}
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-medium text-gray-700">
                £
                {(
                  (product.promotionalPrice || product.retailPrice || 0) * 0.8
                ).toFixed(2)}
              </span>
              <div className="text-sm text-gray-500 font-medium">exc. VAT</div>
            </div>
          </div>

          <div className="flex gap-3 items-center mb-6">
            <div className="flex items-center bg-gray-100 rounded-md">
              <button
                onClick={() =>
                  handleQuantityChange(Math.max(1, parseInt(inputValue) - 1))
                }
                disabled={isPending || parseInt(inputValue) <= 1}
                className="w-10 h-12 flex items-center justify-center hover:bg-gray-200 rounded-l-md transition-colors"
                aria-label="Decrease quantity"
              >
                <span className="text-gray-600 font-medium">-</span>
              </button>
              <input
                type="number"
                value={inputValue}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className="w-16 text-center bg-transparent focus:outline-none py-2 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                disabled={isPending}
                aria-label="Quantity"
              />
              <button
                onClick={() => handleQuantityChange(parseInt(inputValue) + 1)}
                disabled={isPending}
                className="w-10 h-12 flex items-center justify-center hover:bg-gray-200 rounded-r-md transition-colors"
                aria-label="Increase quantity"
              >
                <span className="text-gray-600 font-medium">+</span>
              </button>
            </div>

            <div className="grid grid-cols-2 flex-1 gap-3">
              <Button
                variant="outline"
                onClick={(e) => handleAddToCart(e, "FOR_COLLECTION")}
                disabled={isPending || !inventoryItem.collectionEligibility}
                className="h-12 text-base shadow"
              >
                {loadingType === "FOR_COLLECTION" ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <FaStore className="w-4 h-4 mr-2" />
                )}
                {loadingType === "FOR_COLLECTION" ? "Adding..." : "Collection"}
              </Button>

              <Button
                onClick={(e) => handleAddToCart(e, "FOR_DELIVERY")}
                disabled={isPending || !inventoryItem.deliveryEligibility}
                className="h-12 text-base shadow"
              >
                {loadingType === "FOR_DELIVERY" ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <FaTruckMoving className="w-4 h-4 mr-2" />
                )}
                {loadingType === "FOR_DELIVERY" ? "Adding..." : "Delivery"}
              </Button>
            </div>
          </div>

          <Separator className="mb-6" />

          <div>
            <h3 className="font-semibold text-sm mb-3">Ways to get it</h3>
            <div className="space-y-2">
              <button
                className="w-full flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors justify-between"
                onClick={handleDeliveryClick}
              >
                <div className="flex items-center gap-3">
                  <FaTruckMoving className="h-5 w-5 text-primary" />
                  <div className="flex-1 text-left">
                    <h4 className="font-medium text-sm">
                      {postcode
                        ? `Delivery to ${postcode}`
                        : "Add delivery postcode"}
                    </h4>
                    <p className="text-xs text-gray-600">
                      {postcode
                        ? "Next day delivery available"
                        : "Check delivery availability"}
                    </p>
                  </div>
                </div>
                {postcode ? (
                  <FaPencilAlt className="h-4 w-4 text-gray-400" />
                ) : (
                  <FaMapMarkerAlt className="h-4 w-4 text-gray-400" />
                )}
              </button>

              <div className="w-full flex items-center gap-3 p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <FaStore className="h-5 w-5 text-secondary" />
                  <div className="flex-1 text-left">
                    <h4 className="font-medium text-sm">
                      Collection from store
                    </h4>
                    <p className="text-xs text-gray-600">
                      123 High Street, London SW1A 1AA
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Separator className="my-6" />

          <div>
            <h3 className="font-semibold text-sm mb-3">Add to wish list...</h3>
            <Button
              variant="outline"
              className={`w-full h-12 text-base ${
                isWishlisted ? "bg-gray-100" : ""
              }`}
              onClick={handleWishlistToggle}
              disabled={isWishlistLoading}
            >
              {isWishlistLoading ? (
                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
              ) : (
                <Heart
                  className={`h-5 w-5 mr-2 ${
                    isWishlisted ? "fill-current text-primary" : ""
                  }`}
                />
              )}

              {isWishlisted ? "Saved" : "Save"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Mobile Drawer */}
      {isMobile ? (
        <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
          <DrawerContent>
            <DrawerHeader className="border-b">
              <DrawerTitle>Enter Your Postcode</DrawerTitle>
            </DrawerHeader>
            <LocationContent
              postcode={postcode}
              setPostcode={setPostcode}
              setIsOpen={setIsDrawerOpen}
            />
          </DrawerContent>
        </Drawer>
      ) : (
        <DeliveryDialog
          open={openDeliveryDialog}
          setOpen={setOpenDeliveryDialog}
        />
      )}
    </>
  );
}
