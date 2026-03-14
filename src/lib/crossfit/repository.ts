import type { AthleteSearchResult, AthleteLeaderboardData } from "./types";

const BASE_SEARCH = "https://c3po.crossfit.com/api/competitions/v1/athletes/search";
const BASE_LEADERBOARD =
  "https://c3po.crossfit.com/api/leaderboards/v2/competitions/open/2026/leaderboards";
const YEAR = 2026;

export async function searchAthletes(term: string): Promise<AthleteSearchResult[]> {
  const url = `${BASE_SEARCH}?term=${encodeURIComponent(term)}&competition_type=open&competition_year=${YEAR}&unique_athletes=false`;
  const res = await fetch(url);
  if (!res.ok) return [];
  return res.json();
}

export async function getAthleteLeaderboard(
  athleteId: number,
  division: string
): Promise<AthleteLeaderboardData | null> {
  const globalUrl = `${BASE_LEADERBOARD}?view=0&division=${division}&region=0&athlete=${athleteId}`;
  const res = await fetch(globalUrl);
  if (!res.ok) return null;

  const data = await res.json();
  const athlete = data.leaderboardRows?.find(
    (row: { ui: { highlight: boolean } }) => row.ui.highlight === true
  );

  if (!athlete) return null;

  const countryCode = athlete.entrant.countryOfOriginCode;
  const countryUrl = `${BASE_LEADERBOARD}?view=0&division=${division}&region=0&athlete=${athleteId}&country=${countryCode}`;
  const countryRes = await fetch(countryUrl);
  const countryData = countryRes.ok ? await countryRes.json() : null;
  const countryRow = countryData?.leaderboardRows?.find(
    (row: { ui: { highlight: boolean } }) => row.ui.highlight === true
  );

  return {
    athlete,
    totalCompetitors: data.pagination?.totalCompetitors ?? 0,
    countryRank: countryRow ? Number(countryRow.overallRank) : 0,
    totalInCountry: countryData?.pagination?.totalCompetitors ?? 0,
    ordinals: data.ordinals ?? [],
  };
}
