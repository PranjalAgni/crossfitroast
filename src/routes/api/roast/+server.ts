import { json } from "@sveltejs/kit";
import { generateRoast } from "$lib/ai/roastService";
import type { RequestHandler } from "./$types";

export const POST: RequestHandler = async ({ request }) => {
  const { athlete, totalCompetitors, countryRank, totalInCountry } = await request.json();
  const roast = await generateRoast(athlete, totalCompetitors, countryRank, totalInCountry);
  return json({ roast });
};
