"use client";
import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import otpImage from "@/images/otp-img.jpg";
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp";
import Image from "next/image";

import { useEffect, useState } from "react";
export default function OtpStep() {
  const [seconds, setSeconds] = useState(60);
  const [isTimerFinished, setIsTimerFinished] = useState(false);

  useEffect(() => {
    if (seconds > 0) {
      const timerId = setInterval(() => {
        setSeconds((prevSeconds) => prevSeconds - 1);
      }, 1000);

      return () => clearInterval(timerId);
    } else {
      setIsTimerFinished(true);
    }
  }, [seconds]);

  const [otpValue, setOtpValue] = useState("");
  console.log(otpValue.length);
  const handleOtpChange = (e: any) => {
    setOtpValue(e);
  };

  return (
    <section className=" flex items-center  justify-center my-10">
      <div className="flex  h-[350px] w-[720px] shadow-lg ">
        <div className="lg:w-1/2 p-12">
          <h3 className="mb-1 text-2xl font-semibold">Enter Your OTP</h3>
          <p className="mb-4">Your code was sent to you via email.</p>
          <div>
            <InputOTP
              onChange={handleOtpChange}
              maxLength={6}
              pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
            >
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
          </div>

          <h1 className=" mt-2   font-semibold ">
            Your time remaining: {seconds}s
          </h1>
          {otpValue.length === 6 ? (
            <Button
              disabled={isTimerFinished}
              className="bg-secondary w-[90%] mt-3 "
            >
              Submit
            </Button>
          ) : (
            <Button
              disabled={!isTimerFinished}
              className="bg-secondary w-[90%] mt-3 "
            >
              Request again
            </Button>
          )}
        </div>

        <div className=" w-1/2 flex items-center justify-center">
          <Image src={otpImage} alt="otpImage" />
        </div>
      </div>
    </section>
  );
}
