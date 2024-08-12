// /components/Breadcrumb.tsx
import React from "react";
import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

interface BreadcrumbItemProps {
  label: string;
  href?: string;
  icons?: any
  isCurrentPage?: boolean;
}

interface BreadcrumbProps {
  items: BreadcrumbItemProps[];
}

const DynamicBreadcrumb: React.FC<BreadcrumbProps> = ({ items }) => {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        {items.map((item, index) => (
          <React.Fragment key={item.label}>
            <BreadcrumbItem className={item.isCurrentPage ? 'text-white':"text-black"}>
            {item?.icons}  {item.isCurrentPage ? (
                <BreadcrumbPage className={item.isCurrentPage ? 'text-white':"text-black"}>{ item.label}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink asChild>
                  <Link href={item.href ?? ""}>{item.label}</Link>
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>

            {items.length - 1 !== index && <BreadcrumbSeparator className="text-black"/>}
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default DynamicBreadcrumb;
