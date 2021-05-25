import { createNeoHandler } from "../../models/neoHandler"
import neo4j from "neo4j-driver"
import { QueryHelper } from "./queryHelper";

export const createUsers = async (users) => {
    const neoHandler = createNeoHandler()
    const queryString = `CALL apoc.periodic.iterate('UNWIND $users as user RETURN user',
    "MERGE (u:User {id: user.id}) 
    SET u +={
        followers_count: user.public_metrics.followers_count,
        following_count: user.public_metrics.following_count,
        tweet_count: user.public_metrics.tweet_count,
        listed_count: user.public_metrics.listed_count,
        username: user.username,
        name: user.name,
        created_at: user.created_at,
        description: user.description,
        profile_image_url: user.profile_image_url
        }",
    {batchSize:100, iterateList:true, parallel:false, params: {users:$users}})`;

    return await neoHandler.query(queryString, { users: users });
}

export const createHashtags = async (tweets) => {
    const neoHandler = createNeoHandler();

    const queryString = `CALL apoc.periodic.iterate('UNWIND $tweets as tweet RETURN tweet','FOREACH (hash IN tweet.entities.hashtags | MERGE (h:Hashtag {text:toLower(hash.tag)}))',{batchSize:100, iterateList:true, parallel:false, params: {tweets:$tweets}})`

    return await neoHandler.query(queryString, { tweets: tweets });
}

export const createTopics = async (tweets) => {
    const neoHandler = createNeoHandler();

    //const queryString = `CALL apoc.periodic.iterate('UNWIND $tweets as tweet RETURN tweet','FOREACH (topic IN tweet.topics | MERGE (t:Topic {text:toLower(topic.text)})<-[:HAS_TOPIC]-(tw:Tweet{id:tweet.id}))',{batchSize:100, iterateList:true, parallel:false, params: {tweets:$tweets}})`
    const queryString = `CALL apoc.periodic.iterate('UNWIND $tweets as tweet RETURN tweet','FOREACH (topic IN tweet.topics | MERGE (t:Topic {text:toLower(topic)}))',{batchSize:100, iterateList:true, parallel:false, params: {tweets:$tweets}})`
    return await neoHandler.query(queryString, { tweets: tweets });
}

/*export const matchTweetAndTopic = async (tweetId, hashtag) => {
    const neoHandler = createNeoHandler();

    const queryString = `CALL apoc.periodic.iterate('UNWIND $tweets as tweet RETURN tweet','FOREACH (topic IN tweet.topics | MERGE (t:Topic {text:toLower(topic.text)}))',{batchSize:100, iterateList:true, parallel:false, params: {tweets:$tweets}})`

    const queryString = `MATCH (t:Tweet), (h:Hashtag) WHERE t.id = $tweet_id AND h.text = $hashtag MERGE (t)-[:HAS_TAG]->(h)`;

    return await neoHandler.query(queryString, {
        tweet_id: tweetId,
        hashtag: hashtag
    });
};*/

export const createAbuses = async (tweets) => {
    const neoHandler = createNeoHandler();

    const queryString = `CALL apoc.periodic.iterate('UNWIND $tweets as tweet RETURN tweet','FOREACH (abuse IN tweet.abuse | MERGE (a:Abuse {text:toLower(abuse.type),value:abuse.value}))',{batchSize:100, iterateList:true, parallel:false, params: {tweets:$tweets}})`

    return await neoHandler.query(queryString, { tweets: tweets });
}

