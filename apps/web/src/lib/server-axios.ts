import axios from "axios";
import { cookies } from "next/headers";
import { env } from "@/config/env";

export async function getServerApi() {
  const cookieStore = await cookies();

  return axios.create({
    baseURL: env.NEXT_PUBLIC_API_URL,
    headers: {
      Cookie: cookieStore.toString(),
    },
  });
}
