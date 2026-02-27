import React from 'react';
import ReactECharts from 'echarts-for-react';
import { Card } from '../Library/Card';

const ScatterChartComponent = ({
  data,
  xKey,
  yKey,
  zKey,
  title = 'Scatter Chart',
  colors = ['#6366f1'],
  width = '100%',
  height = 300,
  showGrid = true,
  showLegend = true,
  showTooltip = true,
  shape = 'circle',
  ...props
}) => {
  const chartData = data.map((item) => {
    const point = [item[xKey], item[yKey]];
    if (zKey) point.push(item[zKey]);
    return point;
  });

  const option = {
    color: colors,
    tooltip: {
      show: showTooltip,
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      borderColor: '#e2e8f0',
      borderWidth: 1,
      textStyle: {
        color: '#1e293b',
      },
    },
    legend: {
      show: showLegend,
      bottom: 0,
      itemWidth: 10,
      itemHeight: 10,
      icon: 'circle',
      textStyle: {
        color: '#64748b',
      },
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '12%',
      top: '10%',
      containLabel: true,
    },
    xAxis: {
      type: 'value',
      axisLine: {
        lineStyle: {
          color: '#e2e8f0',
        },
      },
      axisLabel: {
        color: '#64748b',
      },
      splitLine: {
        show: showGrid,
        lineStyle: {
          color: '#f1f5f9',
        },
      },
    },
    yAxis: {
      type: 'value',
      axisLine: {
        show: false,
      },
      splitLine: {
        show: showGrid,
        lineStyle: {
          color: '#f1f5f9',
        },
      },
      axisLabel: {
        color: '#64748b',
      },
    },
    series: [
      {
        name: title,
        type: 'scatter',
        symbol: shape,
        symbolSize: (val) => {
          if (val[2]) return Math.sqrt(val[2]) * 2;
          return 10;
        },
        itemStyle: {
          opacity: 0.8,
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.1)',
        },
        data: chartData,
      },
    ],
    animationDuration: 1500,
    animationEasing: 'cubicOut',
  };

  return (
    <Card className="p-4 bg-white/50 backdrop-blur-sm border-slate-200">
      {title && <h3 className="text-lg font-semibold mb-4 text-slate-800">{title}</h3>}
      <div style={{ height: height, width: width }}>
        <ReactECharts
          option={option}
          style={{ height: '100%', width: '100%' }}
          opts={{ renderer: 'svg' }}
        />
      </div>
    </Card>
  );
};

export default ScatterChartComponent;
