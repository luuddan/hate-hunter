import { Botometer } from "botometer";

 

  
  const botometer = new Botometer({
    consumerKey: "",
    consumerSecret: "",
    accessToken: "9332984712847",
    accessTokenSecret: "",
    rapidApiKey: "",
    supressLogs: false, // Not required. Defaults to true
    usePro: true,
  });

export async function getBotomoterScore(name) {
  const score = await botometer.getScores([name])
  return score;
}
 