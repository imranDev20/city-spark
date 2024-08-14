import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getTemplates } from "../actions";
import TemplateTableRow from "./template-table-row";
import TableEmpty from "@/components/custom/table-empty";

export default async function TemplateList() {
  const templates = await getTemplates();

  return (
    <>
      <Card className="min-h-[calc(100vh-320px)] h-full flex flex-col justify-between">
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[60%]">Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden md:table-cell">
                  Created at
                </TableHead>
                <TableHead className="w-10">
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>

            {templates.length > 0 ? (
              <TableBody>
                {templates.map((template) => (
                  <TemplateTableRow key={template.id} template={template} />
                ))}
              </TableBody>
            ) : (
              <TableEmpty colSpan={4} />
            )}
          </Table>
        </CardContent>

        {templates.length > 0 && (
          <CardFooter>
            <div className="text-xs text-muted-foreground">
              Showing <strong>1-10</strong> of <strong>32</strong> templates
            </div>
          </CardFooter>
        )}
      </Card>
    </>
  );
}
