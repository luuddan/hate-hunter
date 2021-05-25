import express from "express";
import axios from "axios";
import { getSdk } from '../services/sdk/index.sdk'
import { createTweetsAndUsers,createSchema } from "../services/neoQueryHandler";
import tweets from "./twitter";
import { tisaneLanguages } from "../services/utils/tisaneLanguages";
import { addTweets } from "../services/twitterHandler/addTweets"

const router = express.Router()

class TimedActionQueue{
  constructor() {
    this.queue = []
    this.running = false;
    this.queueTime = 0;
  }

  add(action, timeOut){
    console.log("add in queue")
    this.queue.push({action, timeOut})
    this.queueTime += timeOut;
    if(!this.running)
        this.run()
    return this.queueTime;
  }

  async run(){
    console.log("run in queue", this.queueTime, this.queue, this.queue[0] && this.queue[0].action)
    if(this.queue.length === 0){
      this.running = false;
      return
    }
    this.running = true;
    setTimeout(async () => {
      this.queueTime -= this.queue[0].timeOut
      this.queue[0].action();
      this.queue.shift();
      this.run();
  })
}
}

const actionQueue = new TimedActionQueue()

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function addDays(date, days) {
  var result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

async function fetchTweets(id, start_time, end_time) {
  const apiURL = `https://api.twitter.com/2/users/${id}/tweets?tweet.fields=geo,context_annotations,referenced_tweets,lang,possibly_sensitive,entities,public_metrics,created_at&expansions=author_id`;
  if (start_time) {
    apiURL += `&start_time=${start_time}`;
  }
  if (end_time) {
    apiURL += `&end_time=${end_time}`;
  }
  const response = await axios.get(apiURL,
    {
      headers: {
        'Authorization': "",
      }
    });
  return response.data
};

router.get("/test-new-add-data", async function (req, res, next) {
  console.log(req.query)
  await addTweets(JSON.parse(req.query.keywords),JSON.parse(req.query.hashtags),JSON.parse(req.query.users),req.query.startDate,req.query.endDate)
  res.send("created");
});

router.get("/create-schema", async function (req, res, next) {
  await createSchema();
  res.send("created");
});

router.get("/add-data", async function (req, res, next) {
  //await createSchema();
  
  let fetchedTweets = 0;
  let numberOfAnalysedTweets = 0;
  let fetchedUsers = 0;
  console.log("ADD_DATA")
  console.log(req.query.keyword);
  //const keywords = ["#navalny","#Navalny","navalny", "Navalny","Navalnyj", "navalnyj","freenavalny","FREENAVALNY"];
  const keywords = ["sapmi"];
  //const keywords =["navalny"]

  const sdk = getSdk();

  
  //await createSchema();
  keywords.forEach(async (keyword, idx) => {
      fetchAndCreate(keyword); 
  })

  async function fetchForDates(keyword, startDate, endDate, nextToken) {
      const tweets = await sdk.twitter.tweets.getTweetsByKeyword(keyword, startDate, endDate, nextToken);
      fetchedTweets += tweets.data.length
      fetchedUsers += tweets.includes.users.length
      let analysedTweets = []
      if(fetchedTweets > 100)
        return
      if(numberOfAnalysedTweets < 10) {
        analysedTweets = await Promise.all(tweets.data.slice(0, 10).map(async t => {
          if(!tisaneLanguages.some(l => t.lang === l.id))
            return t;
          const tweetAnalysis = await sdk.tisane.analyse(t.lang, t.text)
          const {...tweet} = {...t, ...tweetAnalysis}
          numberOfAnalysedTweets += 1;
          //console.log(tweet)
          return tweet;
        }))
      }

      const newTweets = [...analysedTweets, ...tweets.data.slice(analysedTweets.length+1, tweets.data.length)].map(t => {
        if(!t.topics || t.topics.length === 0)
          t.topics = [""]
        if(!t.abuse || t.abuse.length === 0)
          t.abuse = [""]
        return t;
      })
      if(tweets && tweets.meta && tweets.meta.next_token){
      const tweets = await sdk.twitter.tweets.getTweetsByKeyword(keyword, startDate, endDate, nextToken);
      /*if(tweets && tweets.meta && tweets.meta.next_token){
        actionQueue.add(() => fetchForDates(keyword, startDate, endDate, tweets.meta.next_token), 1500)
      }*/
      await createTweetsAndUsers(newTweets, tweets.includes.users);
      console.log("total tweets & users:", fetchedTweets, fetchedUsers)
    }

  }

  async function fetchAndCreate(keyword) {
    let whileIdx = 0;
    let end_date = new Date();
    end_date = new Date(new Date().setDate(end_date.getDate()-1));
    let start_date = new Date(new Date().setDate(end_date.getDate() - 30));
    let mid_date = new Date(new Date().setDate(end_date.getDate()-20));
    while(mid_date < end_date){
      const startDate = start_date.toISOString()
      const midDate = mid_date.toISOString()
      actionQueue.add(() => fetchForDates(keyword, startDate, midDate), 1500)
      start_date = addDays(start_date,10)
      mid_date = addDays(mid_date,10)
    }
  }
  res.send("created");
});


module.exports = router;



/* import express from "express";
import axios from "axios";
import { trendLine } from "../services/trendLine";
import { twitterHashtags } from "../services/twitterHashtags";
import { getSdk } from '../services/sdk/index.sdk'
import neo4j from "neo4j-driver"
import { getBotomoterScore } from "../services/botometer";
import { createUser, createTweetsAndUsers, findUsersByName, createSchema, createTweet, matchUserAndSpecificTweet, matchTweetRelation } from "../services/neoQueryHandler";
// import {tweets as fetchTweets} from "./twitter";

const router = express.Router()

async function fetchTweets(id, start_time, end_time) {
  const apiURL = `https://api.twitter.com/2/users/${id}/tweets?tweet.fields=geo,context_annotations,referenced_tweets,lang,possibly_sensitive,entities,public_metrics,created_at&expansions=author_id`;
  if (start_time) {
    apiURL += `&start_time=${start_time}`;
  }
  if (end_time) {
    apiURL += `&end_time=${end_time}`;
  }
  const response = await axios.get(apiURL,
    {
      headers: {
        'Authorization': "Bea",
      }
    });
  return response.data
};

router.get("/add-data", async function (req, res, next) {
  console.log("ADD_DATA")
  console.log(req.query.keyword);
  //const keywords = ["#navalny","#Navalny","navalny", "Navalny","Navalnyj", "navalnyj","freenavalny","FREENAVALNY"];
  const keywords = ["Navalny", "Navalnyj",];

  const twitterSdk = getSdk().twitter;

  let resultTweets = []

  //await createSchema();
  keywords.forEach((keyword, idx) => {
    setTimeout(() => {
    const end_date = new Date();
    let start_date = new Date(new Date().setDate(end_date.getDate() - 30));
    let mid_date = new Date(new Date().setDate(end_date.getDate() - 27));

    async function getTweets(){
      if(mid_date > end_date)
        mid_date = end_date
      console.log("start_date",start_date.toISOString())
      console.log("mid_date",mid_date.toISOString())
      console.log("end_date",end_date.toISOString())
      const tweets = await twitterSdk.tweets.getTweetsByKeyword(keyword, start_date.toISOString(), mid_date.toISOString());
      console.log("tweets: ", tweets && "tweets not undefined")
      if(tweets && tweets.data)
        await createTweetsAndUsers(tweets.data, tweets.includes.users);

      async function queries(t) {
        await createTweet(t);
        await matchUserAndSpecificTweet(t.id, t.author_id);
        matchTweetRelation(t);
      }

      tweets.data.forEach(async (tweet, idx) => {
        const timeline = await fetchTweets(tweet.author_id)
        console.log("adding tweet")
        timeline.data.forEach((t) => {
          setTimeout(() => {
            queries(t)
          }, 10);
        })
      })
      //console.log(createdTweets, keyword, tweets)
      resultTweets.push(tweets);
      start_date.setDate(start_date.getDate() + 30);
      mid_date.setDate(mid_date.getDate() + 30);
      console.log("start recursive", start_date < end_date, start_date, mid_date)
      if(start_date < end_date){
        setTimeout(() => {
          getTweets()
        }, 1000);
      }
  }

  getTweets()
  }, 10000*idx);
  })
  res.send(resultTweets);
});


module.exports = router; */