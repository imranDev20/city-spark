import Image from "next/image";
import img from "../../../../images/dummy-img.png";

export default function Features() {
  return (
    <div className=" lg:grid  space-y-4 lg:space-y-0 grid-cols-2 gap-5 lg:w-[85%] mt-10 mx-auto uppercase">
      <div className="bg-primary flex rounded-lg  ">
        <div className="w-[60%] p-10 py-20">
          <p className="text-3xl font-semibold text-white ">
            Lorem ipsum dolor sit amet
          </p>
          <button className="bg-white text-xl font-bold px-3 py-1 rounded-md mt-3">
            VISIT STORE
          </button>
        </div>
        <Image src={img} alt="img" />
      </div>
      <div className="bg-primary flex rounded-lg  ">
        <div className="w-[60%] p-10 py-20">
          <p className="text-3xl font-semibold text-white ">
            Lorem ipsum dolor sit amet
          </p>
          <button className="bg-white text-xl font-bold px-3 py-1 rounded-md mt-3">
            VISIT STORE
          </button>
        </div>
        <Image src={img} alt="img" />
      </div>
      <div className="bg-primary flex rounded-lg  ">
        <div className="w-[60%] p-10 py-20">
          <p className="text-3xl font-semibold text-white ">
            Lorem ipsum dolor sit amet
          </p>
          <button className="bg-white text-xl font-bold px-3 py-1 rounded-md mt-3">
            VISIT STORE
          </button>
        </div>
        <Image src={img} alt="img" />
      </div>
      <div className="bg-primary flex rounded-lg  ">
        <div className="w-[60%] p-10 py-20">
          <p className="text-3xl font-semibold text-white ">
            Lorem ipsum dolor sit amet
          </p>
          <button className="bg-white text-xl font-bold px-3 py-1 rounded-md mt-3">
            VISIT STORE
          </button>
        </div>
        <Image src={img} alt="img" />
      </div>
    </div>
  );
}
