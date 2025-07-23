"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { getDois } from "@/apis/queries";
import Link from "next/link";
import { ExternalLinkIcon } from "@radix-ui/react-icons";
import { Loader2Icon } from "lucide-react";
import { DPID_RESOLVER_URL } from "@/lib/config";

export default function DoiRecords() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["dois/list"],
    queryFn: getDois,
  });

  if (isLoading) {
    return (
      <div className="min-h-72 w-96  flex items-center justify-center mx-auto container">
        <Loader2Icon className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>DOI</TableHead>
          <TableHead>DPID</TableHead>
          <TableHead>UUID</TableHead>
          <TableHead>Registered At</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data?.map((record) => (
          <TableRow key={record.id}>
            <TableCell>{record.id}</TableCell>
            <TableCell>
              <h5 className="w-fit text-sm bg-space-cadet text-btn-txt-primary-neutral uppercase tracking-widest px-2.5 py-0.5 border rounded-full">
                {record.doi}
              </h5>
            </TableCell>
            <TableCell>
              <h5 className="w-fit text-sm bg-btn-surface-primary-neutral text-btn-txt-primary-neutral uppercase tracking-widest px-2.5 py-0.5 border border-btn-border-primary-neutral rounded-full">
                DPID://{record.dpid}
              </h5>
            </TableCell>
            <TableCell>{record.uuid}</TableCell>
            <TableCell>{new Date(record.createdAt).toDateString()}</TableCell>
            <TableCell>
              <div className="flex space-x-2 justify-end">
                <Link
                  href={`https://doi.org/${record.doi}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 bg-btn-surface-primary-neutral text-btn-txt-primary-neutral rounded-md text-xs"
                >
                  View Doi
                </Link>
                <Button
                  variant="link"
                  size="sm"
                  className="flex items-center gap-1"
                  onClick={() => {
                    window.open(
                      `${DPID_RESOLVER_URL}/${record.dpid}`,
                      "_blank",
                      "noopener"
                    );
                  }}
                >
                  <span> View Node</span>
                  <ExternalLinkIcon className="w-3 h-3" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
