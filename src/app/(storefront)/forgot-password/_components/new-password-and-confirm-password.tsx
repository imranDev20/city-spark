import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import newPassImg from "@/images/new-pass-img.jpg";
import Image from "next/image";

export default function NewPasswordAndConfirmPassword() {
  return (
    <section className=" flex items-center  justify-center my-6">
      <div className="flex  h-[400px] w-[720px] shadow-lg ">
        <div className="lg:w-1/2 p-12">
          <h3 className="mb-1 text-2xl font-semibold">
            Provide you new password
          </h3>
          <p className="mb-4">Your code was sent to you via email.</p>
          <div className="space-y-4">
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
          </div>
          <Button className="bg-secondary w-[90%] mt-3 ">Submit</Button>
        </div>
        <div className=" w-1/2 flex items-center justify-center">
          <Image src={newPassImg} alt="resetPassImg" />
        </div>
      </div>
    </section>
  );
}
