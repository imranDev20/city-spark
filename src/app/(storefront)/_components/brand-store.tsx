"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import img from "@/images/baneer-bg1.jpeg";
import { cn } from "@/lib/utils";

export default function BrandStore() {
  return (
    <div
      className={cn(
        "container max-w-screen-xl mx-auto my-12",
        "px-4 md:px-6 lg:px-8"
      )}
    >
      <div className="relative bg-primary text-primary-foreground rounded-xl">
        <Image
          src={img}
          alt="Brand Store Background"
          layout="fill"
          style={{
            objectFit: "cover",
          }}
          className="opacity-30 rounded-xl"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />

        <div
          className={cn(
            "relative z-10 flex flex-col items-center justify-center text-center",
            "p-6 md:p-10 space-y-4"
          )}
        >
          <h1 className="text-3xl md:text-4xl font-bold">
            Explore Brand Store
          </h1>
          <p
            className={cn("text-primary-foreground/90 text-sm", "px-4 md:px-0")}
          >
            Lorem Ipsum is simply dummy text of the printing and
            <span className="hidden md:inline">
              {" "}
              <br />
            </span>{" "}
            typesetting industry.
          </p>

          <Button variant="secondary" className="hover:bg-secondary/90">
            Visit Brand Shop
          </Button>
        </div>
      </div>
    </div>
  );
}
