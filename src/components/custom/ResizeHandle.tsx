import { useGetLayout, useSetLayout } from "@/contexts/resizeable-panels";
import { Button } from "../ui/button";
import { IconChevronsLeft } from "@tabler/icons-react";

function ResizeHandle() {
  const { expand, collapse } = useSetLayout();
  const { isOpen } = useGetLayout();
  return (
    <>
    {/* <div className="absolute w-2 h-full top-13 z-40 group">
      <div className="absolute h-full w-full left-0 top-0 rounded bg-transparent group-hover:bg-slate-a3 group-active:bg-slate-a5 transition-all" />  
    </div> */}
    <Button
        onClick={() => (isOpen ? collapse() : expand())}
        size="icon"
        variant="outline"
        className="absolute -right-4 top-1/2 z-[999] hidden rounded-full md:inline-flex"
      >
        <IconChevronsLeft
          stroke={1.5}
          className={`h-5 w-5 ${isOpen ? "" : "rotate-180"}`}
        />
      </Button>
    </>
  );
}

export default ResizeHandle;

export function MiniResizeHandle(props: { hide?: boolean }) {
  return (
    <div className="w-2 h-full top-0 z-40 bg-transparent hover:bg-slate-a3 active:bg-slate-a5 transition-all relative right-0 group border-l border-slate-5">
      <div className="transition-all absolute h-full w-2 left-2 top-0 bg-transparent"></div>
      {/* <div
                className={cn(
                    "w-2 transition-all absolute right-0 top-2 z-40 bg-slate-a5 h-8 rounded-full",
                    props.hide && "bg-transparent"
                )}
            /> */}
    </div>
  );
}
