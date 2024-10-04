import { DataTable } from "@/components/organisms/nodes-datatable/data-table";
import { tasks } from "@/components/organisms/nodes-datatable/data/tasks";
import { columns } from "@/components/organisms/nodes-datatable/columns";


export default function NodesPage() {
  return (
    <>
      <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0">
        <DataTable data={tasks} columns={columns} />
      </div>
    </>
  );
}
