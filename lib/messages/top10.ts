import type { components as ScoreSaber } from "../types/scoresaber.ts";
import type { DiscordEmbed } from "https://deno.land/x/discordeno@13.0.0-rc45/types/discord.ts";
import difficultyColour from "./colours.ts";

const top10Message = ({
  leaderboard,
  score,
}: ScoreSaber["schemas"]["PlayerScore"]) => ({
  title: `${score.leaderboardPlayerInfo?.name} set a new top 10 global score`,
  image: { url: leaderboard.coverImage },
  url: `https://scoresaber.com/leaderboard/${leaderboard.id}?countries=au,nz`,
  thumbnail: {
    url:
      score.leaderboardPlayerInfo?.profilePicture ??
      "https://cdn.scoresaber.com/avatars/oculus.png",
  },
  timestamp: score.timeSet,
  fields: [
    {
      name: "Score",
      value: [
        `**Accuracy**: ${(
          ((score.modifiedScore ?? 0) / leaderboard.maxScore) *
          100
        ).toFixed(2)}%`,
        `**Rank**: #${score.rank}`,
        `**PP**: ${score.pp}`,
        `**Time Set**: <t:${new Date(score.timeSet).getTime() / 1000}>`,
      ].join("\n"),
    },
  ],
  color: difficultyColour(leaderboard.difficulty.difficultyRaw),
});

export default top10Message;
