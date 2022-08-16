import { assert } from "https://deno.land/std@0.146.0/testing/asserts.ts";
import client from "../lib/client.ts";
import getLeaderboards from "../lib/getLeaderboards.ts";

const rateMax = 400;
const parallelRequests = 10;

const { data } = await getLeaderboards(1);

if (!data) throw "Failed to load first page";
assert(data?.metadata, "Failed to load metadata");

const pages = Math.ceil(data.metadata.total / data.metadata.itemsPerPage);

for (let i = 0; i < pages / parallelRequests; ++i) {
  const pagesToFetch = Math.min(pages - i * parallelRequests, parallelRequests);
  await Promise.all(
    new Array(pagesToFetch).fill("").map(async (_i, n) => {
      const page = i * parallelRequests + n + 1;
      const { data } = await getLeaderboards(page);
      if (!data) return;

      console.table(data.leaderboards, ["songName", "levelAuthorName"]);
      await client.from("map").upsert(
        data.leaderboards.map((i) => ({
          data: i,
        }))
      );
    })
  );
}
