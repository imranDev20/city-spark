import Image from "next/image";
import img from "../../../../images/dummy-img.png";

export default function Features() {
  return (
    <div className=" lg:grid  space-y-4 lg:space-y-0 grid-cols-2 gap-4 lg:w-[85%] mx-auto">
      <div className="bg-primary flex rounded-xl  ">
        <div className="w-1/2 p-10 py-16">
          <p className="text-2xl font-semibold text-white">
            Lorem ipsum <br /> dolor sit amet
          </p>
          <button className="bg-white font-bold px-2 py-1 rounded-md mt-3">
            VISIT STORE
          </button>
        </div>
        <Image src={img} alt="img" />
      </div>
      <div className="bg-primary flex rounded-xl">
        <div className="w-1/2 p-10 py-16">
          <p className="text-2xl font-semibold text-white">
            Lorem ipsum <br /> dolor sit amet
          </p>
          <button className="bg-white font-bold px-2 py-1 rounded-md mt-3">
            VISIT STORE
          </button>
        </div>
        <Image src={img} alt="img" />
      </div>
      <div className="bg-primary flex rounded-xl">
        <div className="w-1/2 p-10 py-16">
          <p className="text-2xl font-semibold text-white">
            Lorem ipsum <br /> dolor sit amet
          </p>
          <button className="bg-white font-bold px-2 py-1 rounded-md mt-3">
            VISIT STORE
          </button>
        </div>
        <Image src={img} alt="img" />
      </div>
      <div className="bg-primary flex rounded-xl">
        <div className="w-1/2 p-10 py-16">
          <p className="text-2xl font-semibold text-white">
            Lorem ipsum <br /> dolor sit amet
          </p>
          <button className="bg-white font-bold px-2 py-1 rounded-md mt-3">
            VISIT STORE
          </button>
        </div>
        <Image src={img} alt="img" />
      </div>
    </div>
  );
}
