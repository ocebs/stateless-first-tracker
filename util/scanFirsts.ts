import client from "../lib/client.ts";
import type { components as ScoreSaber } from "../lib/types/scoresaber.ts";

const parallelRequests = 10;

const { data: maps } = await client
  .from<{
    data: ScoreSaber["schemas"]["LeaderboardInfo"];
    scoreData?: {
      data: ScoreSaber["schemas"]["Score"];
    };
  }>("map")
  .select();

if (!maps) throw "Failed to load map list";

while (maps.length > 0) {
  let remaining = Infinity;
  let reset = 0;
  console.log(maps.length);

  const rows = await Promise.all(
    maps.splice(0, parallelRequests).map(async ({ data }) => {
      const leaderboardURL = new URL(
        `https://scoresaber.com/api/leaderboard/by-id/${data.id}/scores?countries=AU,NZ`
      );
      const response = await fetch(leaderboardURL);
      remaining = Math.min(
        remaining,
        parseInt(response.headers.get("x-ratelimit-remaining") ?? "0")
      );
      reset = Math.max(
        reset,
        parseInt(response.headers.get("x-ratelimit-reset") ?? "0")
      );
      if (response.status == 404) return null;
      if (response.status !== 200) {
        throw response;
      }
      const {
        scores: [first],
      } = (await response.json()) as ScoreSaber["schemas"]["ScoreCollection"];
      if (!first) return null;

      return { data, scoreData: first };
    })
  );

  await client
    .from<{
      data: ScoreSaber["schemas"]["LeaderboardInfo"];
      scoreData?: {
        data: ScoreSaber["schemas"]["Score"];
      };
    }>("map")
    // @ts-ignore typescript doesn't understand how the filter function works
    .upsert(rows.filter((i) => i !== null));

  if (remaining < 50)
    await new Promise((resolve) => {
      const remaining = reset * 1000 - Date.now();

      console.log(`Waiting ${Math.round(remaining / 1000)} seconds`);

      setTimeout(resolve, remaining);
    });
}

// for (let i = 0; i < maps.length / parallelRequests; ++i) {
//   const pagesToFetch = Math.min(maps.length - i * parallelRequests, parallelRequests);
//   await Promise.all(
//     new Array(pagesToFetch).fill("").map(async (_i, n) => {
//       const page = i * parallelRequests + n + 1;
//       const { data } = await getLeaderboards(page);
//       if (!data) return;

//       console.table(data.leaderboards, ["songName", "levelAuthorName"]);
//       await client.from("map").upsert(
//         data.leaderboards.map((i) => ({
//           data: i,
//         }))
//       );
//     })
//   );
// }
