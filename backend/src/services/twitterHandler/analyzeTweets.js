import { updateTweetsWithAbuses } from "../neoQueryHandler";
import { TimedActionQueue } from "../queue";

const tisaneQueue = new TimedActionQueue()

export async function analyzeTweets(tweets) {
  if (tweets && tweets.data && tweets.data.length > 0) {
    const sdk = getSdk();
    const analyzedTweets = await Promise.all(
      tweets.data.map(async (tweet) => {
        if (
          numberOfAnalysedTweets > 15000 ||
          !tisaneLanguages.some((l) => tweet.lang === l.id)
        )
          return tweet;
        else {
          if (numberOfAnalysedTweets % 50 === 0)
            console.log("numberofAnalyzedTweets / 50", numberOfAnalysedTweets);
          numberOfAnalysedTweets += 1;

          const waitForTisaneAnalytics = new Promise((resolve, reject) => {
            tisaneQueue.add(
              async () => {
                const tweetAnalysis = await sdk.tisane.analyse(
                  tweet.lang,
                  tweet.text
                );
                resolve(tweetAnalysis);
              },
              45,
              "tisaneAction"
            );
          });

          const tweetAnalysis = await waitForTisaneAnalytics.then(
            (response) => {
              console.log("finished analysing", response);
              return response;
            }
          );

          const tweet = { ...tweet, ...tweetAnalysis };

          return tweet;
        }
      })
    );
    await addTweetsToDatabase(tweets, analyzedTweets);
    return true;
  } else {
    return false;
  }
}

function getFormattedTweet(tweet){
    if(!tweet.topics || tweet.topics.length === 0)
    tweet.topics = []
  if(!tweet.abuse || tweet.abuse.length === 0){
    tweet.abuse = [{value:0,type:"no_Abuse",severity:"none",text:"none"}]
  } else {
    tweet.abuse.forEach((abuse)=> abuse.value = AbuseTyp[abuse.type]);
  }
  /*if(!tweet.sentiment_expressions || tweet.sentiment_expressions.length === 0)
    tweet.sentiment_expressions = [{text:"",polarity:""}]
*/
  if(!tweet.entities || !tweet.entities.urls || tweet.entities.urls.length === 0)
    tweet.entities = {
      ...(tweet && tweet.entities),
      urls: ""
    }
  else { 
    tweet.entities.urls = tweet.entities.urls.map(url => url.unwound_url || url.expanded_url).join()
  }
  return tweet;
}


export async function addTweetsToDatabase(tweets, analysedTweets) {
    const allTweets = [...analysedTweets, ...((tweets && tweets.data && tweets.data.length > 0) ? tweets.data.slice(analysedTweets.length, tweets.data.length) : [])];
    const newTweets = allTweets.map(tweet => getFormattedTweet(tweet));
    totalTweets += newTweets.length || 0;
    await updateTweetsWithAbuses(newTweets);
    return true;
}