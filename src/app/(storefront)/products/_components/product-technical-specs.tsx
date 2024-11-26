import React from "react";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { type Prisma } from "@prisma/client";

type InventoryItemWithRelation = Prisma.InventoryGetPayload<{
  include: {
    product: {
      include: {
        brand: true;
        primaryCategory: true;
        secondaryCategory: true;
        tertiaryCategory: true;
        quaternaryCategory: true;
        productTemplate: {
          include: {
            fields: {
              include: {
                templateField: true;
              };
            };
            template: true;
          };
        };
      };
    };
  };
}>;

type TechnicalSpecsProps = {
  product: InventoryItemWithRelation["product"];
};

export default function TechnicalSpecs({ product }: TechnicalSpecsProps) {
  const details = [
    { label: "Brand Name", value: product.brand?.name },
    { label: "Model", value: product.model },
    ...(product.productTemplate?.fields?.map((field) => ({
      label: field.templateField.fieldName,
      value: field.fieldValue,
    })) || []),
    { label: "Guarantee", value: product.guarantee },
    { label: "Warranty", value: product.warranty },
    { label: "Unit", value: product.unit },
    { label: "Weight", value: product.weight },
    { label: "Color", value: product.color },
    { label: "Length", value: product.length },
    { label: "Width", value: product.width },
    { label: "Height", value: product.height },
    { label: "Material", value: product.material },
    { label: "Volume", value: product.volume },
    { label: "Type", value: product.type },
    { label: "Shape", value: product.shape },
  ].filter((detail) => detail.value != null);

  // Pair up the details for two-column layout (desktop)
  const pairedDetails = [];
  for (let i = 0; i < details.length; i += 2) {
    pairedDetails.push(details.slice(i, i + 2));
  }

  return (
    <div className="mt-6 lg:mt-8 overflow-x-auto">
      <h4 className="font-semibold text-lg lg:text-xl mb-3 lg:mb-4">
        Technical Specification
      </h4>

      {/* Mobile Layout (single column) */}
      <div className="lg:hidden">
        <Table className="border-collapse border w-full">
          <TableBody>
            {details.map((detail, index) => (
              <TableRow key={index} className="border-b">
                <TableCell className="font-medium bg-gray-200 border-r p-2 w-1/3 text-sm">
                  {detail.label}
                </TableCell>
                <TableCell className="bg-white p-2 text-center text-sm">
                  {detail.value}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Desktop Layout (two columns) */}
      <div className="hidden lg:block min-w-[600px] lg:min-w-full">
        <Table className="border-collapse border w-full">
          <TableBody>
            {pairedDetails.map((pair, index) => (
              <TableRow key={index} className="border-b">
                {pair.map((detail, detailIndex) => (
                  <React.Fragment key={detailIndex}>
                    <TableCell className="font-medium bg-gray-200 border-r p-2 w-1/6 text-base">
                      {detail.label}
                    </TableCell>
                    <TableCell className="bg-white border-r p-2 text-center w-1/3 text-base">
                      {detail.value}
                    </TableCell>
                  </React.Fragment>
                ))}
                {pair.length === 1 && (
                  <>
                    <TableCell className="bg-gray-200 border-r p-2 w-1/6" />
                    <TableCell className="bg-white p-2 w-1/3" />
                  </>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
