import ThemeSwitch from "@/components/atoms/ThemeSwitch";
import { Layout, LayoutHeader, LayoutBody } from "@/components/custom/Layout";
import Analysis from "@/components/molecules/Analysis";
import { TopNav } from "@/components/molecules/TopNav";
import { UserNav } from "@/components/molecules/UserNav";
import { redirect } from "next/navigation";

// async function checkIsAuthorized(): Promise<boolean> {
//   const response = await fetch(
//     `${process.env.NEXT_PUBLIC_API_URL}/v1/auth/check`,
//     {
//       cache: "no-store",
//       credentials: "include",
//     }
//   );

//   console.log("check auth", response.status);
//   if (response.status === 401) {
//     // logout before redirect
//     await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/logout`, {
//       method: "delete",
//       credentials: "include",
//     });

//     // return redirect("/login");
//   }

//   return true;
// }

export default async function Home() {
  return <Analysis />;
}
