import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { DialogProps } from "@radix-ui/react-dialog";

import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { useGetModal } from "@/contexts/ModalContext";
import { useMemo, useState } from "react";
import { Input } from "../ui/input";
import { tags } from "@/lib/tags";
import { NODES_API_URL } from "@/lib/config";
import { AnalyticsUser } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { LoaderCircleIcon } from "lucide-react";
import { formatDistanceToNow, format } from "date-fns";
import { Switch } from "../ui/switch";
import { Label } from "../ui/label";
import { Skeleton } from "../ui/skeleton";

interface Filters {
  email: string;
  orcid: boolean;
  publications: string;
  profileCreated: string;
}

const UserTable = ({
  filterByOrcid,
  data,
  isLoading,
}: {
  filterByOrcid: boolean;
  data: AnalyticsUser[];
  isLoading: boolean;
}) => {
  const [filters, setFilters] = useState<Filters>(() => ({
    email: "",
    orcid: filterByOrcid,
    publications: "",
    profileCreated: "",
  }));

  const filteredData = useMemo(() => {
    return data.filter((user) => {
      return (
        user.email.toLowerCase().includes(filters.email.toLowerCase()) &&
        (!filters.orcid || !!user?.orcid)
      );
    });
  }, [filters, data]);

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>
            <div className="space-y-2 mb-1">
              <div>Email</div>
              <Input
                placeholder="Filter email..."
                value={filters.email}
                onChange={(e) =>
                  setFilters({ ...filters, email: e.target.value })
                }
                className="h-8 "
              />
            </div>
          </TableHead>
          <TableHead>
            <div className="space-y-2">
              <p className="flex items-center gap-2">
                <img
                  src="/a-icon-orcid.svg"
                  className="w-5 h-5"
                  alt="orcid icon"
                />
                <span>ORCID</span>
              </p>
              <div className="flex items-center space-x-2">
                <Switch
                  id="orcid-filter"
                  checked={filters.orcid}
                  onCheckedChange={(checked) =>
                    setFilters({ ...filters, orcid: checked })
                  }
                />
                <Label
                  htmlFor="orcid-filter"
                  className="text-sm text-muted-foreground"
                >
                  Show only ORCID users
                </Label>
              </div>
            </div>
          </TableHead>
          <TableHead>
            <div className="space-y-2">
              <div>Publications</div>
              {/* <Input
                placeholder="Filter publications..."
                value={filters.publications}
                onChange={(e) => setFilters({ ...filters, publications: e.target.value })}
                className="h-8"
              /> */}
            </div>
          </TableHead>
          <TableHead>
            <div className="space-y-2">
              <div>Profile Created</div>
              {/* <Input
                placeholder="Filter date..."
                value={filters.profileCreated}
                onChange={(e) => setFilters({ ...filters, profileCreated: e.target.value })}
                className="h-8"
              /> */}
            </div>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {isLoading ? (
          [1, 2, 3, 4].map((row) => (
            <TableRow key={row}>
              <TableCell>
                {" "}
                <Skeleton className="w-full h-5" />
              </TableCell>
              <TableCell>
                {" "}
                <Skeleton className="w-full h-5" />
              </TableCell>
              <TableCell>
                {" "}
                <Skeleton className="w-full h-5" />
              </TableCell>
              <TableCell>
                <Skeleton className="w-full h-5" />
              </TableCell>
            </TableRow>
          ))
        ) : (
          <>
            {filteredData.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.orcid ?? "-"}</TableCell>
                <TableCell>{user.publications ?? "-"}</TableCell>
                <TableCell>
                  {user.dateJoined
                    ? format(new Date(user.dateJoined), "MMM yyyy")
                    : "-"}
                </TableCell>
              </TableRow>
            ))}
          </>
        )}
      </TableBody>
    </Table>
  );
};

export default function UserStatsModal(props: DialogProps) {
  const { active, extra } = useGetModal();
  const unit = extra?.filter?.unit;
  const value = extra?.filter.value;
  const orcid = extra?.filter.orcid;

  const { data: newUsers, isLoading } = useQuery({
    queryKey: [tags.users, `unit=${unit}&value=${value}`],
    queryFn: async ({}) => {
      const response = await fetch(
        `${NODES_API_URL}/v1/admin/analytics/new-users?unit=${unit}&value=${value}`,
        {
          credentials: "include",
        }
      );
      const json = (await response.json()) as { data: AnalyticsUser[] };
      return json?.data || null;
    },
    staleTime: 60 * 1000,
  });

  const { data: activeUsers, isLoading: isLoadingActiveUsers } = useQuery({
    queryKey: [tags.usersAnalytics, `unit=${unit}&value=${value}`],
    queryFn: async ({}) => {
      const response = await fetch(
        `${NODES_API_URL}/v1/admin/analytics/active-users?unit=${unit}&value=${value}`,
        {
          credentials: "include",
        }
      );
      const json = (await response.json()) as { data: AnalyticsUser[] };
      return json?.data || null;
    },
    staleTime: 60 * 1000,
  });

  return (
    <Dialog {...props}>
      <DialogContent className="w-full max-w-[900px]">
        <DialogHeader>
          <DialogTitle>
            {active === "active-users" ? "Active Users" : "New Users"}
          </DialogTitle>
          <DialogDescription>
            List of {active === "active-users" ? "Active Users" : "New Users"}{" "}
            {` In ${value} ${unit}`}
          </DialogDescription>
        </DialogHeader>
        {active === "new-users" && (
          <UserTable
            filterByOrcid={orcid}
            data={newUsers ?? []}
            isLoading={isLoading}
          />
        )}
        {active === "active-users" && (
          <UserTable
            filterByOrcid={orcid}
            data={activeUsers ?? []}
            isLoading={isLoadingActiveUsers}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
