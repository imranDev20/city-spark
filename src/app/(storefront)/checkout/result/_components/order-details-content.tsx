import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  FaTruck,
  FaStore,
  FaShoppingBag,
  FaArrowRight,
  FaExternalLinkAlt,
} from "react-icons/fa";
import prisma from "@/lib/prisma";
import { format } from "date-fns";
import PriceFormatter from "./price-formatter";

async function getOrderById(orderId: string) {
  try {
    const order = await prisma.order.findUnique({
      where: {
        id: orderId,
      },
      include: {
        user: {
          select: {
            email: true,
            firstName: true,
            lastName: true,
          },
        },
        orderItems: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!order) {
      return null;
    }

    // Process delivery and collection items
    const deliveryItems = order.orderItems
      .filter((item) => item.type === "FOR_DELIVERY")
      .map((item) => ({
        name: item.product.name,
        quantity: item.quantity,
        price: item.price,
        totalPrice: item.totalPrice,
        totalPriceExVat: Number((item.totalPrice / 1.2).toFixed(2)), // Approximate VAT calculation
      }));

    const collectionItems = order.orderItems
      .filter((item) => item.type === "FOR_COLLECTION")
      .map((item) => ({
        name: item.product.name,
        quantity: item.quantity,
        price: item.price,
        totalPrice: item.totalPrice,
        totalPriceExVat: Number((item.totalPrice / 1.2).toFixed(2)), // Approximate VAT calculation
        collectionDate: format(
          new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // Placeholder: 3 days from now
          "MMMM d, yyyy"
        ),
      }));

    // Calculate delivery and collection totals
    const deliveryTotal = deliveryItems.reduce(
      (sum, item) => sum + item.totalPrice,
      0
    );
    const deliveryTotalExVat = Number(
      deliveryItems
        .reduce((sum, item) => sum + item.totalPriceExVat, 0)
        .toFixed(2)
    );
    const collectionTotal = collectionItems.reduce(
      (sum, item) => sum + item.totalPrice,
      0
    );
    const collectionTotalExVat = Number(
      collectionItems
        .reduce((sum, item) => sum + item.totalPriceExVat, 0)
        .toFixed(2)
    );

    // Calculate total and VAT
    const total = order.totalPrice;
    const totalExVat = Number((total / 1.2).toFixed(2));
    const vatAmount = Number((total - totalExVat).toFixed(2));

    // Format dates and other data
    const orderDate = format(new Date(order.createdAt), "MMMM d, yyyy");
    const estimatedDeliveryDate = format(
      new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // Placeholder: 5 days from now
      "MMMM d-d, yyyy"
    );

    return {
      id: order.id,
      orderNumber: order.orderNumber,
      date: orderDate,
      total,
      totalExVat,
      vatAmount,
      email: order.user?.email || "customer@example.com",
      paymentMethod: order.paymentMethod || "Credit Card",
      deliveryItems,
      collectionItems,
      deliveryTotal,
      deliveryTotalExVat,
      collectionTotal,
      collectionTotalExVat,
      shippingCost: order.shippingPrice || 0,
      deliveryAddress: order.shippingAddress || "Delivery address not provided",
      estimatedDeliveryDate,
    };
  } catch (error) {
    console.error("Error fetching order:", error);
    return null;
  }
}

export default async function OrderDetailsContent({
  orderId,
}: {
  orderId: string;
}) {
  const orderData = await getOrderById(orderId);

  if (!orderData) {
    return (
      <div className="text-center mb-14">
        <h1 className="text-3xl font-bold mb-4">Order Not Found</h1>
        <p className="text-gray-600 max-w-xl mx-auto text-lg">
          We couldn&apos;t find your order. Please check your order confirmation
          email or contact customer support.
        </p>
      </div>
    );
  }

  const hasDeliveryItems = orderData.deliveryItems?.length > 0;
  const hasCollectionItems = orderData.collectionItems?.length > 0;

  return (
    <>
      <div className="text-center mb-14">
        <h1 className="text-3xl font-bold mb-4">Your Order Is Confirmed!</h1>
        <p className="text-gray-600 max-w-xl mx-auto text-lg">
          Thank you for your purchase. We&apos;ll send order updates to your
          email at <span className="font-medium">{orderData.email}</span>.
        </p>
      </div>

      {/* Order Summary Card */}
      <Card className="bg-white overflow-hidden mb-10">
        <div className="bg-gray-50 px-8 py-5 border-b border-gray-200">
          <h2 className="font-semibold text-xl">Order Summary</h2>
        </div>

        <div className="p-8">
          <div className="grid grid-cols-1 gap-10">
            {/* Order Details Section */}
            <div>
              <h3 className="text-sm uppercase tracking-wider text-gray-500 mb-4 font-medium">
                Order Details
              </h3>
              <dl className="space-y-4 text-sm grid sm:grid-cols-2 gap-x-8">
                <div className="flex justify-between sm:block">
                  <dt className="text-gray-500 mb-1 sm:mb-1.5">Order Number</dt>
                  <dd className="font-medium sm:text-base">
                    {orderData.orderNumber}
                  </dd>
                </div>
                <div className="flex justify-between sm:block">
                  <dt className="text-gray-500 mb-1 sm:mb-1.5">Date Placed</dt>
                  <dd className="sm:text-base">{orderData.date}</dd>
                </div>
                <div className="flex justify-between sm:block">
                  <dt className="text-gray-500 mb-1 sm:mb-1.5">Total</dt>
                  <dd className="font-medium sm:text-base">
                    <div className="flex flex-col">
                      <div className="flex items-baseline gap-1">
                        <PriceFormatter value={orderData.total} />
                        <span className="text-xs text-gray-500">inc. VAT</span>
                      </div>
                    </div>
                  </dd>
                </div>
                <div className="flex justify-between sm:block">
                  <dt className="text-gray-500 mb-1 sm:mb-1.5">
                    Payment Method
                  </dt>
                  <dd className="sm:text-base">{orderData.paymentMethod}</dd>
                </div>
              </dl>
            </div>

            <Separator />

            {/* Delivery Items Section */}
            {hasDeliveryItems && (
              <>
                <div>
                  <h3 className="text-sm uppercase tracking-wider text-gray-500 mb-5 flex items-center font-medium">
                    <FaTruck className="h-4 w-4 mr-2" />
                    Items for Delivery
                  </h3>

                  <ul className="space-y-5 mb-7">
                    {orderData.deliveryItems.map((item, i) => (
                      <li
                        key={i}
                        className="flex justify-between items-center pb-2 border-b border-gray-50"
                      >
                        <div>
                          <p className="font-medium mb-1">{item.name}</p>
                          <p className="text-sm text-gray-500">
                            Quantity: {item.quantity}
                          </p>
                        </div>

                        <div className="text-right">
                          <div className="font-medium text-lg">
                            <PriceFormatter value={item.totalPrice} />
                          </div>
                          <div className="text-xs text-gray-500">
                            <PriceFormatter value={item.totalPriceExVat} />
                            <span className="ml-1">exc. VAT</span>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>

                  {/* Delivery Total */}
                  <div className="mb-5 flex flex-col items-end space-y-1">
                    <div className="flex justify-end items-baseline gap-3">
                      <p className="font-normal text-gray-500 text-sm">
                        Delivery Subtotal
                      </p>
                      <div className="text-right flex items-baseline">
                        <div className="font-medium text-xl leading-none">
                          <PriceFormatter value={orderData.deliveryTotal} />
                        </div>
                        <span className="text-xs text-gray-500 ml-1 leading-none">
                          inc. VAT
                        </span>
                      </div>
                    </div>

                    <div className="text-xs text-gray-500">
                      <PriceFormatter value={orderData.deliveryTotalExVat} />
                      <span className="ml-1">exc. VAT</span>
                    </div>
                  </div>

                  {/* Delivery Information */}
                  <div className="bg-gray-50 p-5 rounded-lg text-sm border">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <p className="text-gray-500 mb-1.5 font-medium">
                          Delivery Address:
                        </p>
                        <p className="leading-relaxed">
                          {orderData.deliveryAddress}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500 mb-1.5 font-medium">
                          Estimated Delivery:
                        </p>
                        <p className="font-medium text-emerald-700">
                          {orderData.estimatedDeliveryDate}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                {hasCollectionItems && <Separator />}
              </>
            )}

            {/* Collection Items Section */}
            {hasCollectionItems && (
              <>
                <div>
                  <h3 className="text-sm uppercase tracking-wider text-gray-500 mb-5 flex items-center font-medium">
                    <FaStore className="h-4 w-4 mr-2" />
                    Items for Collection
                  </h3>
                  <ul className="space-y-5 mb-7">
                    {orderData.collectionItems.map((item, i) => (
                      <li
                        key={i}
                        className="border-b border-gray-50 pb-5 last:border-0 last:pb-0"
                      >
                        <div className="flex justify-between mb-3 space-y-1">
                          <div>
                            <p className="font-medium">{item.name}</p>
                            <p className="text-sm text-gray-500">
                              Quantity: {item.quantity}
                            </p>
                            <p className="text-sm">
                              <span className="text-gray-500">
                                Collection Date:
                              </span>{" "}
                              <span className="font-medium text-emerald-700">
                                {item.collectionDate}
                              </span>
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="font-medium text-lg">
                              <PriceFormatter value={item.totalPrice} />
                            </div>
                            <div className="text-xs text-gray-500">
                              <PriceFormatter value={item.totalPriceExVat} />
                              <span className="ml-1">exc. VAT</span>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>

                  {/* Collection Total */}
                  <div className="mb-5 flex flex-col items-end space-y-1">
                    <div className="flex justify-end items-baseline gap-3">
                      <p className="font-normal text-gray-500 text-sm">
                        Collection Subtotal
                      </p>
                      <div className="text-right flex items-baseline">
                        <div className="font-medium text-xl leading-none">
                          <PriceFormatter value={orderData.collectionTotal} />
                        </div>
                        <span className="text-xs text-gray-500 ml-1 leading-none">
                          inc. VAT
                        </span>
                      </div>
                    </div>

                    <div className="text-xs text-gray-500">
                      <PriceFormatter value={orderData.collectionTotalExVat} />
                      <span className="ml-1">exc. VAT</span>
                    </div>
                  </div>
                </div>
                <Separator />
              </>
            )}

            {/* Order Total Section */}
            <div>
              <h3 className="text-sm uppercase tracking-wider text-gray-500 mb-5 flex items-center font-medium">
                <FaShoppingBag className="h-4 w-4 mr-2" />
                Order Total
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <div className="text-gray-600 flex items-baseline gap-2">
                    <span>Subtotal</span>
                    <span className="text-xs">(exc. VAT)</span>
                  </div>
                  <PriceFormatter value={orderData.totalExVat} />
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">VAT</span>
                  <PriceFormatter value={orderData.vatAmount} />
                </div>

                {hasDeliveryItems && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Delivery</span>
                    <PriceFormatter value={orderData.shippingCost} />
                  </div>
                )}

                <Separator className="my-2" />

                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <div className="text-right">
                    <div>
                      <PriceFormatter value={orderData.total} />
                    </div>
                    <div className="text-sm font-normal text-gray-500">
                      <PriceFormatter value={orderData.totalExVat} />
                      <span className="ml-1 text-xs">exc. VAT</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 mb-14">
        <Link href="/account/orders" className="flex-1">
          <Button
            variant="outline"
            className="w-full h-12 border-gray-300 hover:bg-gray-50 hover:text-gray-900 text-base"
          >
            View Order Details
          </Button>
        </Link>
        <Link href="/" className="flex-1">
          <Button className="w-full h-12 group text-base">
            Continue Shopping
            <FaArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </Link>
      </div>

      {/* Assistance Section */}
      <div className="text-center border-t border-gray-100 pt-8">
        <p className="text-sm text-gray-500 mb-2">Need help with your order?</p>
        <Link
          href="/contact"
          className="text-sm font-medium text-primary hover:underline inline-flex items-center"
        >
          Contact Customer Support
          <FaExternalLinkAlt className="w-3 h-3 ml-1.5" />
        </Link>
      </div>
    </>
  );
}
