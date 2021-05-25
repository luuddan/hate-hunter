import React, { useState,useEffect } from 'react';
import {Box,Text,Button,TextInput, CheckBox} from 'grommet';
import {Colors} from "../../services/utils/colors"
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  } from 'recharts';


const Chart = ({data}) => (
    <ResponsiveContainer width="70%" height="100%">
    <LineChart data={data}
      margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
      <XAxis dataKey="name" />
      <YAxis />
      <CartesianGrid strokeDasharray="3 3" />
      <Tooltip />
      <Legend />
          {data.length > 0 && Object.keys(data[0]).slice(1).map((key,index) => 
            <Line type="monotone" dataKey={key} stroke={Colors[index % Colors.length].hex} />
          ) }
    </LineChart>
  </ResponsiveContainer>
)

export const HashtagChart = (props) => {
    return(
        <Box width="100%" height="400px" round="small" direction="column" >
            
            <Text alignSelf="center" size="large" weight={300} >Trending Hashtags</Text>
            <Box direction="row" height="400px" justify="between">
            <Chart data={props.graph}
                height={400} 
                width="75%" />
            <Box width="25%"  round="small">
                {props.hashtags && props.hashtags.map(h => (
                    <Box direction="row" justify="between"  margin="small">
                        <Text  style={{maxWidth:"150px"}} truncate="true">{h.value}</Text>
                        <Box direction="row" gap="small">
                            <Text>{h.count}</Text>
                            <CheckBox 
                            checked={h.display}
                            onClick={(event) => props.onChange(event.target.checked, h.value)}
                            />
                        </Box>
                    </Box>
                ))}
            </Box>
            </Box>
        </Box>
    )
}
