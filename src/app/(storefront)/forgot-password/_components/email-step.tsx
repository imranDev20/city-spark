import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import resetPasswordImage from "@/images/reset-pass.jpg";
import Image from "next/image";
import Link from "next/link";

export default function EmailStep() {
  return (
    <section className=" flex items-center  justify-center my-10">
      <div className="flex  h-[450px] w-[700px] shadow-lg ">
        <div className="lg:w-1/2 p-16">
          <h3 className="mb-2 text-2xl font-semibold">Recover Password</h3>
          <p className="text-sm mb-3">
            To recover the password for your account, please provide us your
            email address.
          </p>
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="email">Email</Label>
            <Input type="email" id="email" placeholder="Email" required />
          </div>

          <input
            type="submit"
            className="text-white bg-secondary   mt-3 py-2 px-3 mb-2 rounded-md font-semibold w-full"
            value="Recover"
          />
          <p className="underline">
            <Link href="/login">Go to logIn Page.</Link>
          </p>
        </div>
        <div className=" w-1/2 flex items-center justify-center">
          <Image src={resetPasswordImage} alt="resetpassImg" />
        </div>
      </div>
    </section>
  );
}
