import React from "react";
import { Box,Text } from "grommet";

export const InfoComp = ({title,data}) => {
    return (
        <Box align="center" justify="center" width="23%" border="black" round="small" background="white" pad="small">
            <Text textAlign="center" size="large" weight={300}> {title}: </Text>
            <Text weight="bold" size="xlarge" textAlign="center">{data}</Text>
        </Box>
      );
}