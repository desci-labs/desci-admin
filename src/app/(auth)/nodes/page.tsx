import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Node {
  id: string;
  name: string;
  status: "active" | "inactive";
}

const mockNodes: Node[] = [
  { id: "1", name: "Node 1", status: "active" },
  { id: "2", name: "Node 2", status: "inactive" },
];

export default function NodesTable() {
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
        {mockNodes.map((node) => (
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
