import Image from "next/image";
import img from "../../../../images/dummy-img.png";

export default function GiftCard() {
  return (
    <div className="w-[85%] mx-auto">
      <div className="grid grid-cols-2 gap-6 ">
        <div className="bg-primary flex rounded-lg  ">
          <div className="w-[60%]  px-6 py-20">
            <p className="text-3xl font-semibold text-white uppercase">
              Lorem ipsum dolor sit amet
            </p>
            <button className="bg-white text-xl font-bold px-3 py-1 rounded-sm mt-3">
              SEE OFFER
            </button>
          </div>

          <Image src={img} alt="img" />
        </div>
        <div className="bg-primary flex rounded-lg  ">
          <div className="w-[60%]  px-6 py-20">
            <p className="text-3xl font-semibold text-white uppercase">
              Lorem ipsum dolor sit amet
            </p>
            <button className="bg-white text-xl font-bold px-3 py-1 rounded-sm mt-3">
              GIFT CARD
            </button>
          </div>

          <Image src={img} alt="img" />
        </div>
      </div>
    </div>
  );
}
