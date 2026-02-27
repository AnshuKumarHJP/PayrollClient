import React from "react";
import ReactECharts from "echarts-for-react";

const EmployeesByDepartment = ({ theme, isDark }) => {
    const data = [
        { name: "Sales", value: 85 },
        { name: "Development", value: 65 },
        { name: "Management", value: 50 },
        { name: "HR", value: 30 },
        { name: "Testing", value: 80 },
        { name: "Marketing", value: 75 },
    ];

    const primaryColor = theme?.hex?.primary || '#F97316';

    const option = {
        tooltip: {
            trigger: 'axis',
            axisPointer: { type: 'shadow' },
            backgroundColor: isDark ? 'rgba(30, 41, 59, 0.9)' : 'rgba(255, 255, 255, 0.9)',
            borderColor: isDark ? '#334155' : '#e2e8f0',
            borderWidth: 1,
            textStyle: { color: isDark ? '#f8fafc' : '#1e293b' },
        },
        grid: {
            left: '3%',
            right: '10%',
            bottom: '3%',
            top: '3%',
            containLabel: true,
        },
        xAxis: {
            type: 'value',
            boundaryGap: [0, 0.01],
            axisLine: { show: false },
            axisTick: { show: false },
            splitLine: { show: false },
            axisLabel: { show: false }
        },
        yAxis: {
            type: 'category',
            data: data.map(item => item.name).reverse(),
            axisLine: { show: false },
            axisTick: { show: false },
            axisLabel: { color: isDark ? '#94a3b8' : '#64748b', fontSize: 12 }
        },
        series: [
            {
                name: 'Employees',
                type: 'bar',
                data: data.map(item => item.value).reverse(),
                itemStyle: {
                    color: primaryColor,
                    borderRadius: [0, 10, 10, 0]
                },
                barWidth: 12,
                showBackground: true,
                backgroundStyle: {
                    color: isDark ? '#334155' : '#f1f5f9',
                    borderRadius: [0, 10, 10, 0]
                }
            }
        ],
        animationDuration: 1500,
        animationEasing: 'cubicOut',
    };

    return (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow dark:shadow-none p-5 h-full transition-colors duration-300">
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-gray-800 dark:text-gray-100">Employees By Department</h3>
                <span className="text-xs text-gray-400 dark:text-gray-400 bg-gray-100 dark:bg-slate-700 px-2 py-1 rounded">This Week</span>
            </div>

            <div className="h-64">
                <ReactECharts
                    option={option}
                    style={{ height: '100%', width: '100%' }}
                    opts={{ renderer: 'svg' }}
                />
            </div>

            <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
                Do of Employees increased by <span className="text-green-500 font-bold">+20%</span> from last Week
            </div>
        </div>
    );
};

export default EmployeesByDepartment;
