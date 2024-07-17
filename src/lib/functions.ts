import { FileState } from "@/app/admin/products/_components/product-image-uploader";
import { Image } from "@prisma/client";

export async function urlToFileState(image: Image): Promise<FileState> {
  const response = await fetch(image.url);
  const blob = await response.blob();

  return {
    file: new File([blob], image?.name || "", {
      type: blob.type,
      lastModified: image.lastModified || 0,
    }),
    progress: "COMPLETE",
    key: image.id,
  };
}
