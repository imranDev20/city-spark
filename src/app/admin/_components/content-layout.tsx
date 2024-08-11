import { Button } from "@/components/ui/button";
import { Navbar } from "./navbar";

interface ContentLayoutProps {
  title: string;
  children: React.ReactNode;
}

export function ContentLayout({ title, children }: ContentLayoutProps) {
  return (
    <>
      <Navbar title={title} />
      <div className="container pt-6 pb-8 px-4 sm:px-8">{children}</div>
    </>
  );
}
