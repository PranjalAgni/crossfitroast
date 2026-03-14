export interface AthleteSearchResult {
  id: number;
  name: string;
  first_name: string;
  last_name: string;
  gender: string;
  affiliate: string;
  division_name: string;
  division_id: number;
  competition_record_id: number;
}

export interface Score {
  ordinal: number;
  rank: string;
  score: string;
  valid: string;
  scoreDisplay: string;
  scaled: string;
  breakdown: string;
}

export interface Entrant {
  competitorId: string;
  competitorName: string;
  firstName: string;
  lastName: string;
  gender: string;
  countryOfOriginCode: string;
  countryOfOriginName: string;
  countryFlag: string;
  regionName: string;
  divisionId: string;
  affiliateId: string;
  affiliateName: string;
  age: string;
}

export interface LeaderboardRow {
  overallRank: string;
  overallScore: string;
  entrant: Entrant;
  scores: Score[];
  ui: { highlight: boolean; countryChampion: boolean };
}

export interface AthleteLeaderboardData {
  athlete: LeaderboardRow;
  totalCompetitors: number;
  countryRank: number;
  totalInCountry: number;
  ordinals: { ordinal: string; columnName: string }[];
}
