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

interface Doi {
  id: string;
  name: string;
  status: "active" | "inactive";
}
const mockDois: Doi[] = [
  { id: "1", name: "Doi 1", status: "active" },
  { id: "2", name: "Doi 2", status: "inactive" },
];

export default function DoiRecords() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["dois/list"],
    queryFn: getDois,
  });
  console.log("DOIs", { data, isLoading, isError });
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {mockDois.map((node) => (
          <TableRow key={node.id}>
            <TableCell>{node.name}</TableCell>
            <TableCell>{node.status}</TableCell>
            <TableCell>
              <div className="flex space-x-2">
                <Button size="sm">View</Button>
                <Button size="sm">Edit</Button>
                <Button size="sm" variant="destructive">
                  Delete
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
