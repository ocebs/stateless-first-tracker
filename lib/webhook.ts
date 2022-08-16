import type { DiscordMessage } from "https://deno.land/x/discordeno@13.0.0-rc45/types/discord.ts";
import { assertExists } from "https://deno.land/std@0.146.0/testing/asserts.ts";

const { TOP_10_URL, FIRST_TRACKER_URL } = Deno.env.toObject();
assertExists(TOP_10_URL, "Missing top 10 URL");
assertExists(FIRST_TRACKER_URL, "Missing first tracker URL");

export enum Channel {
  first,
  top10,
}

export const sendMessage = (
  channel: Channel,
  {
    message,
  }: {
    message: Partial<DiscordMessage>;
  }
) => {
  const body = JSON.stringify(message);

  return fetch(channel == Channel.first ? FIRST_TRACKER_URL : TOP_10_URL, {
    method: "post",
    headers: {
      "content-type": "application/json",
    },
    body,
  });
};
