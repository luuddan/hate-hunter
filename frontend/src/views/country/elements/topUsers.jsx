import React from "react";
import { Box, Text, Button, Tip } from "grommet";
import { scaleLinear } from "d3-scale";
import { useHistory } from "react-router-dom";
import { changeUserState } from '../../../redux/slices/user';
import { useDispatch } from "react-redux"
import { DropContainer } from "./dropContainer";


const colorScale = scaleLinear()
    .domain([1, 100])
    .range(["#E0E0E0", "#eb690b"]);



const Row = ({ data, orderBy, max }) => {
    const width = (data[orderBy] / max * 100).toString() + "%";
    const history = useHistory();
    const dispatch = useDispatch()
    const onClickHandler = (user) => {
        history.push("/user/"+user)
    }


    return (
        <Tip content={
            <Box background="white" size="xsmall" round="small" align="center">
                <Text>{orderBy}: {data[orderBy]}</Text>
                <Text>Name: {data.user.username}</Text>
            </Box>
        }
        >
            <Button onClick={() => onClickHandler(data.user.username)}>
                <Box background={colorScale(data[orderBy] / max * 100)} width={width} border="black">
                    <Text truncate="true" style={{ width: "44px" }} size="small" alignSelf="end" color="white"> {data.user.username} </Text>
                </Box>
            </Button>
        </Tip>

    )
}

export const TopUsers = (userData) => {
    return (
        <Box background="white" border="black" round="small" width="100%">
            <Box direction="row" justify="between" margin={{vertical:"xsmall", left: "medium", right: "small"}}>
            <Tip content={
            <Box background="white" size="xsmall" round="small" align="center" pad="small">
                <Text>TopScore is calculated by the function: </Text>
                <Text>(1*#Tweets+2*#Likes+3*#Replies+4*#Quotes+5*#Retweets),</Text>
                <Text>where all the numbers are a summarization over the dataset.</Text>
            </Box>
        }>
            <Text alignSelf="center" size="large" weight={300}>Most influential user</Text>
            </Tip>
            <DropContainer domain="COUNTRY"/>
            </Box>
            <Box margin="small" >
                {userData && userData.data && userData.data.map((u) => <Row data={u} orderBy={userData.orderBy} max={userData.data[0][userData.orderBy]} />)}
            </Box>

        </Box>
    );
}