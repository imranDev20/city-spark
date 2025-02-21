import { Suspense } from "react";
import CheckoutHeader from "../_components/checkout-header";
import DesktopStepper from "../_components/desktop-stepper";
import OrderDetailsContent from "./_components/order-details-content";
import OrderDetailsSkeleton from "./_components/order-details-skeleton";

export default async function CheckoutResultPage({
  searchParams,
}: {
  searchParams: Promise<{ order_id?: string }>;
}) {
  const resolvedParams = await searchParams;
  const orderId = resolvedParams.order_id;

  if (!orderId) {
    return (
      <div className="min-h-screen">
        <CheckoutHeader />
        <main className="max-w-4xl mx-auto px-4 py-10 lg:py-16">
          <DesktopStepper currentStep={4} steps={4} />

          <div className="text-center mb-14">
            <h1 className="text-3xl font-bold mb-4">Order Not Found</h1>
            <p className="text-gray-600 max-w-xl mx-auto text-lg">
              We couldn't find your order. Please check your order confirmation
              email or contact customer support.
            </p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <CheckoutHeader />
      <main className="max-w-4xl mx-auto px-4 py-10 lg:py-16">
        <DesktopStepper currentStep={4} steps={4} />
        <Suspense fallback={<OrderDetailsSkeleton />}>
          <OrderDetailsContent orderId={orderId} />
        </Suspense>
      </main>
    </div>
  );
}
