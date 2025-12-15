import React from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ZAxis } from 'recharts';
import { Card } from '../Lib/card';

const ScatterChartComponent = ({
  data,
  xKey,
  yKey,
  zKey,
  title = 'Scatter Chart',
  colors = ['#8884d8'],
  width = '100%',
  height = 300,
  showGrid = true,
  showLegend = true,
  showTooltip = true,
  shape = 'circle',
  ...props
}) => {
  return (
    <Card className="p-4">
      {title && <h3 className="text-lg font-semibold mb-4">{title}</h3>}
      <ResponsiveContainer width={width} height={height}>
        <ScatterChart data={data} {...props}>
          {showGrid && <CartesianGrid strokeDasharray="3 3" />}
          <XAxis dataKey={xKey} type="number" />
          <YAxis dataKey={yKey} type="number" />
          {zKey && <ZAxis dataKey={zKey} range={[64, 144]} />}
          {showTooltip && <Tooltip cursor={{ strokeDasharray: '3 3' }} />}
          {showLegend && <Legend />}
          <Scatter
            name={title}
            data={data}
            fill={colors[0]}
            shape={shape}
          />
        </ScatterChart>
      </ResponsiveContainer>
    </Card>
  );
};

export default ScatterChartComponent;
