import { DataTable } from "@/components/organisms/users-datatable/data-table";
import { tasks } from "@/components/organisms/users-datatable/data/tasks";
import { columns } from "@/components/organisms/users-datatable/columns";

interface User {
  id: string;
  name: string;
  email: string;
}
const mockUsers: User[] = [
  { id: "1", name: "John Doe", email: "john@example.com" },
  { id: "2", name: "Jane Smith", email: "jane@example.com" },
];

export default function UsersTable() {
  return (
    <>
      <div className="mb-2 flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Welcome back!</h2>
          <p className="text-muted-foreground">
            Here&apos;s a list of your tasks for this month!
          </p>
        </div>
      </div>
      <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0">
        <DataTable data={tasks} columns={columns} />
      </div>
    </>
  );
}
