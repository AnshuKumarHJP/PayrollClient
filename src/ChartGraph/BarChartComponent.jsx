import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card } from '../Lib/card';

const BarChartComponent = ({
  data,
  xKey,
  yKey,
  title = 'Bar Chart',
  colors = ['#8884d8'],
  width = '100%',
  height = 300,
  showGrid = true,
  showLegend = true,
  showTooltip = true,
  ...props
}) => {
  return (
    <Card className="p-4">
      {title && <h3 className="text-lg font-semibold mb-4">{title}</h3>}
      <ResponsiveContainer width={width} height={height}>
        <BarChart data={data} {...props}>
          {showGrid && <CartesianGrid strokeDasharray="3 3" />}
          <XAxis dataKey={xKey} />
          <YAxis />
          {showTooltip && <Tooltip />}
          {showLegend && <Legend />}
          {Array.isArray(yKey) ? (
            yKey.map((key, index) => (
              <Bar
                key={key}
                dataKey={key}
                fill={colors[index % colors.length]}
              />
            ))
          ) : (
            <Bar
              dataKey={yKey}
              fill={colors[0]}
            />
          )}
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
};

export default BarChartComponent;
