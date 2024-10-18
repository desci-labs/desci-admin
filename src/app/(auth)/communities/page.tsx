import Communities from "@/components/organisms/Communities";
// import { ApiResponse, Community } from "@/lib/api";
// import { NODES_API_URL } from "@/lib/config";
// import { cookies } from "next/headers";

export default async function CommunityPage() {
  // const cookie = cookies().getAll();
  // console.log('cookies', cookie)
  // const response = await fetch(`${NODES_API_URL}/v1/admin/communities`, {
  //   headers: { 'cookie': cookies().toString()},
  //   credentials: "include",
  // });
  // console.log("get list", response.ok, response.status);
  // // if (response.ok) {
  // const json = (await response.json()) as ApiResponse<Community[]>;
  // const data = json.data;

  // console.log('COMMUNITY', data )
  return <Communities />;
}
