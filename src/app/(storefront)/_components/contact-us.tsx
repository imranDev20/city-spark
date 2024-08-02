import { Input } from "@/components/ui/input";
import Image from "next/image";
import { FiFacebook, FiInstagram, FiTwitter, FiYoutube } from "react-icons/fi";
import img from "../../../../images/payment.png";
export default function ContactUs() {
  return (
    <div className="mx-auto w-[85%] flex justify-between mb-10 mt-28">
      <div>
        <h2 className="text-sm font-bold mb-4">Sign up for news and offers</h2>
        <div className="flex gap-2">
          <Input type="email" placeholder="Email" className="w-60" />
          <button className="bg-black text-white font-semibold py-1 px-4 rounded-md">
            SIGN UP
          </button>
        </div>
      </div>
      <div>
        <h2 className="text-sm font-bold mb-4">Easy Payment</h2>
        <Image src={img} alt="payment" className="w-60" />
      </div>
      <div>
        <h2 className="text-sm font-bold mb-4">Connect with us</h2>
        <div className="flex space-x-2   ">
          <FiYoutube className="border border-black p-2 rounded-md" size={40} />
          <FiFacebook
            className="border border-black p-2 rounded-md"
            size={40}
          />
          <FiInstagram
            className="border border-black p-2 rounded-md"
            size={40}
          />
          <FiTwitter className="border border-black p-2 rounded-md" size={40} />
        </div>
      </div>
    </div>
  );
}