export const createTweets = async (tweets) => {
    const neoHandler = createNeoHandler();

    //const queryString = `CALL apoc.periodic.iterate("UNWIND $tweets as tweet RETURN tweet","MERGE (t:Tweet {id: tweet.id}) with t, tweet CALL apoc.do.when(EXISTS(t.referenced_tweet_id),'SET t += {text: tweet.text, author_id: tweet.author_id, retweet_count: tweet.public_metrics.retweet_count,reply_count: tweet.public_metrics.reply_count,like_count: tweet.public_metrics.like_count,quote_count: tweet.public_metrics.quote_count,lang: tweet.lang,referenced_tweet_type: tweet.referenced_tweets[0].type,referenced_tweet_id: tweet.referenced_tweets[0].id,referenced_tweet_length:tweet.referenced_tweets}','SET t+={text: tweet.text,author_id: tweet.author_id,created_at: tweet.created_at,retweet_count: tweet.public_metrics.retweet_count,reply_count: tweet.public_metrics.reply_count,like_count: tweet.public_metrics.like_count,quote_count: tweet.public_metrics.quote_count,lang: tweet.lang,referenced_tweet_type: tweet.referenced_tweets[0].type,referenced_tweet_id: tweet.referenced_tweets[0].id,referenced_tweet_length:tweet.referenced_tweets}',{t:t,tweet:tweet}) YIELD value return t",{batchSize:1, iterateList:true, parallel:false, params: {tweets:$tweets}})`;
    const queryString = `CALL apoc.periodic.iterate("UNWIND $tweets as tweet RETURN tweet","MERGE (t:Tweet {id: tweet.id}) SET t += {text: tweet.text, author_id: tweet.author_id, retweet_count: tweet.public_metrics.retweet_count,reply_count: tweet.public_metrics.reply_count,like_count: tweet.public_metrics.like_count,quote_count: tweet.public_metrics.quote_count,lang: tweet.lang, created_at: tweet.created_at,urls: tweet.entities.urls, sentiment: tweet.sentiment}",{batchSize:100, iterateList:true, parallel:false, params: {tweets:$tweets}})`;
    return await neoHandler.query(queryString, { tweets: tweets });
};

export const addTweetAnalysis = async (tweets) => {
    const neoHandler = createNeoHandler();

    const queryString = `CALL apoc.periodic.iterate("UNWIND $tweets as tweet RETURN tweet","MERGE (t:Tweet {id: tweet.id}) SET t += {topics: tweet.topics, abuse: tweet.abuse, sentiments: tweet.sentiment_expressions}",{batchSize:100, iterateList:true, parallel:false, params: {tweets:$tweets}})`;

    return await neoHandler.query(queryString, { tweets: tweets });
};

export const matchUsersAndTweets = async (tweets) => {
    const neoHandler = createNeoHandler();

    const queryString = `CALL apoc.periodic.iterate('UNWIND $tweets as tweet RETURN tweet','MATCH (t:Tweet), (u:User) WHERE t.id = tweet.id AND u.id = tweet.author_id MERGE (u)-[:HAS_TWEETED]->(t)', {batchSize:100, iterateList:true, parallel:false, params: {tweets:$tweets}})`; ("---MATCH USERS & TWEETS query----", queryString);
    return await neoHandler.query(queryString, { tweets: tweets });
};


export const matchTweetAndHashtag = async (tweetId, hashtag) => {
    const neoHandler = createNeoHandler();

    const queryString = `MATCH (t:Tweet), (h:Hashtag)
    WHERE t.id = $tweet_id AND h.text = $hashtag
    MERGE (t)-[:HAS_TAG]->(h)`;

    return await neoHandler.query(queryString, {
        tweet_id: tweetId,
        hashtag: hashtag
    });
};

export const matchTweetAndTopic = async (tweetId, topic) => {
    const neoHandler = createNeoHandler();

    const queryString = `MATCH (t:Tweet), (h:Topic)
    WHERE t.id = $tweet_id AND h.text = toLower($topic)
    MERGE (t)-[:HAS_TOPIC]->(h)`;

    return await neoHandler.query(queryString, {
        tweet_id: tweetId,
        topic: topic
    });
};

export const matchTweetAndAbuse = async (tweetId, type, severity, text) => {
    const neoHandler = createNeoHandler();
    const queryString = `MATCH (t:Tweet), (h:Abuse)
    WHERE t.id = $tweet_id AND h.text = toLower($type)
    MERGE (t)-[:HAS_ABUSE {severity:$severity,text:$text}]->(h)`;

    return await neoHandler.query(queryString, {
        tweet_id: tweetId,
        type: type,
        severity: severity,
        text: text
    });
};

