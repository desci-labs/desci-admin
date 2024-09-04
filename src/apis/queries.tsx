import { NODES_API_URL } from "@/lib/config";
import { DoiRecord } from "./types";

export async function getDois() {
  const response = await fetch(`${NODES_API_URL}/v1/admin/doi/list`, {
    credentials: "include",
  });

  const data = (await response.json()) as
    | {
        data: DoiRecord[];
        message: string;
      }
    | { message: string };

  if (response.status === 200 && "data" in data) {
    return data.data;
  }

  throw new Error(data?.message);
}
