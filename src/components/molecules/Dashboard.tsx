"use client";

import { useState } from "react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import DoiRecords from "@/components/molecules/DoiRecords";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

interface Node {
  id: string;
  name: string;
  status: "active" | "inactive";
}

interface User {
  id: string;
  name: string;
  email: string;
}

const mockNodes: Node[] = [
  { id: "1", name: "Node 1", status: "active" },
  { id: "2", name: "Node 2", status: "inactive" },
];

const mockUsers: User[] = [
  { id: "1", name: "John Doe", email: "john@example.com" },
  { id: "2", name: "Jane Smith", email: "jane@example.com" },
];

function Sidebar({
  activeTab,
  setActiveTab,
}: {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}) {
  const router = useRouter();
  return (
    <div className="flex flex-col space-y-2 p-4 h-full">
      <div className="flex flex-col space-y-2 flex-1">
        {["Nodes", "Users", "DOIs", "Settings"].map((tab) => (
          <Button
            key={tab}
            variant={activeTab === tab ? "default" : "ghost"}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "justify-start text-txt-subdued",
              activeTab === tab
                ? "bg-btn-surface-primary-focus text-btn-surface-primary-foreground hover:bg-btn-surface-primary-focus"
                : "hover:bg-btn-surface-primary-neutral hover:text-txt-subdued"
            )}
          >
            {tab}
          </Button>
        ))}
      </div>
      <Button
        variant="default"
        className="justify-center text-red-500 bg-red-500/20 hover:bg-red-500/30"
        onClick={() => {
          fetch("/api/logout", { method: "DELETE" }).then(() => {
            router.push("/login");
          });
        }}
      >
        Logout
      </Button>
    </div>
  );
}

function NodesTable() {
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

function UsersTable() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {mockUsers.map((user) => (
          <TableRow key={user.id}>
            <TableCell>{user.name}</TableCell>
            <TableCell>{user.email}</TableCell>
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

function SettingsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <span>Theme</span>
        <Select>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select theme" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="light">Light</SelectItem>
            <SelectItem value="dark">Dark</SelectItem>
            <SelectItem value="system">System</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex items-center justify-between">
        <span>Language</span>
        <Select>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select language" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="en">English</SelectItem>
            <SelectItem value="es">Spanish</SelectItem>
            <SelectItem value="fr">French</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex items-center justify-between">
        <span>Notifications</span>
        <Switch />
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("Nodes");

  return (
    <PanelGroup direction="horizontal" className="w-full min-h-screen">
      <Panel defaultSize={20} minSize={15}>
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      </Panel>
      <PanelResizeHandle className="w-[3px] bg-gray-600 hover:bg-gray-500 transition-colors" />
      <Panel defaultSize={80} minSize={75}>
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-4">{activeTab}</h1>
          {activeTab === "Nodes" && <NodesTable />}
          {activeTab === "Users" && <UsersTable />}
          {activeTab === "Settings" && <SettingsPage />}
          {activeTab === "DOIs" && <DoiRecords />}
        </div>
      </Panel>
    </PanelGroup>
  );
}
