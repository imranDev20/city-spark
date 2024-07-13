import ProductsCategories from "./_components/categories";
import ProductsCart from "./_components/products-card";

export default function ProductsPage() {
  return (
    <div className="flex flex-col md:flex-row">
      <ProductsCategories />
      <ProductsCart />
    </div>
  );
}
