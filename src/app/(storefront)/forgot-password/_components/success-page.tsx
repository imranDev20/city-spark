"use client";
import Lotti from "lottie-react";
import success from "../../../../../public/success-animation.json";
export default function SuccessPage() {
  return (
    <section className="flex items-center  justify-center my-8">
      <div className="    px-20 py-12 shadow-lg">
        <div className="w-60  text-center">
          <Lotti animationData={success} />
          <p className="text-2xl font-bold  ">Congratulation !</p>
          <p>
            Your password has been successfully reset. You can now log in with
            your new password.
          </p>
        </div>
      </div>
    </section>
  );
}
