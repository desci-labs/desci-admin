import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { Row } from "@tanstack/react-table";

import { LoaderButton } from "@/components/custom/LoaderButton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { labels } from "./data/data";
import { userSchema } from "./data/schema";
import { useMutation } from "@tanstack/react-query";
import { toggleUserRole } from "@/lib/api";
import { getQueryClient } from "@/lib/get-query-client";
import { tags } from "@/lib/tags";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const queryClient = getQueryClient();
  const user = userSchema.parse(row.original);
  const isAdmin = user.isAdmin;

  const toggleRoleMutation = useMutation({
    mutationFn: toggleUserRole,
  });

  const toggleRole = (id: number) => {
    toggleRoleMutation.mutate(
      {
        userId: id,
      },
      {
        onSuccess() {
          queryClient.invalidateQueries({ queryKey: [tags.users] });
        },
      }
    );
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <LoaderButton
          variant="ghost"
          className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
        >
          <DotsHorizontalIcon className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </LoaderButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[200px]">
        <DropdownMenuItem disabled>Edit</DropdownMenuItem>
        <DropdownMenuItem onClick={() => toggleRole(user.id)} className="cursor-pointer">
          <span>
            {isAdmin ? "Revoke admin privileges" : "Grant admin privileges"}
          </span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem disabled>
          Delete
          <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
