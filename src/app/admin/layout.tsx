import QueryProvider from "@/providers/query-provider";
import AdminPanelLayout from "./_components/admin-panel-layout";
import AdminTopLoader from "./_components/admin-top-loader";

export default function DemoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <QueryProvider>
      <AdminPanelLayout>
        <AdminTopLoader />
        {children}
      </AdminPanelLayout>
    </QueryProvider>
  );
}
