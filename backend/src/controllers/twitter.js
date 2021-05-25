import express from "express";
import axios from "axios";
import {trendLine} from "../services/trendLine";
import {languageHandler} from "../services/languageHandler"
import { twitterHashtags } from "../services/twitterHashtags";
import { getSdk } from '../services/sdk/index.sdk'
import neo4j from "neo4j-driver" 
import { getBotomoterScore } from "../services/botometer";
import { createUsers, createTweetsAndUsers, findUsersByName 
, getDashboardTweets, getHashtagCountDashboard, getTweetsbyHashtag,
  getTopUser,getCountOfUsers,getAvgAndCountOfSentiment,getCountOfAbuse,getAbuseTweets
  } from "../services/neoQueryHandler";
import { getDates, addDays } from "../services/utils/dateHelper";
import { addTweets } from "../services/twitterHandler/addTweets";
import { getAllCountOfAbuse } from "../services/allCountOfAbuse/allCountOfAbuse"
import { analyzeTweets } from "../services/twitterHandler/analyzeTweets";
 
const router = express.Router()

const driver = neo4j.driver('neo4j://localhost', neo4j.auth.basic('neo4j', 'usthqp6e'))

export default async function tweets(id,start_time,end_time){
  const apiURL =`https://api.twitter.com/2/users/${id}/tweets?tweet.fields=geo,context_annotations,referenced_tweets,lang,possibly_sensitive,entities,public_metrics,created_at&expansions=author_id`;
  if(start_time){
    apiURL += `&start_time=${start_time}`;
  }
  if(end_time){
    apiURL += `&end_time=${end_time}`;
  }
  const response =  await axios.get(apiURL,
  {
    headers:{
    'Authorization': "Bearer %",
  }});
  return response.data
};


router.get("/user", async function(req, res, next) {
  console.log("/user query",req.query)
  const users = await findUsersByName(req.query.name);
  const userData = users[0];
  const endTime = addDays(req.query.end_time,1);
  const user = [req.query.name];
  console.log("----/user ----", user)
  const tweets = await getDashboardTweets(req.query.keywords || [],req.query.hashtags || [],user || [], req.query.start_time.slice(0,10) , endTime, req.query.language);
  
  if(!tweets || (Array.isArray(tweets) && tweets.length === 0)) {
    res.send({});
    return;
  }
   
  console.log("inside users",tweets)
  const countArray = await trendLine("day",tweets, req.query.start_time,req.query.end_time);
  const hashtagCount = await getHashtagCountDashboard(req.query.keywords || [],req.query.hashtags || [],req.query.users || [], req.query.start_time.slice(0,10), endTime, req.query.language);
  const countOfAbuse = await getCountOfAbuse(req.query.keywords || [],req.query.hashtags || [],user || [], req.query.start_time.slice(0,10), endTime, req.query.language)
  const allCountOfAbuse = await getAllCountOfAbuse(countOfAbuse);
  const abuseTweets = await getAbuseTweets(req.query.keywords || [],req.query.hashtags || [],user || [], req.query.start_time.slice(0,10), endTime, req.query.language, req.query.order, req.query.sort)


  

  const botomoterScore = await getBotomoterScore(req.query.name)

  const returnObj = {
    userData: userData, 
    tweetData: abuseTweets,
    trendLine: countArray,
    hashtags: hashtagCount,
    countOfAbuse:allCountOfAbuse,
    //tweetStream:tweetStream,
    //languageCount: languageCount,
    botometerScore: botomoterScore,
  };
  res.send(returnObj);
});

router.get("/analyze", async function (req, res, next) {
  const endTime = addDays(req.query.end_time, 1).toISOString().slice(0, 10);
  console.log("query", req.query);
  try {

  if (req.query.keywords || req.query.hashtags || req.query.users) {
    const tweets = await getDashboardTweets(
      req.query.keywords || [],
      req.query.hashtags || [],
      req.query.users || [],
      req.query.start_time.slice(0, 10),
      endTime,
      req.query.language,
      req.query.excludeKeywords || [],
      req.query.excludeHashtags || [],
      req.query.excludeUsers || [],
      //Filter for all abusefilters except for the "no_abuse"
      req.query.abuseFilters || []
    );

    if(Array.isArray(tweets) && tweets.length > 0)
      res.send("Tweets exist");
    else 
      res.send("Tweets doesn't exist")
    
    analyzeTweets(tweets);

  } else {
    res.send(false);
  }
  } catch(error) {
    console.log("couldn't analyze tweets", error)
  }
});

