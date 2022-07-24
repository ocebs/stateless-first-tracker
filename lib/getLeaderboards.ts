import type { components as ScoreSaber } from "./types/scoresaber.ts";

type Leaderboards = ScoreSaber["schemas"]["LeaderboardInfoCollection"];

export default async function getLeaderboards(page = 1) {
  const url = new URL(`https://scoresaber.com/api/leaderboards`);
  const params = url.searchParams;
  params.set("ranked", "1");
  params.set("sort", "0");
  params.set("page", page.toString());

  console.debug(`getting page ${page}`);

  const response = await fetch(url);

  const result: { response: Response; data?: Leaderboards } = {
    response,
  };

  if (response.status == 200) {
    result.data = (await response.json()) as Leaderboards;
  }

  return result;
}
