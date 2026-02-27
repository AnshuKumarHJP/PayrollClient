import React from 'react';
import ReactECharts from 'echarts-for-react';
import * as echarts from 'echarts';
import { Card } from '../Library/Card';

const AreaChartComponent = ({
  data,
  xKey,
  yKey,
  title = 'Area Chart',
  colors = ['#6366f1', '#8b5cf6', '#ec4899', '#f43f5e', '#f59e0b'],
  width = '100%',
  height = 300,
  showGrid = true,
  showLegend = true,
  showTooltip = true,
  ...props
}) => {
  const option = {
    color: colors,
    tooltip: {
      trigger: 'axis',
      show: showTooltip,
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      borderColor: '#e2e8f0',
      borderWidth: 1,
      textStyle: {
        color: '#1e293b',
      },
      axisPointer: {
        type: 'line',
        lineStyle: {
          color: '#cbd5e1',
        },
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
      type: 'category',
      boundaryGap: false,
      data: data.map((item) => item[xKey]),
      axisLine: {
        lineStyle: {
          color: '#e2e8f0',
        },
      },
      axisLabel: {
        color: '#64748b',
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
    series: Array.isArray(yKey)
      ? yKey.map((key, index) => ({
        name: key,
        type: 'line',
        smooth: true,
        stack: 'Total',
        areaStyle: {
          opacity: 0.3,
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: colors[index % colors.length],
            },
            {
              offset: 1,
              color: 'rgba(255, 255, 255, 0)',
            },
          ]),
        },
        emphasis: {
          focus: 'series',
        },
        symbol: 'none',
        data: data.map((item) => item[key]),
      }))
      : [
        {
          name: yKey,
          type: 'line',
          smooth: true,
          areaStyle: {
            opacity: 0.3,
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: colors[0],
              },
              {
                offset: 1,
                color: 'rgba(255, 255, 255, 0)',
              },
            ]),
          },
          symbol: 'none',
          data: data.map((item) => item[yKey]),
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

export default AreaChartComponent;
