"use client";

import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LoadingButton } from "@/components/ui/loading-button";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ProductFormInputType, createProductSchema } from "../schema";
import { Check, ChevronLeft, X } from "lucide-react";
import { Prisma } from "@prisma/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createProduct, updateProduct } from "../actions";
import { useToast } from "@/components/ui/use-toast";
import { fetchCategories } from "@/services/admin-categories";
import ProductDetailsSection from "./product-details-section";
import BrandSpecificationsSection from "./brand-specification-section";
import PriceSection from "./price-section";
import FeaturesSection from "./features-section";
import TemplatesSection from "./templates-section";
import CategoriesSection from "./categories-section";
import ProductImagesSection from "./product-images-section";
import ProductStatusSection from "./product-status-section";

type ProductWithRelations = Prisma.ProductGetPayload<{
  include: {
    images: true;
    brand: true;
    features: true;
    productTemplate: {
      include: {
        fields: {
          include: {
            templateField: true;
          };
        };
      };
    };
  };
}>;

export default function ProductForm({
  productDetails,
}: {
  productDetails?: ProductWithRelations | null;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [primaryCategoryId, setPrimaryCategoryId] = useState<string>();
  const [secondaryCategoryId, setSecondaryCategoryId] = useState<string>();
  const [tertiaryCategoryId, setTertiaryCategoryId] = useState<string>();

  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Updated query for primary categories
  const { data: primaryCategoriesResponse, isPending: isPrimaryPending } =
    useQuery({
      queryKey: ["categories", "PRIMARY"],
      queryFn: () =>
        fetchCategories({
          filter_type: "PRIMARY",
          page: "1",
          page_size: "10", // Adjust based on your needs
        }),
    });

  // Updated query for secondary categories
  const { data: secondaryCategoriesResponse, isPending: isSecondaryPending } =
    useQuery({
      queryKey: ["categories", "SECONDARY", primaryCategoryId],
      queryFn: () =>
        fetchCategories({
          filter_type: "SECONDARY",
          page: "1",
          page_size: "10",
        }),
      enabled: !!primaryCategoryId,
    });

  // Updated query for tertiary categories
  const { data: tertiaryCategoriesResponse, isPending: isTertiaryPending } =
    useQuery({
      queryKey: ["categories", "TERTIARY", secondaryCategoryId],
      queryFn: () =>
        fetchCategories({
          filter_type: "TERTIARY",
          page: "1",
          page_size: "10",
        }),
      enabled: !!secondaryCategoryId,
    });

  // Updated query for quaternary categories
  const { data: quaternaryCategoriesResponse, isPending: isQuaternaryPending } =
    useQuery({
      queryKey: ["categories", "QUATERNARY", tertiaryCategoryId],
      queryFn: () =>
        fetchCategories({
          filter_type: "QUATERNARY",
          page: "1",
          page_size: "10",
        }),
      enabled: !!tertiaryCategoryId,
    });

  // Extract categories from responses
  const primaryCategories = primaryCategoriesResponse?.data.categories || [];
  const secondaryCategories =
    secondaryCategoriesResponse?.data.categories || [];
  const tertiaryCategories = tertiaryCategoriesResponse?.data.categories || [];
  const quaternaryCategories =
    quaternaryCategoriesResponse?.data.categories || [];

  const productSchema = createProductSchema(
    primaryCategories,
    secondaryCategories,
    tertiaryCategories,
    quaternaryCategories
  );

  const form = useForm<ProductFormInputType>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      status: "DRAFT",
      description: "",
      features: [
        {
          feature: "",
        },
      ],
      model: "",
      brand: "",
      images: [],
      shape: "",
      volume: "",
      weight: "",
      length: "",
      width: "",
      height: "",
      material: "",
      color: "",
      templateId: "",
      contractPrice: "",
      tradePrice: "",
      guarantee: "",
      warranty: "",
      promotionalPrice: "",
      type: "",
      unit: "",
      productTemplateId: "",
      primaryCategoryId: "",
      secondaryCategoryId: "",
      tertiaryCategoryId: "",
      quaternaryCategoryId: "",
    },
  });

  const {
    handleSubmit,
    formState: { isDirty },

    reset,
  } = form;

  useEffect(() => {
    if (productDetails) {
      reset({
        name: productDetails.name,
        description: productDetails.description || "",
        brand: productDetails.brandId || "",
        model: productDetails.model || "",
        type: productDetails.type || "",
        warranty: productDetails.warranty || "",
        guarantee: productDetails.guarantee || "",
        tradePrice: productDetails.tradePrice?.toString() || "",
        contractPrice: productDetails.contractPrice?.toString() || "",
        promotionalPrice: productDetails.promotionalPrice?.toString() || "",
        unit: productDetails.unit || "",
        weight: productDetails.weight?.toString() || "",
        color: productDetails.color || "",
        length: productDetails.length?.toString() || "",
        width: productDetails.width?.toString() || "",
        height: productDetails.height?.toString() || "",
        material: productDetails.material || "",
        templateId: productDetails.productTemplate?.templateId || "",
        productTemplateId: productDetails.productTemplateId || "",
        features: productDetails.features.map((item) => ({ feature: item })),
        images: productDetails.images.map((item) => ({ image: item })),
        primaryCategoryId: productDetails.primaryCategoryId || "",
        secondaryCategoryId: productDetails.secondaryCategoryId || "",
        tertiaryCategoryId: productDetails.tertiaryCategoryId || "",
        quaternaryCategoryId: productDetails.quaternaryCategoryId || "",
        status: productDetails.status || "DRAFT",
        shape: productDetails.shape || "",
        volume: productDetails.volume?.toString() || "",
        manuals: [],
      });

      setPrimaryCategoryId(productDetails.primaryCategoryId || "");
      setSecondaryCategoryId(productDetails.secondaryCategoryId || "");
      setTertiaryCategoryId(productDetails.tertiaryCategoryId || "");
    }
  }, [productDetails, reset]);

  const onSubmit = async (data: ProductFormInputType) => {
    startTransition(async () => {
      try {
        let result;
        if (productDetails) {
          // Update existing product
          result = await updateProduct(productDetails.id, data);
        } else {
          // Create new product
          result = await createProduct(data);
        }

        if (result.success) {
          await queryClient.invalidateQueries({ queryKey: ["products"] });

          toast({
            title: "Success",
            description: result.message,
            variant: "success",
          });
          router.push("/admin/products");
        } else {
          toast({
            title: "Error",
            description: result.message,
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Error submitting product:", error);
        toast({
          title: "Error",
          description: "An unexpected error occurred. Please try again.",
          variant: "destructive",
        });
      }
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex items-center gap-4 mb-5 mt-7">
          <Link href="/admin/products">
            <Button variant="outline" size="icon" className="h-9 w-9">
              <ChevronLeft className="h-5 w-5" />
              <span className="sr-only">Back</span>
            </Button>
          </Link>
          <h1 className="flex-1 text-xl font-semibold tracking-tight">
            {productDetails ? `Edit ${productDetails.name}` : "Add New Product"}
          </h1>

          <div className="hidden items-center gap-2 md:ml-auto md:flex">
            <Link href="/admin/products">
              <Button type="button" variant="outline" className="h-9">
                <X className="mr-2 h-4 w-4" />
                Cancel
              </Button>
            </Link>
            <LoadingButton
              type="submit"
              className="h-9"
              disabled={!isDirty || isPending}
              loading={isPending}
            >
              {!isPending && <Check className="mr-2 h-4 w-4" />}
              {productDetails ? "Update Product" : "Save Product"}
            </LoadingButton>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8">
          <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
            <ProductDetailsSection />
            <BrandSpecificationsSection productDetails={productDetails} />
            {/* <PriceSection /> */}
            {/* <FeaturesSection /> */}
            {/* <TemplatesSection /> */}
            <CategoriesSection
              primaryCategories={primaryCategories}
              secondaryCategories={secondaryCategories}
              tertiaryCategories={tertiaryCategories}
              quaternaryCategories={quaternaryCategories}
              onPrimaryCategoryChange={setPrimaryCategoryId}
              onSecondaryCategoryChange={setSecondaryCategoryId}
              onTertiaryCategoryChange={setTertiaryCategoryId}
              isPrimaryLoading={isPrimaryPending}
              isSecondaryLoading={isSecondaryPending}
              isTertiaryLoading={isTertiaryPending}
              isQuaternaryLoading={isQuaternaryPending}
            />
          </div>

          <div className="grid auto-rows-max items-start gap-4 lg:gap-8">
            <ProductStatusSection />
            <ProductImagesSection />

            <Card x-chunk="dashboard-07-chunk-5">
              <CardHeader>
                <CardTitle>Manuals & Instructions</CardTitle>
                <CardDescription>
                  Archive this product if it&apos;s no longer available.
                </CardDescription>
              </CardHeader>
              <CardContent></CardContent>
            </Card>
            <Card x-chunk="dashboard-07-chunk-5">
              <CardHeader>
                <CardTitle>Archive Product</CardTitle>
                <CardDescription>
                  Archive this product if it&apos;s no longer available.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div></div>
                <Button size="sm" variant="secondary">
                  Archive Product
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="mt-8 flex justify-end md:hidden">
          <Button type="button" variant="outline" className="mr-4">
            <X className="mr-2 h-4 w-4" />
            Cancel
          </Button>
          <LoadingButton
            type="submit"
            disabled={!isDirty || isPending}
            loading={isPending}
          >
            {!isPending && <Check className="mr-2 h-4 w-4" />}
            {productDetails ? "Update Product" : "Save Product"}
          </LoadingButton>
        </div>
      </form>
    </Form>
  );
}
