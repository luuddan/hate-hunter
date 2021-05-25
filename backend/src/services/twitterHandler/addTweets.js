import express from "express";
import axios from "axios";
import { getSdk } from '../sdk/index.sdk'
import { createTweetsAndUsers,createSchema } from "../neoQueryHandler";
import { tisaneLanguages } from "../utils/tisaneLanguages";
import { TimedActionQueue } from "../queue"

const AbuseType = {
  personal_attack: 8,
  bigotry: 7,
  profanity: 3,
  sexual_advances: 6, 
  criminal_activity: 9,
  external_contact: 1,
  adult_only: 2,
  mental_issues: 4,
  spam: 5,
}

const actionQueue = new TimedActionQueue()
const tisaneQueue = new TimedActionQueue()

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
        'Authorization': "Bearer ",
      }
    });
  return response.data
};

export async function addTweets(keywords, hashtags, users, startDate, endDate, analyseTweets) {
  //await createSchema();
  console.log("ADD_DATA",keywords, hashtags, users, startDate, endDate)
  
  const searchKeywords = [...((keywords && keywords.length > 0) ? keywords : []), ...((hashtags && hashtags.length > 0) ? hashtags.map(h => "%23" + h) : []), ...((users && users.length > 0) ? users.map(u => "from: " + u) : [])]
  //const searchKeywords = [...keywords]
  let numberOfFetchedTweets = 0;
  let numberOfAnalysedTweets = 0;
  let numberOfFetchedUsers = 0;
  let totalTweets = 0;
  const fetchedTweets = [];

  const sdk = getSdk();
  
  //await createSchema();
  /*searchKeywords.forEach((keyword) => {
      fetchAndCreate(keyword, startDate, endDate); 
  })*/

  const myPromise = new Promise((resolve, reject) => {
    actionQueue.ending = () => resolve('Added to database')
  });


  fetchAndCreate(searchKeywords.join(" OR "), startDate, endDate)


async function fetchForDates(keyword, startDate, endDate, nextToken) {
      console.log("numberOfAnalysedTweets in fetchForDates", numberOfAnalysedTweets, numberOfFetchedTweets)
      if(numberOfFetchedTweets > 100000)
        return
      //console.log(numberOfFetchedTweets, numberOfFetchedUsers, keyword, startDate, endDate, nextToken)
      const tweets = await sdk.twitter.tweets.getTweetsByKeyword(keyword, startDate, endDate, nextToken);
      numberOfFetchedTweets += tweets && tweets.data && tweets.data.length ? tweets.data.length : 0;
      numberOfFetchedUsers += tweets && tweets.includes && tweets.includes.users && tweets.includes.users.length > 0 ? tweets.includes.users.length : 0;
      
      const newTweets = [...((tweets && tweets.data && tweets.data.length > 0) ? tweets.data : [])].map(t => {
        if(!t.topics || t.topics.length === 0)
          t.topics = []
          t.abuse = [{value:0,type:"no_Abuse",severity:"none",text:"none"}]
          
        /*if(!t.sentiment_expressions || t.sentiment_expressions.length === 0)
          t.sentiment_expressions = [{text:"",polarity:""}]
*/
        if(!t.entities || !t.entities.urls || t.entities.urls.length === 0)
          t.entities = {
            ...(t && t.entities),
            urls: ""
          }
        else { 
          t.entities.urls = t.entities.urls.map(url => url.unwound_url || url.expanded_url).join()
        }
        return t;
      })

      if(tweets && tweets.meta && tweets.meta.next_token){
        console.log("Next token exists, adding to queue", tweets.meta.next_token)
        actionQueue.add(async () => await fetchForDates(keyword, startDate, endDate, tweets.meta.next_token), 1000, `next token action: ${startDate} - ${endDate}`)
      }
      totalTweets += newTweets.length || 0;
      await createTweetsAndUsers(newTweets, tweets && tweets.includes && tweets.includes.users);
      fetchedTweets.push(newTweets);
      return true;
      //console.log("total tweets & users:", numberOfFetchedTweets, numberOfFetchedUsers)
}

  function fetchAndCreate(keyword, startDate, endDate) {
    let end_date = new Date(endDate);
    let start_date = new Date(startDate);
    let mid_date = addDays(start_date,1);
    while(mid_date <= end_date){
      const startDate = start_date.toISOString()
      const midDate = mid_date.toISOString()
      actionQueue.add(async () => await fetchForDates(keyword, startDate, midDate), 1000, `regular action: ${startDate} - ${midDate}`)
      start_date = addDays(start_date,1)
      mid_date = addDays(mid_date,1)
    }
  }


return await myPromise.then(() => {
  console.log("finished adding & creating", fetchedTweets.length, numberOfAnalysedTweets)
  return fetchedTweets
});
}