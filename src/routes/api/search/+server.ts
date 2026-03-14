import { json } from "@sveltejs/kit";
import { searchAthletes } from "$lib/crossfit/repository";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async ({ url }) => {
  const term = url.searchParams.get("term") ?? "";
  if (term.length < 2) return json([]);
  const results = await searchAthletes(term);
  return json(results);
};