export const matchTweetWithRetweeted = async (originTweet, refTweet) => {
    const neoHandler = createNeoHandler();

    const queryString = `CALL apoc.periodic.iterate("MATCH (t:Tweet {id:$originTweet})"," MERGE (t2:Tweet {id:$refTweet}) SET t2 += {id:$refTweet} MERGE (t)-[:RETWEETED]->(t2)",{batchSize:1000, parallel:false,params:{
        originTweet: '${originTweet}',
        refTweet: '${refTweet}'
    }})`;

    return await neoHandler.query(queryString);
};

export const matchTweetWithQuoted = async (originTweet, refTweet) => {
    const neoHandler = createNeoHandler();

    const queryString = `MATCH (t:Tweet {id:$originTweet}) MERGE (t2:Tweet {id:$refTweet}) SET t2 += {id:$refTweet} MERGE (t)-[:QOUTED]->(t2)`;

    return await neoHandler.query(queryString, {
        originTweet: originTweet,
        refTweet: refTweet
    });
};

export const matchTweetWithRepliedTo = async (originTweet, refTweet) => {
    const neoHandler = createNeoHandler();

    const queryString = `MATCH (t:Tweet {id:$originTweet}) MERGE (t2:Tweet {id:$refTweet}) SET t2 += {id:$refTweet} MERGE (t)-[:REPLIED_TO]->(t2)`;

    return await neoHandler.query(queryString, {
        originTweet: originTweet,
        refTweet: refTweet
    });
};

export function matchTweetRelation(tweet) {
    if (tweet.referenced_tweets && tweet.referenced_tweets[0]) {
        switch (tweet.referenced_tweets[0].type) {
            case ("quoted"):
                matchTweetWithQuoted(tweet.id, tweet.referenced_tweets[0].id);
                break;
            case ("replied_to"):
                matchTweetWithRepliedTo(tweet.id, tweet.referenced_tweets[0].id);
                break;
            case ("retweeted"):
                matchTweetWithRetweeted(tweet.id, tweet.referenced_tweets[0].id);
                break;
            default:
            //codeblock
        }
    }
}

export const updateTweetsWithAbuses = async (tweets) => {
    try {
        if (tweets && tweets.length > 0) {
            await createTweets(tweets);
            await createAbuses(tweets);
            await Promise.all(tweets.map(async (tweet) => {
                return await Promise.all(tweet.abuse.map(async (abuse) => {
                    return await matchTweetAndAbuse(tweet.id, abuse && abuse.type, abuse && abuse.severity, abuse && abuse.text);
                }));
            }));
            console.log("Updated tweets and abuses")
        } else {
            console.log("Couldn't update tweets and abuses, tweets didn't exist")
        }
    } catch(error) {
        console.log("updateTweetsWithAbuses error", error);
    }
}


