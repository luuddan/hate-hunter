import React from "react";
import { Box, Text, Tip } from "grommet";
import { BarChart } from "../../../components/graphs/barChart"

export const AbuseComponent = ({ data }) => {
    return (
        <Box background="white" width="50%" round="small" border="black" >
            <Tip content={
                <Box background="white" size="xsmall" round="small" align="center" pad="small">
                    <Text>Amount of detected abuse in dataset. </Text>
                    <Text>Take in act that detecting abuse in tweets can be hard,</Text>
                    <Text>check tweets manually on the right.</Text>
                </Box>
            }>
                <Text textAlign="center" margin="small" size="large" weight={300}> Abuse in Tweets </Text>
            </Tip>

                {data && <BarChart data={data} />}
        </Box>
    );
}