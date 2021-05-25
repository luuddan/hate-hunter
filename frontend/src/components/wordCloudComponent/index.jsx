import React from 'react';
import { Box, Text } from 'grommet';
import { TagCloud } from 'react-tagcloud'

export const WordCloud = (words) => {
    let seed = 1337
    function random() {
      const x = Math.sin(seed++) * 10000
      return x - Math.floor(x)
    }
    return (
        <Box background="white" pad="medium" border="black" minHeight="100px" maxHeight="300px" width="100%" round="small" justify="center">
            <Text alignSelf="center" size="large" weight={300} margin={{bottom:"12px", top:"-12px"}}>Hashtags</Text>
            {words &&
                  <TagCloud
                  minSize={12}
                  maxSize={50}
                  randomNumberGenerator={random}
                  style={{
                      width:"100%",
                      height: "100%",
                  }}
                  tags={words.data}
                />}
        </Box>
    )
}