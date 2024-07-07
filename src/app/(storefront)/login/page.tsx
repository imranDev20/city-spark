import loginImg from "@/images/login-img.jpg";
import Image from "next/image";
import LoginForm from "./_components/login-form";

export default function LoginPage() {
  return (
    <section className="flex items-center justify-center my-10">
      <div className="flex h-[440px] w-[720px] shadow-lg">
        <LoginForm />
        <div className="flex items-center justify-center w-1/2">
          <Image src={loginImg} alt="loginImg" />
        </div>
      </div>
    </section>
  );
}
