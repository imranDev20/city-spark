import React from "react";
import ProductCarousel from "./product-carousel";
import { getLatestInventoryItems } from "../actions";

export default async function ProductCarouselContainer({
  title,
}: {
  title: string;
}) {
  const inventoryItems = await getLatestInventoryItems(20);

  return <ProductCarousel title={title} inventoryItems={inventoryItems} />;
}
