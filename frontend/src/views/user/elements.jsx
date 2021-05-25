import React from "react";
import { Box, Text, Image, Tip } from "grommet";


export const HeaderCard = (props) => {

    const {
        name,
        username,
        profile_image_url,
        description,
        followers_count,
        following_count,
        listed_count,
        tweet_count,
        created_at
    } = props.data;
 
    return (
        <Box direction="row"
            justify="between"
            round="small"
            overflow="hidden"
            background="white"
            elevation="medium"
        >
            <Box width="200px" height="200px" >
                <Image margin="small" fit="contain" src={profile_image_url} />
                <Text alignSelf="center" margin="small">
                    @{username}
                </Text>
            </Box>
            <Box width="400px" justify="center">
                <Text weight="bold" margin="medium">
                    {name}
                </Text>
                <Text margin="medium">
                    {description}
                </Text>
                <Text margin="medium">
                    Created: {created_at.toString().slice(0,10)}
                </Text>
            </Box>
            <Box direction="column" justify="center" gap="small" margin={{right:"12px"}}>
                <Box gap="small" direction="row">
                <Tip content={
            <Box background="white" size="xsmall" round="small" align="center" pad="small">
                <Text>A score of bot-like characteristics calculated by Botometer.</Text>
                <Text>https://botometer.osome.iu.edu/</Text>
            </Box>
        }>
                    <Text weight="bold">
                        {(Math.round(props.botScore * 100)|| 0)} % 
                    </Text>
                    </Tip>
                    <Tip content={
            <Box background="white" size="xsmall" round="small" align="center" pad="small">
                <Text>A score of bot-like characteristics calculated by Botometer.</Text>
                <Text>https://botometer.osome.iu.edu/</Text>
            </Box>
        }>
                    <Text size="small">bot score</Text>
                    </Tip>
                </Box>
                <Box gap="small" direction="row">
                    <Text weight="bold">
                        {followers_count} 
                    </Text>
                    <Text size="small">followers</Text>
                </Box>
                <Box gap="small" direction="row">
                    <Text weight="bold">
                        {following_count} 
                    </Text>
                    <Text size="small">following</Text>
                </Box>
                <Box gap="small" direction="row">
                <Tip content={
            <Box background="white" size="xsmall" round="small" align="center" pad="small">
                <Text>Total number of tweets by the user.</Text>
                <Text>All the other visualizations are regarding to the tweets fetch by the defined search.</Text>
            </Box>
        }>
                    <Text weight="bold">
                        {tweet_count} 
                    </Text>
                    </Tip>
                    <Tip content={
            <Box background="white" size="xsmall" round="small" align="center" pad="small">
               <Text>Total number of tweets by the user.</Text>
               <Text>All the other visualizations are regarding to the tweets fetch by the defined search.</Text>
            </Box>
        }>
                    <Text size="small">tweets</Text>
                    </Tip>
                </Box>
            </Box>

        </Box>
    )
};

export const TweetCard = ({
    data: {
        text
    }
}) => {

    return (
        <Box
            direction="row"
            justify="between"
            round="small"
            overflow="hidden"
            background="white"
            elevation="medium"
        >
            <Text>{text}</Text>
        </Box>
    )
};