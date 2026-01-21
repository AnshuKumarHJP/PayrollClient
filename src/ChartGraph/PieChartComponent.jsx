import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card } from '../Library/Card';

const PieChartComponent = ({
  data,
  dataKey,
  nameKey,
  title = 'Pie Chart',
  colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7c7c', '#8dd1e1'],
  width = '100%',
  height = 300,
  showLegend = true,
  showTooltip = true,
  innerRadius = 0,
  outerRadius = 80,
  ...props
}) => {
  return (
    <Card className="p-4">
      {title && <h3 className="text-lg font-semibold mb-4">{title}</h3>}
      <ResponsiveContainer width={width} height={height}>
        <PieChart {...props}>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            outerRadius={outerRadius}
            innerRadius={innerRadius}
            fill="#8884d8"
            dataKey={dataKey}
            nameKey={nameKey}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Pie>
          {showTooltip && <Tooltip />}
          {showLegend && <Legend />}
        </PieChart>
      </ResponsiveContainer>
    </Card>
  );
};

export default PieChartComponent;
