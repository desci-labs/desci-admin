import { NODES_API_URL } from "@/lib/config";

export async function getDois() {
  const response = await fetch(`${NODES_API_URL}/v1/admin/doi/list`);
  console.log("DOIs", response);
  return response.json();
}