export const createTweetsAndUsers = async (tweets, users) => {
    try {
        //console.log("createtweetsandusers", tweets[0])
        let createdtweets;
        let createdUsers;
        let matched;
        console.log("createTweetsAndUsers", Array.isArray(users) && users.length, Array.isArray(tweets) && tweets.length)
        if (tweets && tweets.length > 0) {
            createdtweets = await createTweets(tweets);
            if (tweets)
                console.log("created tweets", createdtweets.records[0]._fields[1], createdtweets.records[0]._fields[4], createdtweets.records[0]._fields[5], createdtweets.records[0]._fields[7])
        }
        if (users && users.length > 0) {
            createdUsers = await createUsers(users);
            if (users)
                console.log("created users", createdUsers.records[0]._fields[1], createdUsers.records[0]._fields[4], createdUsers.records[0]._fields[5], createdUsers.records[0]._fields[7])
        }
        if (tweets && tweets.length > 0) {
            matched = await matchUsersAndTweets(tweets);
            if (tweets && users)
                console.log("matched", matched.records[0]._fields[1], matched.records[0]._fields[4], matched.records[0]._fields[5], matched.records[0]._fields[7])
            await createHashtags(tweets);
            await createTopics(tweets);
            await createAbuses(tweets);
        }

        if (tweets && tweets.length > 0)
            await Promise.all(tweets.map(async (tweet) => {
                if (tweet.entities && tweet.entities.hashtags) {
                    return await Promise.all(tweet.entities.hashtags.map(async (hashtag) => {
                        const hashtagText = hashtag.tag.toLowerCase();
                        return await matchTweetAndHashtag(tweet.id, hashtagText);
                    }));
                } else
                    return;
            }));
        await Promise.all(tweets.map(async (tweet) => {
            return await Promise.all(tweet.topics.map(async (topic) => {
                return await matchTweetAndTopic(tweet.id, topic);
            }));
        }));
        await Promise.all(tweets.map(async (tweet) => {
            return await Promise.all(tweet.abuse.map(async (abuse) => {
                return await matchTweetAndAbuse(tweet.id, abuse && abuse.type, abuse && abuse.severity, abuse && abuse.text);
            }));
        }));

        if (tweets && users && createdtweets.records[0]._fields[1] !== matched.records[0]._fields[1])
            console.log("-------------WARNING------ DOESN'T MATCH----------", createdtweets.records[0].length, createdUsers.records[0].length, matched.records[0].length)


        /*
        //Add later
        matchTweetRelation(tweet);
        */

        return "created tweets and users";
    } catch (error) {
        console.log("failed to create: ", error);
        return "failed to create: " + error;
    }
};

export const findUsersByName = async (name, limit = 1) => {
    const neoHandler = createNeoHandler();
    const queryString = `MATCH (u:User) WHERE u.username CONTAINS $name RETURN u LIMIT $limit`;

    const users = await neoHandler.query(queryString, {
        name: name,
        limit: neo4j.int(limit),
    });
    return users.records.map(u => u.get('u').properties);
}

export const getDashboardTweets = async (keywords, hashtags, users, startTime, endTime, lang, excludeKeywords, excludeHashtags, excludeUsers, abuseFilters) => {
    const queryHelper = new QueryHelper();
    let queryString = ``;
    queryString += `CALL{MATCH (u:User)-[:HAS_TWEETED]->(t:Tweet) - [:HAS_ABUSE] -> (a:Abuse)`
    queryHelper.keywords(keywords);
    queryHelper.hashtags(hashtags);
    queryHelper.users(users);
    queryHelper.time(startTime, endTime);
    queryHelper.languages(lang);
    queryHelper.excludeKeywords(excludeKeywords);
    queryHelper.excludeHashtags(excludeHashtags);
    queryHelper.excludeUsers(excludeUsers);
    queryHelper.filterAbuse(abuseFilters);
    queryString += queryHelper.returnQuery();
    queryString += `RETURN DISTINCT t } RETURN t ORDER BY t.created_at DESC`;
    console.log("qeuere getDashboardTweets", queryString);

    const neoHandler = createNeoHandler();
    const tweets = await neoHandler.query(queryString);
    return tweets.records.map(t => t.get('t').properties);
};

