"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import Nav from "./Nav";
import { sidelinks } from "@/data/navlinks";
import Link from "next/link";
import NodesLogo from "@/components/atoms/NodesLogo";
import { useGetLayout, useSetLayout } from "@/contexts/resizeable-panels";
import { LogOutIcon } from "lucide-react";
import { Layout, LayoutHeader } from "./Layout";
import { toast } from "sonner";

export default function Sidebar() {
  const router = useRouter();
  const { isOpen } = useGetLayout();
  const { collapse } = useSetLayout();

  return (
    <Layout fixed>
      <div className="flex flex-col space-y-2 h-full pb-4">
        {/* Desci logo  */}
        <LayoutHeader
          sticky
          className={cn(
            "flex items-center mb-2 mt-6",
            isOpen ? "md:px-4 justify-start" : "p-0 justify-center"
          )}
        >
          <Link
            href="/"
            shallow
            className="!outline-none !ring-0 !ring-offset-0 group"
          >
            <NodesLogo className="stroke-icon-neutral group-hover:stroke-icon-focus group-focus:stroke-icon-focus transition-colors" />
          </Link>
        </LayoutHeader>

        {/* Navigation links */}
        <Nav
          id="sidebar-menu"
          className={`z-40 h-full flex-1 overflow-auto ${
            !isOpen ? "max-h-screen" : "max-h-0 py-0 md:max-h-screen md:py-2"
          }`}
          closeNav={() => collapse()}
          isCollapsed={!isOpen}
          links={sidelinks}
        />

        {/* Logout button  */}
        <Button
          variant="default"
          className={cn(
            "justify-center text-red-500  hover:bg-red-500/30",
            isOpen ? "m-4 bg-red-500/20" : "m-.5 bg-transparent shadow-none"
          )}
          onClick={() => {
            toast.info('Signing out...')
            fetch("/api/logout", { method: "DELETE" }).then(() => {
              router.refresh();
            });
          }}
        >
          {isOpen ? "Sign out" : <LogOutIcon size={18} />}
        </Button>
      </div>
    </Layout>
  );
}
