export interface Wod {
  ordinal: number;
  name: string;
  description: string;
  rxStandards: string;
}

export const WODS_2026: Wod[] = [
  {
    ordinal: 1,
    name: "26.1",
    description: `For time (12 min cap):
20 wall-ball shots
18 box jump-overs
30 wall-ball shots
18 box jump-overs
40 wall-ball shots
18 medicine-ball box step-overs
66 wall-ball shots
18 medicine-ball box step-overs
40 wall-ball shots
18 box jump-overs
30 wall-ball shots
18 box jump-overs
20 wall-ball shots`,
    rxStandards: "♀ 14-lb ball, 9-ft target, 20-in box · ♂ 20-lb ball, 10-ft target, 24-in box",
  },
  {
    ordinal: 2,
    name: "26.2",
    description: `For time (15 min cap):
80-ft dumbbell overhead walking lunge
20 alternating dumbbell snatches
20 pull-ups
80-ft dumbbell overhead walking lunge
20 alternating dumbbell snatches
20 chest-to-bar pull-ups
80-ft dumbbell overhead walking lunge
20 alternating dumbbell snatches
20 muscle-ups`,
    rxStandards: "♀ 35-lb (15-kg) dumbbell · ♂ 50-lb (22.5-kg) dumbbell",
  },
  {
    ordinal: 3,
    name: "26.3",
    description: `For time (16 min cap):
2 rounds of:
  12 burpees over the bar
  12 cleans (weight 1)
  12 burpees over the bar
  12 thrusters (weight 1)
2 rounds of:
  12 burpees over the bar
  12 cleans (weight 2)
  12 burpees over the bar
  12 thrusters (weight 2)
2 rounds of:
  12 burpees over the bar
  12 cleans (weight 3)
  12 burpees over the bar
  12 thrusters (weight 3)`,
    rxStandards: "♀ 65/75/85 lb (29/34/38 kg) · ♂ 95/115/135 lb (43/52/61 kg)",
  },
];

export function getWod(ordinal: number): Wod | undefined {
  return WODS_2026.find((w) => w.ordinal === ordinal);
}
