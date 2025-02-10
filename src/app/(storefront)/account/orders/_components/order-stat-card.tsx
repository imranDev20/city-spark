import { Card, CardContent } from "@/components/ui/card";
import { NumericFormat } from "react-number-format";

interface OrderStatCardProps {
  label: string;
  value: number;
  isCurrency?: boolean;
  isLoading?: boolean;
}

export function OrderStatCard({
  label,
  value,
  isCurrency,
  isLoading,
}: OrderStatCardProps) {
  return (
    <Card className="bg-white">
      <CardContent className="p-6">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        {isLoading ? (
          <div className="h-8 w-24 bg-gray-200 animate-pulse rounded mt-2" />
        ) : (
          <p className="text-2xl font-bold mt-2">
            {isCurrency ? (
              <NumericFormat
                value={value}
                displayType="text"
                prefix="£"
                thousandSeparator
                decimalScale={2}
                fixedDecimalScale
              />
            ) : (
              <NumericFormat
                value={value}
                displayType="text"
                thousandSeparator
              />
            )}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
