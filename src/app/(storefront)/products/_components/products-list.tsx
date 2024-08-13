import Image from "next/image";
import categoryImage from "../../../../images/category-image.png";

export default function ProductsList() {
  const products = [
    {
      id: "1",
      category: "copper-brassware",
      name: "Copper Fitting",
    },
    {
      id: "2",
      category: "plastic-pipe-fittings",
      name: "Plastic Pipe",
    },
    {
      id: "3",
      category: "soil-waste",
      name: "Waste Drain",
    },
    {
      id: "4",
      category: "copper-brassware",
      name: "Copper Fitting",
    },
    {
      id: "5",
      category: "plastic-pipe-fittings",
      name: "Plastic Pipe",
    },
    {
      id: "6",
      category: "soil-waste",
      name: "Waste Drain",
    },
  ];



  return (
    <div className="w-full md:w-3/4  mt-6">     
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((product) => (
          <div key={product.id} className="p-4 border rounded-lg">
            <div className="text-center">
              <h1 className="text-2xl font-bold">{product.name}</h1>
              <p className="text-red-700 my-5 text-xl">150 Products</p>
            </div>
            <div>
            <Image src={categoryImage} alt={product.name} className="mb-2 mx-auto object-center" />
            </div>
         
          </div>
        ))}
      </div>
    </div>
  );
}
