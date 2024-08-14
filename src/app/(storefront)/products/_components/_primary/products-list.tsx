"use client"
import Image from "next/image";
import { CategoryWithRelation } from "../../[[...product_url]]/page";
import { useRouter } from "next/navigation";
import { convertToKebabCase } from "./categories-navigation";

export default function ProductsList({products}:{products:CategoryWithRelation[]}) {  
  const router = useRouter();
  return (
    <div className="w-full md:w-3/4  mt-6">     
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        { products.map((product) => (
          <div onClick={() => router.push(`/products/${convertToKebabCase(product.name)}`)}  key={product.id} className="p-4 border rounded-lg cursor-pointer">
            <div className="text-center">
              <h1 className="text-2xl font-bold">{product.name}</h1>
              <p className="text-red-700 my-5 text-xl">{product.primaryProducts.length || 0} Products</p>
            </div>
            <div>
            <Image src={`${product?.image || ""}`} width={246} height={150}  alt={product.name} className="mb-2 w-[246px] h-[150px] mx-auto object-center" />
            </div>
         
          </div>
        ))}
      </div>
    </div>
  );
}
