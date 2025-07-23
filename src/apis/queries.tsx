import { NODES_API_URL } from "@/lib/config";
import { DoiRecord } from "./types";
import { apiRequest, ApiResponse } from "@/lib/api";

export async function getDois() {
  const response = await apiRequest<
    | {
        data: DoiRecord[];
        message: string;
      }
    | { message: string; data: never }
  >(`${NODES_API_URL}/v1/admin/doi/list`);

  console.log("[getDois]::", response);
  if (response?.["data"]) return response?.["data"];
  throw new Error(response.message);
}
