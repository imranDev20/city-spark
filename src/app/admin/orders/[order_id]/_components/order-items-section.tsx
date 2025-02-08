import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FulFillmentType, Prisma } from "@prisma/client";
import { Clock, MapPin } from "lucide-react";
import Image from "next/image";
import PlaceholderImage from "@/images/placeholder-image.png";

type OrderItemWithRelations = Prisma.OrderItemGetPayload<{
  include: {
    product: true;
  };
}>;

interface OrderItemsSectionProps {
  items: OrderItemWithRelations[];
  title: string;
  deliveryAddress?: string | null;
  type: FulFillmentType;
}

export default function OrderItemsSection({
  items,
  title,
  deliveryAddress,
  type,
}: OrderItemsSectionProps) {
  if (items.length === 0) return null;

  const calculateSubtotal = (items: OrderItemWithRelations[]) => {
    return items.reduce((sum, item) => {
      const price = item.price || 0;
      const quantity = item.quantity || 0;
      return sum + price * quantity;
    }, 0);
  };

  const subtotal = calculateSubtotal(items);
  const vatAmount = subtotal * 0.2;
  const total = subtotal + vatAmount;

  return (
    <Card className="overflow-hidden bg-white">
      <CardHeader>
        <div className="flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">{title}</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                {items.length} {items.length === 1 ? "item" : "items"}
              </p>
            </div>

            {type === FulFillmentType.FOR_DELIVERY && deliveryAddress && (
              <div className="text-sm text-right">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-end gap-2">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <span className="text-gray-600">Delivery to:</span>
                    <span className="font-medium">{deliveryAddress}</span>
                  </div>
                  <div className="flex items-center justify-end gap-2">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <span className="text-gray-600">Expected delivery:</span>
                    <span className="font-medium">{"2-3 working days"}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg"
            >
              <div className="relative h-20 w-20 rounded-lg overflow-hidden bg-white flex-shrink-0 border border-border">
                <Image
                  src={item.product.images[0] || PlaceholderImage}
                  alt={item.product.name}
                  fill
                  className="object-contain"
                  sizes="80px"
                />
              </div>

              <div className="flex-1 min-w-0">
                <h4 className="font-medium leading-tight line-clamp-2">
                  {item.product.name}
                </h4>
                <p className="text-sm text-gray-500 mt-1">
                  Quantity: {item.quantity || 0}
                </p>
              </div>

              <div className="text-right flex-shrink-0">
                <div className="flex items-baseline gap-1 justify-end">
                  <span className="text-lg font-semibold">
                    £{((item.price || 0) * (item.quantity || 0)).toFixed(2)}
                  </span>
                  <span className="text-xs text-gray-500">inc. VAT</span>
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  {item.quantity} x £{(item.price || 0).toFixed(2)}
                </div>
              </div>
            </div>
          ))}

          <div className="border-t pt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Subtotal (exc. VAT)</span>
              <span>£{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">VAT (20%)</span>
              <span>£{vatAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-medium pt-2 border-t">
              <span>Total (inc. VAT)</span>
              <span>£{total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