router.get("/tweets",  async function(req, res, next) {
  const endTime = addDays(req.query.end_time,1).toISOString().slice(0,10);
  console.log("query",req.query)
  if(req.query.addData === 'true'){
    let a = Date.now();
    const addedTweets = await addTweets(req.query.keywords,req.query.hashtags,req.query.users,req.query.start_time,req.query.end_time, true)
    let b = Date.now();
    console.log('-------adding tweets took ' + (b - a) + ' ms.');
    console.log("-------added tweets result length", addedTweets.length)
  }
  const hashtagLimit = 3;
  //const twitterSdk = getSdk().twitter;
  //const tweets = await twitterSdk.tweets.getTweetsByKeyword(req.query.keyword);
  if(req.query.keywords || req.query.hashtags || req.query.users){
  const tweets = await getDashboardTweets(req.query.keywords || [],req.query.hashtags || [],req.query.users || [], req.query.start_time.slice(0,10), endTime, req.query.language, req.query.excludeKeywords || [],req.query.excludeHashtags || [],req.query.excludeUsers || [],req.query.abuseFilters || []);
  const countArray = await trendLine("day",tweets, req.query.start_time,req.query.end_time);
  const hashtagCount = await getHashtagCountDashboard(req.query.keywords || [],req.query.hashtags || [],req.query.users || [], req.query.start_time.slice(0,10), endTime, req.query.language,req.query.excludeKeywords || [],req.query.excludeHashtags || [],req.query.excludeUsers || [],req.query.abuseFilters || []);
  const languageCount = await languageHandler(req.query.keywords || [],req.query.hashtags || [],req.query.users || [], req.query.start_time.slice(0,10), endTime,req.query.excludeKeywords || [],req.query.excludeHashtags || [],req.query.excludeUsers || [],req.query.abuseFilters || []);

  const userCount = await getCountOfUsers(req.query.keywords || [],req.query.hashtags || [],req.query.users || [], req.query.start_time.slice(0,10), endTime, req.query.language,req.query.excludeKeywords || [],req.query.excludeHashtags || [],req.query.excludeUsers || [],req.query.abuseFilters || [])
  //console.log("twitter req.query",req.query)

  const avgAndCountOfSentiment = await getAvgAndCountOfSentiment(req.query.keywords || [],req.query.hashtags || [],req.query.users || [], req.query.start_time.slice(0,10), endTime, req.query.language,req.query.excludeKeywords || [],req.query.excludeHashtags || [],req.query.excludeUsers || [],req.query.abuseFilters || [])
  const countOfAbuse = await getCountOfAbuse(req.query.keywords || [],req.query.hashtags || [],req.query.users || [], req.query.start_time.slice(0,10), endTime, req.query.language,req.query.excludeKeywords || [],req.query.excludeHashtags || [],req.query.excludeUsers || [],req.query.abuseFilters || [])
  const allCountOfAbuse = await getAllCountOfAbuse(countOfAbuse);
  const abuseTweets = await getAbuseTweets(req.query.keywords || [],req.query.hashtags || [],req.query.users || [], req.query.start_time.slice(0,10), endTime, req.query.language, req.query.order, req.query.sort,req.query.excludeKeywords || [],req.query.excludeHashtags || [],req.query.excludeUsers || [],req.query.abuseFilters || [])
  let getCountOfTweets = 0;
  console.log("-----tweets----",tweets)
  if(tweets && tweets.length > 0)
    getCountOfTweets = tweets.length

  const returnObj = { 
    //tweetData: tweets,
    countOfTweets: getCountOfTweets,
    trendLine: countArray,
    wordcloud: hashtagCount.slice(0,30),
    //tweetStream: abuseTweets,
    languageCount: languageCount,
    userCount: userCount,
    avgAndCountOfSentiment: avgAndCountOfSentiment,
    countOfAbuse:allCountOfAbuse,
    abuseTweets:abuseTweets,
  };
  res.send(returnObj);
}else{
  res.send([]);
}
});

router.get("/top-users", async function(req, res, next){
  console.log("/top-users",req.query)
  const endTime = addDays(req.query.end_time,1).toISOString().slice(0,10);
  const countLimit = 10;
  const topUser = await getTopUser(req.query.keywords || [],req.query.hashtags || [],req.query.users || [], req.query.start_time.slice(0,10), endTime, req.query.language,countLimit,req.query.orderBy,req.query.excludeKeywords || [],req.query.excludeHashtags || [],req.query.excludeUsers || [],req.query.abuseFilters || [])
  res.send({topUser:topUser});
});

router.get("/top-hashtags",  async function(req, res, next) {
  console.log("/top-hashtags", req.query)
  const endTime = addDays(req.query.end_time,1).toISOString().slice(0,10);
  
  if(req.query.keywords || req.query.hashtags || req.query.users){
  
    const topHashtags = await getHashtagCountDashboard(req.query.keywords || [],req.query.hashtags || [],req.query.users || [], req.query.start_time.slice(0,10), endTime, req.query.language,req.query.excludeKeywords || [],req.query.excludeHashtags || [],req.query.excludeUsers || [],req.query.abuseFilters || []);
    res.send({topHashTags: topHashtags.slice(0,8)});

  } else {

  res.send([]);

  }
});

router.get("/hashtag-trend-line",  async function(req, res, next) {
  console.log("/hashtag-trend-line", req.query.hashtags)
  const endTime = addDays(req.query.end_time,1).toISOString().slice(0,10);
  
  if(req.query.keywords || req.query.hashtags || req.query.users){
  
    const hashtagDates = await Promise.all(req.query.hashtags.map(async (h) => {
      return await getTweetsbyHashtag(h,req.query.start_time.slice(0,10), endTime)
    }));
  
    const hashtagArray = getDates(new Date(req.query.start_time), addDays(req.query.end_time,0))
  
     hashtagArray.forEach(d => {
      hashtagDates.forEach(h => {
        if(h[0]) {
          d[h[0].hashtag] = 0;
          h.forEach(hashtagRow => {
            if(hashtagRow.created_at === d.name)
              d[hashtagRow.hashtag]++
          })
        }
      })
     })

     res.send(hashtagArray);

  } else {

  res.send([]);

  }
});




router.get("/test",  async function(req, res, next) {
  const testObj = {test: "yestest"}
  console.log("tweet test endpoint")
  res.send(testObj);
});




module.exports = router;