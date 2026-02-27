import React from "react";
import ReactECharts from "echarts-for-react";

// ===================== SAMPLE DATA =====================
const data = [
  { name: "Group A", value: 400 },
  { name: "Group B", value: 300 },
  { name: "Group C", value: 300 },
  { name: "Group D", value: 200 },
];

export default function CustomActiveShapePieChart({
  isAnimationActive = true,
  defaultIndex = 0,
}) {
  const option = {
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c} ({d}%)',
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      borderColor: '#e2e8f0',
      borderWidth: 1,
      textStyle: {
        color: '#1e293b',
      },
    },
    series: [
      {
        name: 'Access From',
        type: 'pie',
        radius: ['60%', '80%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2,
        },
        label: {
          show: false,
          position: 'center',
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 20,
            fontWeight: 'bold',
            formatter: '{b}\n{d}%',
          },
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
          },
        },
        labelLine: {
          show: false,
        },
        data: data,
        animation: isAnimationActive,
        animationDuration: 1500,
        animationEasing: 'cubicOut',
      },
    ],
  };

  return (
    <div style={{ width: '100%', height: '400px' }}>
      <ReactECharts
        option={option}
        style={{ height: '100%', width: '100%' }}
        opts={{ renderer: 'svg' }}
      />
    </div>
  );
}
