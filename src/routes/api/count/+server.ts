import { json } from "@sveltejs/kit";
import { redis } from "$lib/redis";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async () => {
  const count = (await redis.get<number>("roast_count")) ?? 0;
  return json({ count: count + 17 });
};
