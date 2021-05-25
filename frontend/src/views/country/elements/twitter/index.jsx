import React from 'react';
import API from "../../../../services/sdk"
import {Box,Text,Button,TextInput} from 'grommet';

const Twitter = () =>{
const [value, setValue] = React.useState("");
const [user, setUser] = React.useState("");

function searchUsers(name){
    
    const searchQuery = async (name) =>{
        const data =  await API.get('/twitter/user',{
        params:{
            name:name,
        }
        });
        console.log("User-result",data);
    };
    searchQuery(name);
};

function searchTweets(keyword){
    
    const searchQueryTweets = async (keyword) =>{
        const searchObj={
            keywords:['navalny','russia'],
            hashtags:['russia'],
            users:[]};
        const startTime = "2021-02-01T12:00:01Z";
        const endTime = "2021-02-19T12:00:01Z";
        const dataTweet =  await API.get('/twitter/tweet',{
        params:{
            keywords:searchObj.keywords,
            hashtags:searchObj.hashtags,
            users: searchObj.users,
            start_time:startTime,
            end_time:endTime,
        }
        });
        console.log("Tweet-result",dataTweet.data);
    };
    searchQueryTweets(keyword);
};



return(
    <Box>
        <Text>
            twitter
            
        </Text>
        
        <TextInput id="user-input-id" name="user" value={user} onChange={(e)=>setUser(e.target.value)} />
        <Button primary label="user-search" onClick={()=> searchUsers(user)}/>

        <TextInput id="tweet-input-id" name="tweet" value={value} onChange={(e)=>setValue(e.target.value)} />
        <Button primary label="Tweets-search" onClick={()=> searchTweets(value)}/>

    </Box>
);
};
export default Twitter;