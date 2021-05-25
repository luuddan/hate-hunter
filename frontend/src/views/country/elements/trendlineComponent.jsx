import React from "react";
import { Box,Text,Tip } from "grommet";
import {LineChart} from "../../../components/graphs/lineChart"

export const TrendlineComponent = ({data}) => {
    return (
        <Box background="white" width="100%" round="small" pad="small">
            <Tip content={
            <Box background="white" size="xsmall" round="small" align="center" pad="small">
                <Text>Number of tweets in the filtered dataset. </Text>
            </Box>
        }>
        <Text alignSelf="center" size="large" weight={300} >Trendline of Tweets</Text>
            </Tip>

        <Box align="center" justify="center"  background="white" pad="small" margin="small">
        <LineChart
          width={1000}
          height={450}
          margintop={40}
          marginbottom={40}
          color={["#999999"]}
          data={data}
        />
        </Box>
        </Box>
      );
}