import React from "react";
import { Box,Text,Tip } from "grommet";
import {PieGraph} from "../../../components/graphs/pieGraph"

export const LanguageComp = ({data}) => {
    return (
        <Box background="white" width="100%" round="small" border="black" height="300px" pad="small">
            <Tip content={
            <Box background="white" size="xsmall" round="small" align="center" pad="small">
                <Text>Language of the tweets of the specific dataset. </Text>
                <Text>   Undefined stands for tweets Twitter could not detect language for. </Text>  
                <Text>  Take in act that define language to tweets can be hard.</Text>  
            </Box>
        }>
                <Text alignSelf="center" size="large" weight={300} >Languages</Text>
            </Tip>

            <Box widht="90%" height="80%" margin="small">
                <PieGraph data={data}/>
            </Box>
        </Box>
      );
}