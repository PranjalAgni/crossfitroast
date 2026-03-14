import { json } from "@sveltejs/kit";
import { getAthleteLeaderboard } from "$lib/crossfit/repository";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async ({ params, url }) => {
  const division = url.searchParams.get("division") ?? "1";
  const data = await getAthleteLeaderboard(Number(params.id), division);
  if (!data) return json(null, { status: 404 });
  return json(data);
};
