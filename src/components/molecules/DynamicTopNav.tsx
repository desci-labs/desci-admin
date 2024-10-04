import { sidelinks } from "@/data/navlinks";
import useCheckActiveNav from "@/hooks/use-check-active-nav";
import { usePathname } from "next/navigation";
import { useMemo } from "react";

export default function DynamicTopNav() {
  const pathname = usePathname();
  const { checkActiveNav } = useCheckActiveNav();
//   console.log("Active nav", pathname, checkActiveNav(pathname));

  const activeNav = useMemo(() => sidelinks.find(nav => checkActiveNav(nav.href)), [checkActiveNav])
  return (
    <div className="mb-2 flex items-center justify-between space-y-2">
      <h1 className="text-2xl font-bold tracking-tight">{activeNav?.title}</h1>
      {/* <div className="flex items-center space-x-2">
      <Button>Download</Button>
    </div> */}
    </div>
  );
}
