import React from 'react';
import ReactECharts from 'echarts-for-react';
import { Card } from '../Library/Card';

const PieChartComponent = ({
  data,
  dataKey,
  nameKey,
  title = 'Pie Chart',
  colors = ['#6366f1', '#8b5cf6', '#ec4899', '#f43f5e', '#f59e0b', '#10b981', '#06b6d4'],
  width = '100%',
  height = 300,
  showLegend = true,
  showTooltip = true,
  innerRadius = '0%',
  outerRadius = '80%',
  ...props
}) => {
  const chartData = data.map((item) => ({
    name: item[nameKey],
    value: item[dataKey],
  }));

  const option = {
    color: colors,
    tooltip: {
      trigger: 'item',
      show: showTooltip,
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      borderColor: '#e2e8f0',
      borderWidth: 1,
      textStyle: {
        color: '#1e293b',
      },
      formatter: '{b}: {c} ({d}%)',
    },
    legend: {
      show: showLegend,
      orient: 'horizontal',
      bottom: 0,
      itemWidth: 10,
      itemHeight: 10,
      icon: 'circle',
      textStyle: {
        color: '#64748b',
      },
    },
    series: [
      {
        name: title,
        type: 'pie',
        radius: [innerRadius, outerRadius],
        avoidLabelOverlap: true,
        itemStyle: {
          borderRadius: 8,
          borderColor: '#fff',
          borderWidth: 2,
        },
        label: {
          show: true,
          position: 'outside',
          formatter: '{b}: {d}%',
          color: '#64748b',
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 14,
            fontWeight: 'bold',
          },
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
          },
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

export default PieChartComponent;
