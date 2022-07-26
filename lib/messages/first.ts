import type { components as ScoreSaber } from "../types/scoresaber.ts";
import type { DiscordMessage } from "https://deno.land/x/discordeno@13.0.0-rc45/types/discord.ts";
import difficultyColour from "./colours.ts";

const firstMessage = (
  { leaderboard, score }: ScoreSaber["schemas"]["PlayerScore"],
  oldScore?: ScoreSaber["schemas"]["Score"]
): Partial<DiscordMessage> => {
  const fields = [
    {
      name: `${leaderboard.songAuthorName} - ${leaderboard.songName} ${leaderboard.songSubName}`,
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
  ];
  if (oldScore)
    fields.push({
      name: "Second Place",
      value: [
        `**Set By**: [${oldScore.leaderboardPlayerInfo?.name}](https://scoresaber.com/u/${oldScore.leaderboardPlayerInfo?.id})`,
        `**Accuracy**: ${(
          ((oldScore.modifiedScore ?? 0) / leaderboard.maxScore) *
          100
        ).toFixed(2)}%`,
        `**PP**: ${oldScore.pp}`,
        `**Time Set**: <t:${new Date(oldScore.timeSet ?? 0).getTime() / 1000}>`,
      ].join("\n"),
    });
  return {
    embeds: [
      {
        title: `${score.leaderboardPlayerInfo?.name} set a new top OCE score`,

        image: { url: leaderboard.coverImage },
        url: `https://scoresaber.com/leaderboard/${leaderboard.id}?countries=au,nz`,
        thumbnail: {
          url:
            score.leaderboardPlayerInfo?.profilePicture ??
            "https://cdn.scoresaber.com/avatars/oculus.png",
        },
        timestamp: score.timeSet,
        fields,
        color: difficultyColour(leaderboard.difficulty.difficultyRaw),
      },
    ],
    components: [
      {
        type: 1,
        components: [
          {
            type: 2,
            style: 5,
            url: `https://scoresaber.com/u/${score.leaderboardPlayerInfo?.id}`,
            label: "Player Profile",
          },
          {
            type: 2,
            style: 5,
            url: `https://scoresaber.com/leaderboard/${leaderboard.id}?countries=AU,NZ`,
            label: "Full Leaderboard",
          },
        ],
      },
    ],
  };
};

export default firstMessage;
