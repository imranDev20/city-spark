import { Prisma } from "@prisma/client";

export type CategoryWithRelations = Prisma.CategoryGetPayload<{
  include: {
    primaryChildCategories?: true;
    parentPrimaryCategory?: true;
    parentSecondaryCategory?: true;
    parentTertiaryCategory?: true;
    primaryProducts?: true;
    secondaryChildCategories?: true;
    secondaryProducts?: true;
    tertiaryChildCategories?: true;
    tertiaryProducts?: true;
    quaternaryProducts?: true;
  };
}>;
