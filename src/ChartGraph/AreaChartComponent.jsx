import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card } from '../Library/Card';

const AreaChartComponent = ({
  data,
  xKey,
  yKey,
  title = 'Area Chart',
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
        <AreaChart data={data} {...props}>
          {showGrid && <CartesianGrid strokeDasharray="3 3" />}
          <XAxis dataKey={xKey} />
          <YAxis />
          {showTooltip && <Tooltip />}
          {showLegend && <Legend />}
          {Array.isArray(yKey) ? (
            yKey.map((key, index) => (
              <Area
                key={key}
                type="monotone"
                dataKey={key}
                stackId="1"
                stroke={colors[index % colors.length]}
                fill={colors[index % colors.length]}
              />
            ))
          ) : (
            <Area
              type="monotone"
              dataKey={yKey}
              stroke={colors[0]}
              fill={colors[0]}
            />
          )}
        </AreaChart>
      </ResponsiveContainer>
    </Card>
  );
};

export default AreaChartComponent;