export const getAvgAndCountOfSentiment = async (keywords, hashtags, users, startTime, endTime, lang, excludeKeywords, excludeHashtags, excludeUsers, abuseFilters) => {
    const queryHelper = new QueryHelper();
    let queryString = ``;
    queryString += `CALL{MATCH (u:User)-[:HAS_TWEETED]->(t:Tweet) - [:HAS_ABUSE] -> (a:Abuse)`
    queryHelper.keywords(keywords);
    queryHelper.hashtags(hashtags);
    queryHelper.users(users);
    queryHelper.time(startTime, endTime);
    queryHelper.languages(lang);
    queryHelper.excludeKeywords(excludeKeywords);
    queryHelper.excludeHashtags(excludeHashtags);
    queryHelper.excludeUsers(excludeUsers);
    queryHelper.filterAbuse(abuseFilters);
    queryString += queryHelper.returnQuery();
    queryString += `RETURN DISTINCT t} RETURN avg(t.sentiment) as avgSentiment,count(t.sentiment) as count`;
    console.log("qeuere", queryString);

    const neoHandler = createNeoHandler();
    const avgSentiment = await neoHandler.query(queryString);
    return avgSentiment.records.map(c => ({ "avgSentiment": c.get('avgSentiment'), "count": c.get('count').low })) || [];
};
export const getCountOfAbuse = async (keywords, hashtags, users, startTime, endTime, lang, excludeKeywords, excludeHashtags, excludeUsers, abuseFilters) => {
    const queryHelper = new QueryHelper();
    let queryString = ``;
    queryString += `CALL{MATCH (u:User)-[:HAS_TWEETED]->(t:Tweet) - [:HAS_ABUSE] -> (a:Abuse)`
    queryHelper.keywords(keywords);
    queryHelper.hashtags(hashtags);
    queryHelper.users(users);
    queryHelper.time(startTime, endTime);
    queryHelper.languages(lang);
    queryHelper.excludeKeywords(excludeKeywords);
    queryHelper.excludeHashtags(excludeHashtags);
    queryHelper.excludeUsers(excludeUsers);
    queryHelper.filterAbuse(abuseFilters);
    queryString += queryHelper.returnQuery();
    queryString += `RETURN DISTINCT t}WITH t MATCH (a:Abuse) <- [:HAS_ABUSE]-(t) WHERE a.value <> 0 return a as name,count(t) as count`;

    const neoHandler = createNeoHandler();
    const result = [];
    const countOfAbuse = await neoHandler.query(queryString);
    if(countOfAbuse && countOfAbuse.records) {
    countOfAbuse.records.map(c => result.push({ "name": c.get('name').properties.text, "count": c.get('count').low }));
    return result;
    } else {
    return []
}   
} catch (error) {
    console.log("getCountOfAbuse error", error)
    return []
}
}
export const getAbuseTweets = async (keywords, hashtags, users, startTime, endTime, lang, order, sort, excludeKeywords, excludeHashtags, excludeUsers, abuseFilters) => {
    try {
    const queryHelper = new QueryHelper();
    let queryString = ``;
    queryString += `CALL{MATCH (u:User)-[:HAS_TWEETED]->(t:Tweet) - [:HAS_ABUSE] -> (a:Abuse) `
    queryHelper.keywords(keywords);
    queryHelper.hashtags(hashtags);
    queryHelper.users(users);
    queryHelper.time(startTime, endTime);
    queryHelper.languages(lang);
    queryHelper.excludeKeywords(excludeKeywords);
    queryHelper.excludeHashtags(excludeHashtags);
    queryHelper.excludeUsers(excludeUsers);
    queryHelper.filterAbuse(abuseFilters);
    queryString += queryHelper.returnQuery();
    queryString += `RETURN DISTINCT t}WITH t MATCH (a:Abuse) <- [:HAS_ABUSE]-(t) <- [:HAS_TWEETED]- (u:User)`;
    if (sort === "value") queryString += ` WITH a,t,u ORDER BY a.value ${order}`;
    else queryString += ` WITH a,t,u ORDER BY t.${sort} ${order}`;
    queryString += ` return collect(a) as abuse,t as tweet,u as user LIMIT 200`

    const neoHandler = createNeoHandler();
    const result = [];
    const avgSentiment = await neoHandler.query(queryString);
    if(avgSentiment && avgSentiment.records) {
    avgSentiment.records.map(c => result.push({ "abuse": c.get('abuse'), "tweet": c.get('tweet').properties, "user": c.get('user').properties }));
    return result;
    } else {
        return []
    }
    } catch (error) {
        console.log("getAbuseTweets error", error)
        return []
    }
}
export const getTopUser = async (keywords, hashtags, users, startTime, endTime, lang, limit, orderBy, excludeKeywords, excludeHashtags, excludeUsers, abuseFilters) => {
    try {
    const queryHelper = new QueryHelper();
    let queryString = ``;
    queryString += `CALL{MATCH (u:User)-[:HAS_TWEETED]->(t:Tweet) - [:HAS_ABUSE] -> (a:Abuse)`
    queryHelper.keywords(keywords);
    queryHelper.hashtags(hashtags);
    queryHelper.users(users);
    queryHelper.time(startTime, endTime);
    queryHelper.languages(lang);
    queryHelper.excludeKeywords(excludeKeywords);
    queryHelper.excludeHashtags(excludeHashtags);
    queryHelper.excludeUsers(excludeUsers);
    queryHelper.filterAbuse(abuseFilters);
    queryString += queryHelper.returnQuery();
    queryString += `RETURN DISTINCT t, u}RETURN u,count(t) AS tweet_count, sum(t.like_count) AS like_count, sum(t.reply_count) AS reply_count, sum(t.quote_count) AS quote_count, sum(t.retweet_count) AS retweet_count, (5*sum(t.retweet_count) + 4*sum(t.quote_count)+3*sum(t.reply_count)+2*sum(t.like_count)+count(t)) AS topScore ORDER BY ${orderBy} DESC LIMIT ${limit}`;
    const neoHandler = createNeoHandler();
    const user = await neoHandler.query(queryString);
    const result = [];
    if(user && user.records) {
        user.records.map(u => result.push({ "user": u.get('u').properties, "tweet_count": u.get('tweet_count').low, "like_count": u.get('like_count'), "reply_count": u.get('reply_count'), "quote_count": u.get('quote_count'), "retweet_count": u.get('retweet_count'), "topScore": u.get('topScore') }));
        return result;
    } else {
        return []
    }
} catch(error) {
    console.log("error")
    return []
}
}

