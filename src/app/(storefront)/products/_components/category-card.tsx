import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import PlaceholderImage from "@/images/placeholder-image.jpg";
import { CategoryWithRelations } from "@/types/storefront-products";
import Image from "next/image";

export default function CategoryCard({
  category,
}: {
  category: CategoryWithRelations;
}) {
  const getProductCount = (category: CategoryWithRelations) => {
    switch (category.type) {
      case "PRIMARY":
        return category.primaryProducts.length;
      case "SECONDARY":
        return category.secondaryProducts.length;
      case "TERTIARY":
        return category.tertiaryProducts.length;
      case "QUATERNARY":
        return category.quaternaryProducts.length;
      default:
        return 0;
    }
  };

  const productCount = getProductCount(category);

  return (
    <Card className="shadow-none hover:shadow-md transition-all h-full border-gray-350">
      <CardHeader className="text-center">
        <CardTitle className="font-semibold text-2xl 2xl:text-3xl ">
          {category.name}
        </CardTitle>
        <CardDescription className="text-base font-normal text-primary">
          {productCount} Product{productCount !== 1 ? "s" : ""}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative h-28">
          {category.image ? (
            <Image
              src={category.image}
              alt={category.name}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              style={{
                objectFit: "contain",
              }}
            />
          ) : (
            <Image
              src={PlaceholderImage}
              alt={category.name}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              style={{
                objectFit: "contain",
              }}
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
}
