import React from "react";
import ReactECharts from "echarts-for-react";
import * as echarts from "echarts";

const data = [
  { name: "Jan", employee: 30, intern: 20 },
  { name: "Feb", employee: 45, intern: 28 },
  { name: "Mar", employee: 55, intern: 33 },
  { name: "Apr", employee: 38, intern: 27 },
  { name: "May", employee: 44, intern: 20 },
  { name: "Jun", employee: 60, intern: 25 },
  { name: "Jul", employee: 41, intern: 30 },
  { name: "Aug", employee: 49, intern: 28 },
];

export default function PerformanceChart() {
  const option = {
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      borderColor: '#e2e8f0',
      borderWidth: 1,
      textStyle: { color: '#1e293b' },
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '10%',
      top: '5%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: data.map(item => item.name),
      axisLine: { lineStyle: { color: '#e2e8f0' } },
      axisLabel: { color: '#64748b' }
    },
    yAxis: {
      type: 'value',
      axisLine: { show: false },
      splitLine: { lineStyle: { color: '#f1f5f9' } },
      axisLabel: { color: '#64748b' }
    },
    series: [
      {
        name: 'Employee',
        type: 'line',
        smooth: true,
        data: data.map(item => item.employee),
        lineStyle: { color: '#FACC15', width: 3 },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(250, 204, 21, 0.4)' },
            { offset: 1, color: 'rgba(250, 204, 21, 0)' }
          ])
        },
        symbol: 'none'
      },
      {
        name: 'Intern',
        type: 'line',
        smooth: true,
        data: data.map(item => item.intern),
        lineStyle: { color: '#3B82F6', width: 3 },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(59, 130, 246, 0.4)' },
            { offset: 1, color: 'rgba(59, 130, 246, 0)' }
          ])
        },
        symbol: 'none'
      }
    ],
    animationDuration: 1500,
    animationEasing: 'cubicOut',
  };

  return (
    <>
      <h3 className="text-sm font-semibold">Over all Employee Performance</h3>

      <div className="flex items-center gap-4 text-xs mt-2">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-yellow-400 rounded" /> Employee
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-blue-500 rounded" /> Intern
        </div>
      </div>

      <div style={{ width: '100%', height: '230px' }}>
        <ReactECharts
          option={option}
          style={{ height: '100%', width: '100%' }}
          opts={{ renderer: 'svg' }}
        />
      </div>
    </>
  );
}