export const getCountOfUsers = async (keywords, hashtags, users, startTime, endTime, lang, excludeKeywords, excludeHashtags, excludeUsers, abuseFilters) => {
    try {
    const queryHelper = new QueryHelper();
    let queryString = ``;
    queryString += `CALL{MATCH (u:User)-[:HAS_TWEETED]->(t:Tweet) - [:HAS_ABUSE] -> (a:Abuse)`
    queryHelper.keywords(keywords);
    queryHelper.hashtags(hashtags);
    queryHelper.users(users);
    queryHelper.time(startTime, endTime);
    queryHelper.languages(lang);
    queryHelper.excludeKeywords(excludeKeywords);
    queryHelper.excludeHashtags(excludeHashtags);
    queryHelper.excludeUsers(excludeUsers);
    queryHelper.filterAbuse(abuseFilters);
    queryString += queryHelper.returnQuery();
    queryString += `RETURN DISTINCT u}RETURN count(u) AS count `;

    const neoHandler = createNeoHandler();
    const count = await neoHandler.query(queryString);

    if(count && count.records)
        return count.records.map(c => c.get('count').low);
    else
        return []
    } catch (error) {
        console.log("get count of users error", error)
        return [];
    }
}

export const getLanguageCount = async (keywords, hashtags, users, startTime, endTime , excludeKeywords, excludeHashtags, excludeUsers, abuseFilters) => {
    const queryHelper = new QueryHelper();
    let queryString = ``;
    queryString += `CALL{MATCH (u:User)-[:HAS_TWEETED]->(t:Tweet) - [:HAS_ABUSE] -> (a:Abuse)`
    queryHelper.keywords(keywords);
    queryHelper.hashtags(hashtags);
    queryHelper.users(users);
    queryHelper.time(startTime, endTime);
    queryHelper.excludeKeywords(excludeKeywords);
    queryHelper.excludeHashtags(excludeHashtags);
    queryHelper.excludeUsers(excludeUsers);
    queryHelper.filterAbuse(abuseFilters);
    queryString += queryHelper.returnQuery();
    queryString += `RETURN DISTINCT t}RETURN t.lang AS lang,count(t) AS count  ORDER BY count DESC `;

    const neoHandler = createNeoHandler();
    const tweets = await neoHandler.query(queryString);
    const result = [];
    tweets.records.map(t => result.push({ "name": t.get('lang'), "count": t.get('count').low }));
    return result;
}
export const getHashtagCountDashboard = async (keywords, hashtags, users, startTime, endTime, lang, excludeKeywords, excludeHashtags, excludeUsers, abuseFilters) => {
    const queryHelper = new QueryHelper();
    let queryString = ``;
    queryString += `CALL{MATCH (u:User)-[:HAS_TWEETED]->(t:Tweet) - [:HAS_ABUSE] -> (a:Abuse) `
    queryHelper.keywords(keywords);
    queryHelper.hashtags(hashtags);
    queryHelper.users(users);
    queryHelper.time(startTime, endTime);
    queryHelper.languages(lang);
    queryHelper.excludeKeywords(excludeKeywords);
    queryHelper.excludeHashtags(excludeHashtags);
    queryHelper.excludeUsers(excludeUsers);
    queryHelper.filterAbuse(abuseFilters);
    queryString += queryHelper.returnQuery();
    queryString += `RETURN DISTINCT t}MATCH (t)-[:HAS_TAG]->(h:Hashtag) RETURN DISTINCT h.text AS hashtag,SIZE( ()-[:HAS_TAG]->(h) ) AS count ORDER BY count DESC `;



    const neoHandler = createNeoHandler();
    const hashtagCount = await neoHandler.query(queryString);
    const result = [];
    hashtagCount.records.map(h => result.push({ "value": h.get('hashtag'), "count": h.get('count').low }));
    return result;

}



