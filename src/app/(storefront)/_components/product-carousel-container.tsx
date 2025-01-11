import React from "react";
import ProductCarousel from "./product-carousel";
import prisma from "@/lib/prisma";

type Props = {
  title: string;
  isLatestProducts?: boolean;
  isBestSelling?: boolean;
};

const getBestSellingProducts = async () => {
  const bestSellingProducts = await prisma.inventory.findMany({
    take: 10,
    orderBy: {
      soldCount: "desc",
    },
    include: {
      product: {
        include: {
          brand: true,
          primaryCategory: true,
          secondaryCategory: true,
          tertiaryCategory: true,
          quaternaryCategory: true,
        },
      },
    },
  });

  return bestSellingProducts;
};

const getLatestProducts = async () => {
  const latestProducts = await prisma.inventory.findMany({
    take: 10,
    orderBy: {
      createdAt: "desc",
    },
    include: {
      product: {
        include: {
          brand: true,
          primaryCategory: true,
          secondaryCategory: true,
          tertiaryCategory: true,
          quaternaryCategory: true,
        },
      },
    },
  });

  return latestProducts;
};

export default async function ProductCarouselContainer({
  title,
  isLatestProducts,
  isBestSelling,
}: Props) {
  const inventoryItems = isLatestProducts
    ? await getLatestProducts()
    : isBestSelling
    ? await getBestSellingProducts()
    : [];

  return <ProductCarousel title={title} inventoryItems={inventoryItems} />;
}
