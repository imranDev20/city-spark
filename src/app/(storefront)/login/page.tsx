import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import Link from "next/link";

import loginImg from "@/images/login-img.jpg";

export default function LoginPage() {
  return (
    <section className=" flex items-center  justify-center my-10">
      <div className="flex  h-[450px] w-[720px] shadow-lg ">
        <div className="lg:w-1/2 p-12">
          <h3 className="mb-8 text-2xl font-semibold">
            Log in to your account
          </h3>
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="email">Email</Label>
            <Input type="email" id="email" placeholder="Email" required />
          </div>
          <div className="grid w-52 max-w-sm mt-4 items-center gap-1.5">
            <Label htmlFor="password">Password</Label>
            <Input
              type="password"
              id="password"
              placeholder="Enter your password"
              required
            />
          </div>
          <div></div>

          <button className="hover:underline text-sm relative left-28">
            <Link href="/forgot-password">Forgot Password?</Link>
          </button>
          <input
            type="submit"
            className="text-white bg-secondary   mt-3 py-2 px-3 mb-2 rounded-md font-semibold w-full"
            value="Log In"
          />
          <p className="text-sm">
            If you do not have an account. Please{" "}
            <span className="hover:underline text-blue-700">
              {" "}
              <Link href="/register">Register here</Link>{" "}
            </span>
          </p>
        </div>
        <div className=" flex items-center justify-center">
          <Image src={loginImg} alt="loginImg" />
        </div>
      </div>
    </section>
  );
}
