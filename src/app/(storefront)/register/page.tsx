import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import registerImg from "@/images/register-img.jpg";
import Image from "next/image";
import Link from "next/link";

export default function RegisterPage() {
  return (
    <section className=" flex items-center  justify-center my-10">
      <div className="flex  h-[570px] w-[800px] shadow-lg ">
        <div className=" w-1/2 p-5 space-y-5">
          <h3 className="mb-10 text-2xl font-semibold">Register account</h3>

          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="text">First Name</Label>
            <Input
              type="text"
              id="text"
              placeholder="Enter your First Name"
              required
            />
          </div>

          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="text">Surname</Label>
            <Input
              type="text"
              id="text"
              placeholder="Enter your Surname"
              required
            />
          </div>
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="email">Email</Label>
            <Input
              type="email"
              id="email"
              placeholder="Enter your Email"
              required
            />
          </div>
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="password">Password</Label>
            <Input
              type="password"
              id="password"
              placeholder="Enter your Password"
              required
            />
          </div>
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="password">Confirm Password</Label>
            <Input
              type="password"
              id="password"
              placeholder="Enter your Password"
              required
            />
          </div>

          <input
            type="submit"
            className="text-white bg-secondary mt-3 py-2 px-3 mb-2 rounded-md font-semibold w-full"
            value="Register"
          />
          <p className="text-sm">
            If you already have an account. Please{" "}
            <span className="hover:underline text-secondary">
              {" "}
              <Link href="/login">LogIn here</Link>{" "}
            </span>
          </p>
        </div>
        <div className=" w-1/2 flex items-center justify-center">
          <Image src={registerImg} alt="registerImg" />
        </div>
      </div>
    </section>
  );
}
