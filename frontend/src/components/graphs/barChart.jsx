import React from "react";

import {
  BarChart as BarChartComponent,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export const BarChart = (props) => {
  const { data } = props
  return (
    <>
      {data && data[0] && Object.keys(data[0]) && Object.keys(data[0])[0] && (
        <ResponsiveContainer width="100%" height="100%">
          <BarChartComponent width={500} height={500} data={data} layout="vertical"
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}>
            <Bar maxBarSize={50} dataKey="count" fill="#eb690b" />
            <XAxis type="number" />
            <YAxis type="category" width={125} dataKey={Object.keys(data[0])[0]} />
            <Tooltip />
          </BarChartComponent>
        </ResponsiveContainer>
      )}
    </>

  );
}