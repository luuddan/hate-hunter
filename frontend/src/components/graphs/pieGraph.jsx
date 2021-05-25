import React from 'react';
import { PieChart, Pie, Legend, Tooltip, ResponsiveContainer,Cell } from 'recharts';
import {Colors} from "../../services/utils/colors"


export const PieGraph = ({data}) =>{
  function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }
    return (
      <ResponsiveContainer width="100%" height="100%">
        <PieChart width={400} height={400}>
          <Pie
            dataKey="count"
            isAnimationActive={false}
            data={data}
            cx="50%"
            cy="50%"
            outerRadius={80}
            label
          >
          {data.map((entry, index) => <Cell key={`cell-${index}`} fill={Colors[index % Colors.length].hex}/>)}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    );
  
}
