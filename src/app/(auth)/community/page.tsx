import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import Communities from "@/components/organisms/Communities";
import { getQueryClient } from "@/lib/get-query-client";

export default function CommunityPage() {
  const queryClient = getQueryClient()

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Communities />
    </HydrationBoundary>
  );
}
