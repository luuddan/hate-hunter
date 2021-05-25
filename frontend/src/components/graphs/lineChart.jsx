import React from 'react';
import {
  LineChart as LineChartComponent, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import {Colors} from "../../services/utils/colors"



export const LineChart = (props) => {
  const { data, height, size, width, margintop, marginbottom, color} = props
  return (
    <ResponsiveContainer width="95%" height={height} >
      <LineChartComponent 
        data={data}

      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={Object.keys(data[0])[0]} />
        <YAxis  domain={[0,5]}/>
        <Tooltip />
        <Legend />
          {Object.keys(data[0]).slice(1).map((key,index) => 
            <Line type="monotone" dataKey={key} stroke={Colors[index % Colors.length].hex} />
          ) }
      </LineChartComponent>
    </ResponsiveContainer>
    );
  }