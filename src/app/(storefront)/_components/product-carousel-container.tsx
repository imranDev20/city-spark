import React from "react";
import ProductCarousel from "./product-carousel";
import { getLatestInventoryItems } from "../actions";
import { delay } from "@/lib/server-utils";

export default async function ProductCarouselContainer({
  title,
}: {
  title: string;
}) {
  const inventoryItems = await getLatestInventoryItems(10);

  await delay(20000);

  return <ProductCarousel title={title} inventoryItems={inventoryItems} />;
}
