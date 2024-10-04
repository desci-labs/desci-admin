import { PropsWithChildren } from "react";
import PanelProvider from "./PanelProvider";
import ThemeContext from "@/app/ThemeProvider";

export default function Providers(props: PropsWithChildren<unknown>) {
  return (
    <ThemeContext>
      <PanelProvider>{props.children}</PanelProvider>
    </ThemeContext>
  );
}
