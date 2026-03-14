import { callAI } from "./client";
import { buildRoastMessages } from "$lib/prompts/roast";
import type { LeaderboardRow } from "$lib/crossfit/types";

export async function generateRoast(
  athlete: LeaderboardRow,
  totalCompetitors: number,
  countryRank: number,
  totalInCountry: number
): Promise<string> {
  const messages = buildRoastMessages(athlete, totalCompetitors, countryRank, totalInCountry);
  return callAI(messages);
}
