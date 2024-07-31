import Image from "next/image";
import img from "../../../../images/bg-img.jpg";

export default function Blogs() {
  return (
    <div className="relative bg-[#DF0023] text-white mt-6 mb-12 rounded-xl w-[85%] mx-auto">
      <Image
        src={img}
        alt="Brand Store Background"
        layout="fill"
        objectFit="cover"
        className="opacity-20 rounded-xl"
      />

      <div className="relative z-10 flex flex-col items-center justify-center p-10 text-center space-y-4">
        <h1 className="text-4xl font-bold text-yellow-400">Explore Our Blog</h1>
        <p className="text-gray-100 text-sm">
          Lorem Ipsum is simply dummy text of the printing <br /> and
          typesetting industry.
        </p>
        <button className="px-5 py-2 bg-white text-black font-semibold rounded hover:bg-gray-200">
          READ BLOG
        </button>
      </div>
    </div>
  );
}
