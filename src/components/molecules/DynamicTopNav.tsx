import { sidelinks } from "@/data/navlinks";
import useCheckActiveNav from "@/hooks/use-check-active-nav";
import { useMemo } from "react";

export default function DynamicTopNav() {
  const { checkActiveNav } = useCheckActiveNav();

  const activeNav = useMemo(
    () =>
      sidelinks
        .map((nav) =>
          checkActiveNav(nav.href)
            ? nav.title
            : nav?.sub?.find((sub) => checkActiveNav(sub.href))?.title
        )
        .filter(Boolean)[0],
    [checkActiveNav]
  );
  return (
    <div className="mb-2 flex items-center justify-between space-y-2">
      <h1 className="text-2xl font-bold tracking-tight">{activeNav}</h1>
    </div>
  );
}
