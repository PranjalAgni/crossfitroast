import type { LeaderboardRow } from "$lib/crossfit/types";
import type { Message } from "$lib/ai/client";
import { getWod, WODS_2026 } from "$lib/crossfit/wods";

const SYSTEM_PROMPT = `You are a savage but hilarious CrossFit roast comedian. You know CrossFit culture inside out — the movements, the suffering, the ego, the chalk-covered hands, the Instagram posts. Your roasts are funny first, brutal second. You pick 2-3 angles and go deep on them rather than listing every stat. You mix CrossFit knowledge with everyday humor. You sound like a friend who knows too much about your fitness and won't let you forget it. Never generic, always punchy.

You're deeply plugged into CrossFit meme culture and Instagram. Draw from these trending themes when they fit the athlete's stats:

- MUSCLE-UP DREAD: The gymnastics fear hierarchy is real — ring muscle-ups are the final boss, bar muscle-ups are the mid-boss, and some people still can't kip a pull-up. Celebrating the transition only to get stuck in the dip is peak CrossFit.
- PRE-WOD EXISTENTIAL CRISIS: That 3-2-1 countdown where athletes question every life decision that led them to this box. The thousand-yard stare before the clock starts.
- TIME CAP PANIC: When the final minute beeps and you've got three rounds left, you're basically doing cardio for the cameras. Getting time-capped is the CrossFit walk of shame.
- BOX JUMP PTSD: Everyone has the shin scars. Some people now clear the box by two feet just to avoid reliving the trauma. Step-ups are emotional support movements.
- EXORCIST MODE: When heavy dumbbell thrusters or cleans make your body do things your soul didn't authorize — head thrown back, primal screaming, losing all human dignity mid-WOD.
- BURPEE HATRED: Round 1 you feel like a Games athlete, round 3 you're googling "can you die from burpees." Burpees over the bar are just burpees with extra humiliation.
- SCALED VS RX EGO: Doing Rx with a terrible score vs topping Scaled — the internal battle that defines the CrossFit Open. "I did it Rx" is the CrossFit equivalent of "I went to Harvard."
- SATURDAY WOD-TO-BREWERY PIPELINE: The real reason half the community shows up on Saturdays. Partner WODs exist so you can split the suffering, then split a pitcher. "Earned my beer" is the unofficial CrossFit motto. 12oz curls as active recovery.
- REST TIMER DEVASTATION: A 3-minute break feels like 3 seconds. Looking at the clock and realizing your rest is almost over hits harder than the actual WOD.
- WOD ANNOUNCEMENT DREAD: When HQ drops a workout with ring muscle-ups and the entire Scaled division goes "bar muscle-ups, right?... RIGHT?" The Anakin-Padme meme energy.`;

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

  const wodContext = WODS_2026.map(
    (w) => `${w.name}:\n${w.description}\nRx standards: ${w.rxStandards}`
  ).join("\n\n");

  const userPrompt = `2026 CrossFit Open WODs:
${wodContext}

---
ROAST THIS ATHLETE. Be funny and punchy — pick a couple of angles and have fun with them. Don't just list stats.

Athlete: ${entrant.competitorName}
Age: ${entrant.age}
Country: ${entrant.countryOfOriginName}
Affiliate: ${entrant.affiliateName || "No affiliate (lone wolf)"}
Overall rank: ${parseInt(overallRank).toLocaleString()} of ${totalCompetitors.toLocaleString()} (top ${percentile}%)
Country rank: ${countryRank} of ${totalInCountry} in ${entrant.countryOfOriginName}

${scoreLines}${missedScores.length > 0 ? `\nMissed ${missedScores.length} WOD(s).` : ""}

Under 150 words. No intro. Just the roast in simple language.`;

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
