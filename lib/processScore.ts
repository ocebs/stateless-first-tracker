import client from "./client.ts";
import firstMessage from "./messages/first.ts";
import top10Message from "./messages/top10.ts";
import type { components as ScoreSaber } from "./types/scoresaber.ts";
import { Channel } from "./webhook.ts";
import { sendMessage } from "./webhook.ts";

export default async function processScore(
  score: ScoreSaber["schemas"]["PlayerScore"]
) {
  if (
    !["AU", "NZ"].includes(
      score.score.leaderboardPlayerInfo?.country.toUpperCase() ?? ""
    ) ||
    !score.leaderboard.ranked
  )
    return;
  if (score.score.rank <= 10) {
    await sendMessage(Channel.top10, { message: top10Message(score) });
  }

  const leaderboardResponse = await fetch(
    `https://scoresaber.com/api/leaderboard/by-id/${score.leaderboard.id}/scores?countries=au,nz`
  );

  if (leaderboardResponse.status !== 200) return;
  const { scores } =
    (await leaderboardResponse.json()) as ScoreSaber["schemas"]["ScoreCollection"];

  if (score.score.modifiedScore === scores[0].modifiedScore) {
    await client.from("map").upsert({
      data: score.leaderboard,
      score: score.score,
    });
    client.rpc("update_firsts");
    sendMessage(Channel.first, { message: firstMessage(score) });
  }
}
