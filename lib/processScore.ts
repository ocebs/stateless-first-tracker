import top10Message from "./messages/top10.ts";
import type { components as ScoreSaber } from "./types/scoresaber.ts";
import { Channel } from "./webhook.ts";
import { sendMessage } from "./webhook.ts";

export default async function processScore(
  score: ScoreSaber["schemas"]["PlayerScore"]
) {
  if (score.score.rank <= 10) {
    await sendMessage(Channel.top10, [top10Message(score)]);
  }
}
