import { PropsWithChildren } from "react";
import PanelProvider from "./PanelProvider";
import ThemeContext from "@/app/ThemeProvider";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient } from "@/lib/get-query-client";
import ModalProvider from "./ModalProvider";
import FilterProvider from "./FilterProvider";

export default function Providers(props: PropsWithChildren<unknown>) {
  const queryClient = getQueryClient();

  return (
    // <ThemeContext>
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ModalProvider>
        <PanelProvider>
          <FilterProvider>{props.children}</FilterProvider>
        </PanelProvider>
      </ModalProvider>
    </HydrationBoundary>
    // </ThemeContext>
  );
}
