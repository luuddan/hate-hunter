import { BaseSdk } from '../../base.sdk';

export class TweetsSdk extends BaseSdk {
    async getTweetsByKeyword(query,start_time,end_time, nextToken) {

        let queryString = `${this.twitter2Path}/tweets/search/all?query=(${query}) -is:retweet lang:en&tweet.fields=entities,lang,referenced_tweets,public_metrics,created_at&expansions=author_id&user.fields=created_at,description,id,location,name,profile_image_url,public_metrics,username&max_results=500`
        if(start_time){
            queryString += `&start_time=${start_time}`;
          }
          if(end_time){
            queryString += `&end_time=${end_time}`;
          }
        if(nextToken)
            queryString += `&next_token=${nextToken}`
        console.log("------twitter api request: ", encodeURI(queryString))
        const tweets = await this.get(encodeURI(queryString))
        return tweets
    }
}
