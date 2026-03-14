import type { LeaderboardRow } from "$lib/crossfit/types";
import type { Message } from "$lib/ai/client";
import { getWod, WODS_2026 } from "$lib/crossfit/wods";

const SYSTEM_PROMPT = `You are a savage but hilarious CrossFit roast comedian. You know CrossFit culture inside out — the movements, the suffering, the ego, the chalk-covered hands, the Instagram posts. Your roasts are funny and brutal. You pick 2-3 angles and go deep on them rather than listing every stat. You mix CrossFit knowledge with everyday humor. You sound like a friend who knows too much about your fitness and won't let you forget it. Never generic, always punchy. Also keep language simple and easy to understand.`;

export function buildRoastMessages(
  athlete: LeaderboardRow,
  totalCompetitors: number,
  countryRank: number,
  totalInCountry: number
): Message[] {
  const { entrant, scores, overallRank } = athlete;

  const missedScores = scores.filter((s) => s.valid !== "1");
  const percentile = Math.round((1 - Number(overallRank) / totalCompetitors) * 100);

  const scoreLines = scores
    .map((s) => {
      const wod = getWod(s.ordinal);
      const wodName = wod ? wod.name : `WOD ${s.ordinal}`;

      if (s.valid !== "1") {
        return `${wodName}: NO SCORE SUBMITTED`;
      }

      const tier = s.scaled === "1" ? "Scaled" : s.scaled === "2" ? "Foundations" : "Rx";
      return `${wodName}: ${s.scoreDisplay} (${tier}, rank ${parseInt(s.rank).toLocaleString()} of ${totalCompetitors.toLocaleString()})${s.breakdown ? ` — ${s.breakdown}` : ""}`;
    })
    .join("\n");

  const wodContext = `2026 CrossFit Open WODs:\n${WODS_2026.map((w) => `${w.name}:\n${w.description}\nRx standards: ${w.rxStandards}`).join("\n\n")}\n\n---\n`;

  const userPrompt = `${wodContext}ROAST THIS ATHLETE. Be funny and punchy — pick a couple of angles and have fun with them. Don't just list stats.

Athlete: ${entrant.competitorName}
Age: ${entrant.age}
Country: ${entrant.countryOfOriginName}
Affiliate: ${entrant.affiliateName || "No affiliate (lone wolf)"}
Overall rank: ${parseInt(overallRank).toLocaleString()} of ${totalCompetitors.toLocaleString()} (top ${percentile}%)
Country rank: ${countryRank} of ${totalInCountry} in ${entrant.countryOfOriginName}

${scoreLines}${missedScores.length > 0 ? `\nMissed ${missedScores.length} WOD(s).` : ""}

Under 150 words. No intro. Just the roast in simple english language.`;

  return [
    {
      role: "system",
      content: SYSTEM_PROMPT,
    },
    {
      role: "user",
      content: userPrompt,
    },
  ];
}
