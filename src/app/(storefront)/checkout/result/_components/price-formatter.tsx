"use client";

import { NumericFormat } from "react-number-format";

interface PriceFormatterProps {
  value: number;
  displayType?: "text" | "input";
  prefix?: string;
  suffix?: string;
  thousandSeparator?: boolean;
  decimalScale?: number;
  fixedDecimalScale?: boolean;
  className?: string;
}

export default function PriceFormatter({
  value,
  displayType = "text",
  prefix = "£",
  suffix,
  thousandSeparator = true,
  decimalScale = 2,
  fixedDecimalScale = true,
  className,
}: PriceFormatterProps) {
  return (
    <NumericFormat
      value={value}
      displayType={displayType}
      prefix={prefix}
      suffix={suffix}
      thousandSeparator={thousandSeparator}
      decimalScale={decimalScale}
      fixedDecimalScale={fixedDecimalScale}
      className={className}
    />
  );
}
