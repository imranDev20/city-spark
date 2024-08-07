import { Button } from "@/components/ui/button";
import img from "@/images/dummy-img.png";
import Image from "next/image";

export default function Features() {
  return (
    <div className=" lg:grid  space-y-4 lg:space-y-0 grid-cols-2 gap-5 lg:w-[85%] mt-10 mx-auto uppercase">
      <div className="bg-primary flex rounded-lg  ">
        <div className="w-[60%] p-10 py-20">
          <p className="text-3xl font-semibold text-white ">
            Lorem ipsum dolor sit amet
          </p>
          <Button className="bg-white hover:bg-white text-black text-xl font-bold px-3 py-1 rounded-md mt-3">
            VISIT STORE
          </Button>
        </div>
        <Image src={img} alt="img" />
      </div>
      <div className="bg-primary flex rounded-lg  ">
        <div className="w-[60%] p-10 py-20">
          <p className="text-3xl font-semibold text-white ">
            Lorem ipsum dolor sit amet
          </p>
          <Button className="bg-white hover:bg-white text-black text-xl font-bold px-3 py-1 rounded-md mt-3">
            VISIT STORE
          </Button>
        </div>
        <Image src={img} alt="img" />
      </div>
      <div className="bg-primary flex rounded-lg  ">
        <div className="w-[60%] p-10 py-20">
          <p className="text-3xl font-semibold text-white ">
            Lorem ipsum dolor sit amet
          </p>
          <Button className="bg-white hover:bg-white text-black text-xl font-bold px-3 py-1 rounded-md mt-3">
            VISIT STORE
          </Button>
        </div>
        <Image src={img} alt="img" />
      </div>
      <div className="bg-primary flex rounded-lg  ">
        <div className="w-[60%] p-10 py-20">
          <p className="text-3xl font-semibold text-white ">
            Lorem ipsum dolor sit amet
          </p>
          <Button className="bg-white hover:bg-white text-black text-xl font-bold px-3 py-1 rounded-md mt-3">
            VISIT STORE
          </Button>
        </div>
        <Image src={img} alt="img" />
      </div>
    </div>
  );
}
