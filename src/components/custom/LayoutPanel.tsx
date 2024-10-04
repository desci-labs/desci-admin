"use client";

import { PropsWithChildren } from "react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import Sidebar from "./Sidebar";
import ResizeHandle from "./ResizeHandle";
import { useGetLayout, useSetLayout } from "@/contexts/resizeable-panels";
import ThemeSwitch from "@/components/atoms/ThemeSwitch";
import { Layout, LayoutHeader, LayoutBody } from "@/components/custom/Layout";
import { UserNav } from "@/components/molecules/UserNav";
import DynamicTopNav from "../molecules/DynamicTopNav";

export default function LayoutPanel({ children }: PropsWithChildren<unknown>) {
  const { attachHandle, onResize } = useSetLayout();
  const { minSize, maxSize } = useGetLayout();

  return (
    <div className="overflow-y-hidden">
    <PanelGroup
      direction="horizontal"
      className="w-full min-h-screen h-full max-h-screen overflow-hidden bg-background"
    >
      <Panel
        collapsible
        defaultSize={maxSize}
        collapsedSize={minSize}
        minSize={minSize}
        onResize={onResize}
        ref={attachHandle}
        className="transition-[width] max-h-screen"
      >
        <Sidebar />
      </Panel>
      <PanelResizeHandle className="w-[1px] bg-gray-300 hover:bg-gray-100 transition-colors relative">
        <ResizeHandle />
      </PanelResizeHandle>
      <Panel
        defaultSize={100 - minSize}
        minSize={100 - maxSize}
        className="overflow-x-hidden"
      >
        <Layout className="min-h-screen flex-col items-center justify-between p-0 m-0">
          <LayoutHeader sticky>
            <DynamicTopNav />
            <div className="ml-auto flex items-center space-x-4">
              {/* <Search /> */}
              <ThemeSwitch />
              <UserNav />
            </div>
          </LayoutHeader>
          <LayoutBody>{children}</LayoutBody>
        </Layout>
      </Panel>
    </PanelGroup>
    </div>
  );
}
