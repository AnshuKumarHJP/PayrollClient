import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card } from '../Library/Card';

const LineChartComponent = ({
  data,
  xKey,
  yKey,
  title = 'Line Chart',
  colors = ['#8884d8'],
  width = '100%',
  height = 300,
  showGrid = true,
  showLegend = true,
  showTooltip = true,
  strokeWidth = 2,
  dot = true,
  ...props
}) => {
  return (
    <Card className="p-4">
      {title && <h3 className="text-lg font-semibold mb-4">{title}</h3>}
      <ResponsiveContainer width={width} height={height}>
        <LineChart data={data} {...props}>
          {showGrid && <CartesianGrid strokeDasharray="3 3" />}
          <XAxis dataKey={xKey} />
          <YAxis />
          {showTooltip && <Tooltip />}
          {showLegend && <Legend />}
          {Array.isArray(yKey) ? (
            yKey.map((key, index) => (
              <Line
                key={key}
                type="monotone"
                dataKey={key}
                stroke={colors[index % colors.length]}
                strokeWidth={strokeWidth}
                dot={dot}
              />
            ))
          ) : (
            <Line
              type="monotone"
              dataKey={yKey}
              stroke={colors[0]}
              strokeWidth={strokeWidth}
              dot={dot}
            />
          )}
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
};

export default LineChartComponent;
