import type { components as ScoreSaber } from "./types/scoresaber.ts";
export default async function getMap(id: number) {
  const [scoresResponse, infoResponse] = await Promise.all([
    fetch(
      `https://scoresaber.com/api/leaderboard/by-id/${id}/scores?countries=AU,NZ`
    ),
    fetch(
      `https://scoresaber.com/api/leaderboard/by-id/${id}/info?countries=AU,NZ`
    ),
  ]);

  if (infoResponse.status !== 200) return infoResponse;

  const scores =
    scoresResponse.status == 200
      ? (
          (await scoresResponse.json()) as ScoreSaber["schemas"]["ScoreCollection"]
        ).scores
      : null;

  const info =
    (await infoResponse.json()) as ScoreSaber["schemas"]["LeaderboardInfo"];

  if (!info.ranked) return false;

  return {
    info,
    scores,
  };
}
