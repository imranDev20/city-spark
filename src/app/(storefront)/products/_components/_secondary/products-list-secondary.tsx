import Image from "next/image";
import { CategoryWithRelation } from "../../[[...product_url]]/page";

export default function SecondaryProductsList({ products }: { products: CategoryWithRelation[] }) {
  console.log(`secondaryproducts`, products);
  return (
    <div className="w-full md:w-3/4 mt-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((product) => {
          if (product.secondaryChildCategories.length > 0) {
            return (
              <div key={product.id} className="p-4 border rounded-lg">
                <div className="text-center">
                  <h1 className="text-2xl font-bold">{product.name}</h1>
                  <p className="text-red-700 my-5 text-xl">
                    {product.secondaryProducts?.length || 0} Products
                  </p>
                </div>
                <div>
                  <Image
                    src={product.image || ""}
                    width={246}
                    height={150}
                    alt={product.name}
                    className="mb-2 w-[246px] h-[150px] mx-auto object-center"
                  />
                </div>
              </div>
            );
          } else {
            // Render other data when secondaryChildCategories is empty
            return (
              <div key={product.id} className="w-full md:w-3/4 mt-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {product.secondaryProducts.map((secondaryProduct) => (
                    <div key={secondaryProduct.id} className="p-4 border rounded-lg">
                      <div className="text-center">
                        <h1 className="text-2xl font-bold">{secondaryProduct.name}</h1>
                        <p className="text-red-700 my-5 text-xl">
                          Product Details
                        </p>
                      </div>
                      <div>
                        {/* <Image
                          src={secondaryProduct.image[0] || ""}
                          width={246}
                          height={150}
                          alt={secondaryProduct.name}
                          className="mb-2 w-[246px] h-[150px] mx-auto object-center"
                        /> */}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          }
        })}
      </div>
    </div>
  );
}
