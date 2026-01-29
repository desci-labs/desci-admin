import { Cross2Icon } from "@radix-ui/react-icons";
import { Table } from "@tanstack/react-table";
import { useState } from "react";
import { toast } from "sonner";

import { Input } from "@/components/ui/input";
import { DataTableViewOptions } from "./data-table-view-options";
import { Button } from "@/components/ui/button";
import { DownloadIcon, FileTextIcon, FileSpreadsheetIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { priorities, roles, statuses } from "./data/data";
import { DataTableFacetedFilter } from "./data-table-faceted-filter";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;
  const [isExporting, setIsExporting] = useState(false);
  const [exportingFormat, setExportingFormat] = useState<string>("");
  const [isExportingSciweave, setIsExportingSciweave] = useState(false);
  const [exportingSciweaveFormat, setExportingSciweaveFormat] =
    useState<string>("");

  const handleExportMarketingEmails = async (
    format: "csv" | "xls" | "xlsx" = "csv"
  ) => {
    try {
      setIsExporting(true);
      setExportingFormat(format);

      const response = await fetch(
        `/api/export-marketing-consent?format=${format}`,
        {
          credentials: "include",
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || "Failed to export marketing emails"
        );
      }

      const blob = await response.blob();
      const fileURL = URL.createObjectURL(blob);

      const downloadLink = document.createElement("a");
      downloadLink.href = fileURL;
      downloadLink.download = `marketing-consent-emails.${
        format === "csv" ? "csv" : format === "xls" ? "xls" : "xlsx"
      }`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      URL.revokeObjectURL(fileURL);

      // Success notification
      const formatName =
        format === "csv"
          ? "CSV"
          : format === "xls"
          ? "Excel (.xls)"
          : "Excel (.xlsx)";
      toast.success(`Marketing emails exported successfully as ${formatName}`, {
        description: "The file has been downloaded to your device.",
      });
    } catch (error) {
      console.error("Error exporting marketing emails:", error);

      // Error notification
      toast.error("Failed to export marketing emails", {
        description:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred. Please try again.",
      });
    } finally {
      setIsExporting(false);
      setExportingFormat("");
    }
  };

  const handleExportSciweaveMarketingEmails = async (
    format: "csv" | "xls" | "xlsx" = "csv"
  ) => {
    try {
      setIsExportingSciweave(true);
      setExportingSciweaveFormat(format);

      const response = await fetch(
        `/api/export-sciweave-marketing-consent?format=${format}`,
        {
          credentials: "include",
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || "Failed to export Sciweave marketing emails"
        );
      }

      const blob = await response.blob();
      const fileURL = URL.createObjectURL(blob);

      const downloadLink = document.createElement("a");
      downloadLink.href = fileURL;
      downloadLink.download = `sciweave-marketing-consent-emails.${
        format === "csv" ? "csv" : format === "xls" ? "xls" : "xlsx"
      }`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      URL.revokeObjectURL(fileURL);

      // Success notification
      const formatName =
        format === "csv"
          ? "CSV"
          : format === "xls"
          ? "Excel (.xls)"
          : "Excel (.xlsx)";
      toast.success(
        `Sciweave marketing emails exported successfully as ${formatName}`,
        {
          description: "The file has been downloaded to your device.",
        }
      );
    } catch (error) {
      console.error("Error exporting Sciweave marketing emails:", error);

      // Error notification
      toast.error("Failed to export Sciweave marketing emails", {
        description:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred. Please try again.",
      });
    } finally {
      setIsExportingSciweave(false);
      setExportingSciweaveFormat("");
    }
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 flex-col-reverse items-start gap-y-2 sm:flex-row sm:items-center sm:space-x-2">
        <Input
          placeholder="Filter users..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) => {
            table.getColumn("name")?.setFilterValue(event.target.value);
          }}
          className="h-8 w-[250px] lg:h-10 lg:w-[350px]"
        />
        <div className="flex gap-x-2">
          {table.getColumn("isAdmin") && (
            <DataTableFacetedFilter
              column={table.getColumn("isAdmin")}
              title="Role"
              options={roles}
            />
          )}
          {/* {table.getColumn('priority') && (
            <DataTableFacetedFilter
              column={table.getColumn('priority')}
              title='Priority'
              options={priorities}
            />
          )} */}
        </div>
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <Cross2Icon className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              disabled={isExporting}
              className="h-8 px-2 lg:px-3"
            >
              <DownloadIcon className="mr-2 h-4 w-4" />
              {isExporting
                ? `Exporting ${exportingFormat.toUpperCase()}...`
                : "Export Marketing Emails"}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <DropdownMenuItem
                    onClick={() => handleExportMarketingEmails("csv")}
                    className="flex items-center gap-2"
                  >
                    <FileTextIcon className="h-4 w-4" />
                    <span>Export as CSV</span>
                    <span className="ml-auto text-xs text-muted-foreground">
                      Default
                    </span>
                  </DropdownMenuItem>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Comma-separated values format</p>
                  <p className="text-xs text-muted-foreground">
                    Best for data analysis and import
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <DropdownMenuSeparator />
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <DropdownMenuItem
                    onClick={() => handleExportMarketingEmails("xlsx")}
                    className="flex items-center gap-2"
                  >
                    <FileSpreadsheetIcon className="h-4 w-4" />
                    <span>Export as Excel (.xlsx)</span>
                    <span className="ml-auto text-xs text-muted-foreground">
                      Modern
                    </span>
                  </DropdownMenuItem>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Modern Excel format</p>
                  <p className="text-xs text-muted-foreground">
                    Best for Excel 2007+ and Google Sheets
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <DropdownMenuItem
                    onClick={() => handleExportMarketingEmails("xls")}
                    className="flex items-center gap-2"
                  >
                    <FileSpreadsheetIcon className="h-4 w-4" />
                    <span>Export as Excel (.xls)</span>
                    <span className="ml-auto text-xs text-muted-foreground">
                      Legacy
                    </span>
                  </DropdownMenuItem>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Legacy Excel format</p>
                  <p className="text-xs text-muted-foreground">
                    Compatible with older Excel versions
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              disabled={isExportingSciweave}
              className="h-8 px-2 lg:px-3"
            >
              <DownloadIcon className="mr-2 h-4 w-4" />
              {isExportingSciweave
                ? `Exporting ${exportingSciweaveFormat.toUpperCase()}...`
                : "Export Sciweave Marketing Emails"}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <DropdownMenuItem
                    onClick={() => handleExportSciweaveMarketingEmails("csv")}
                    className="flex items-center gap-2"
                  >
                    <FileTextIcon className="h-4 w-4" />
                    <span>Export as CSV</span>
                    <span className="ml-auto text-xs text-muted-foreground">
                      Default
                    </span>
                  </DropdownMenuItem>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Comma-separated values format</p>
                  <p className="text-xs text-muted-foreground">
                    Best for data analysis and import
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <DropdownMenuSeparator />
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <DropdownMenuItem
                    onClick={() => handleExportSciweaveMarketingEmails("xlsx")}
                    className="flex items-center gap-2"
                  >
                    <FileSpreadsheetIcon className="h-4 w-4" />
                    <span>Export as Excel (.xlsx)</span>
                    <span className="ml-auto text-xs text-muted-foreground">
                      Modern
                    </span>
                  </DropdownMenuItem>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Modern Excel format</p>
                  <p className="text-xs text-muted-foreground">
                    Best for Excel 2007+ and Google Sheets
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <DropdownMenuItem
                    onClick={() => handleExportSciweaveMarketingEmails("xls")}
                    className="flex items-center gap-2"
                  >
                    <FileSpreadsheetIcon className="h-4 w-4" />
                    <span>Export as Excel (.xls)</span>
                    <span className="ml-auto text-xs text-muted-foreground">
                      Legacy
                    </span>
                  </DropdownMenuItem>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Legacy Excel format</p>
                  <p className="text-xs text-muted-foreground">
                    Compatible with older Excel versions
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </DropdownMenuContent>
        </DropdownMenu>
        <DataTableViewOptions table={table} />
      </div>
    </div>
  );
}