export const getTweetsbyHashtag = async (hashtag, startTime, endTime) => {
    const neoHandler = createNeoHandler();
    const queryString = `MATCH (h:Hashtag)<-[:HAS_TAG]-(t:Tweet) WHERE h.text = "${hashtag}" AND "${startTime}"<=t.created_at<="${endTime}" RETURN t.created_at AS created_at,h.text AS hashtag`;
    const tweets = await neoHandler.query(queryString);
    //const result = [];
    //return tweets.records.map(t => t.get('t').properties);
    const result = tweets.records.map(t => ({ "hashtag": t.get('hashtag'), "created_at": t.get('created_at').split('T')[0] }));
    //tweets.records.forEach(t => result.push({"hashtag":t.get('hashtag'),"created_at":t.get('created_at')}))
    return result;
}

export const getHashtagCountByUser = async (id) => {
    const neoHandler = createNeoHandler();
    const queryString = `MATCH (t:Tweet {author_id:"${id}"}) MATCH (t)-[:HAS_TAG]->(h:Hashtag) RETURN DISTINCT h.text AS hashtag,SIZE( ()-[:HAS_TAG]->(h) ) AS count`
    const hashtagCount = await neoHandler.query(queryString);
    const result = [];
    hashtagCount.records.map(h => result.push({ "text": h.get('hashtag'), "value": h.get('count').low }));
    return result;
}

export const createSchema = async () => {
    const neoHandler = createNeoHandler();

    const schemas = [`CREATE CONSTRAINT ON (t:Tweet) ASSERT t.id IS UNIQUE`
        , `CREATE CONSTRAINT ON (t:Tweet) ASSERT exists(t.id)`
        , `CREATE CONSTRAINT ON (h:Hashtag) ASSERT h.text IS UNIQUE`
        , `CREATE CONSTRAINT ON (h:Hashtag) ASSERT exists(h.text)`
        , `CREATE CONSTRAINT ON (a:Abuse) ASSERT a.text IS UNIQUE`
        , `CREATE CONSTRAINT ON (a:Abuse) ASSERT exists(a.text)`
        , `CREATE CONSTRAINT ON (to:Topic) ASSERT to.text IS UNIQUE`
        , `CREATE CONSTRAINT ON (to:Topic) ASSERT exists(to.text)`
        , `CREATE CONSTRAINT ON (u:User) ASSERT u.id IS UNIQUE`
        , `CREATE CONSTRAINT ON (u:User)  ASSERT exists(u.id)`]

    schemas.forEach(async schema => {
        await neoHandler.query(schema);
    });
};




