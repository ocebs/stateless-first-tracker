import type { components as ScoreSaber } from "./types/scoresaber.ts";
import processScore from "./processScore.ts";

interface Message<N, T> {
  commandName: N;
  commandData: T;
}

type ScoreMessage = Message<"score", ScoreSaber["schemas"]["PlayerScore"]>;

export const isScoreMessage = (
  message: Message<unknown, unknown>
): message is ScoreMessage => message.commandName === "score";

export default function monitorRealtimeScores() {
  const socket = new WebSocket("wss://scoresaber.com/ws");

  socket.onmessage = (event) => {
    if (event.data === "Connected to the ScoreSaber WSS")
      return console.log(event.data);
    try {
      const message = JSON.parse(event.data);
      if (!isScoreMessage(message)) return;
      processScore(message.commandData);
    } catch (err) {
      console.error(err);
    }
  };
}
