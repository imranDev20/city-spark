import { Separator } from "@/components/ui/separator";
import { Menu } from "./menu";
import MiddleHeader from "./middle-header";

export default function Header() {
  return (
    <header className="z-[50] sticky top-0 w-full bg-background/95 border-b backdrop-blur-sm dark:bg-black/[0.6] border-border/40">
      <MiddleHeader />
      <Separator />
      <Menu />
    </header>
  );
}
