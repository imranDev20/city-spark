import React from "react";
import { ContentLayout } from "../../_components/content-layout";
import PromoCodeForm from "../_components/promocode-form";

export default function AdminPromocodesPage() {
  return (
    <ContentLayout title="Promocodes">
      <PromoCodeForm />
    </ContentLayout>
  );
}
