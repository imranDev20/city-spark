import registerImg from "@/images/register-img.jpg";
import Image from "next/image";
import RegisterForm from "./_components/register-form";

export default function RegisterPage() {
  return (
    <section className="flex items-center justify-center my-10">
      <div className="flex h-[590px] w-[800px] shadow-lg">
        <RegisterForm />
        <div className="w-1/2 flex items-center justify-center">
          <Image src={registerImg} alt="registerImg" />
        </div>
      </div>
    </section>
  );
}
