export type Pagination = {
  currentPage: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
};

export type Transform = {
  scale: number;
  x: number;
  y: number;
};

export type PasswordResetState = "verifying" | "invalid" | "valid";

type BaseBreadcrumbItem = {
  label: string;
  icon?: React.ReactNode;
};

type LinkBreadcrumbItem = BaseBreadcrumbItem & {
  href: string;
  isCurrentPage?: boolean;
};

type CurrentPageBreadcrumbItem = BaseBreadcrumbItem & {
  href?: never;
  isCurrentPage: boolean;
};

type BreadcrumbItem = LinkBreadcrumbItem | CurrentPageBreadcrumbItem;
