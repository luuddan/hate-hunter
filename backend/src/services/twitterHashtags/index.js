

export const twitterHashtags = (tweets) => {
    const hashtagCount = [];
    if(tweets){
        tweets.map((tweet)=>{
            if(tweet.entities && tweet.entities.hashtags){
                tweet.entities.hashtags.map((hashtag)=>{
                    const index = hashtagCount.findIndex(o =>o.text === hashtag.tag.toLowerCase())
                    if(index !== -1){
                        hashtagCount[index].value += 1;
                    }else{
                    hashtagCount.push({"text":hashtag.tag.toLowerCase(), value:1})
                }})
                
            }
        })
    }
    return hashtagCount;

}