import ThemeSwitch from "@/components/atoms/ThemeSwitch";
import { Layout, LayoutHeader, LayoutBody } from "@/components/custom/Layout";
import Dashboard from "@/components/molecules/Dashboard";
import { TopNav } from "@/components/molecules/TopNav";
import { UserNav } from "@/components/molecules/UserNav";

export default function Home() {
  return <Dashboard />;
}

const topNav = [
  {
    title: "Overview",
    href: "dashboard/overview",
    isActive: true,
  },
  {
    title: "Customers",
    href: "dashboard/customers",
    isActive: false,
  },
  {
    title: "Products",
    href: "dashboard/products",
    isActive: false,
  },
  {
    title: "Settings",
    href: "dashboard/settings",
    isActive: false,
  },
];
