import "https://deno.land/std@0.149.0/dotenv/load.ts";
import monitorRealtimeScores from "./lib/monitorSocket.ts";

monitorRealtimeScores();
