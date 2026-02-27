import React from "react";
import ReactECharts from "echarts-for-react";

const SalesOverview = ({ theme, isDark }) => {
    // Default colors if theme is not provided (though it should be)
    const primaryColor = theme?.hex?.primary || '#F97316';

    const data = [
        { name: 'Jan', income: 25, expense: 15 },
        { name: 'Feb', income: 35, expense: 20 },
        { name: 'Mar', income: 45, expense: 25 },
        { name: 'Apr', income: 60, expense: 40 },
        { name: 'May', income: 50, expense: 35 },
        { name: 'Jun', income: 65, expense: 45 },
        { name: 'Jul', income: 55, expense: 30 },
        { name: 'Aug', income: 70, expense: 50 },
        { name: 'Sep', income: 60, expense: 45 },
        { name: 'Oct', income: 80, expense: 60 },
        { name: 'Nov', income: 40, expense: 20 },
        { name: 'Dec', income: 75, expense: 55 },
    ];

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
            right: '4%',
            bottom: '3%',
            top: '5%',
            containLabel: true,
        },
        xAxis: {
            type: 'category',
            data: data.map(item => item.name),
            axisLine: { show: false },
            axisTick: { show: false },
            axisLabel: { color: '#9CA3AF', fontSize: 10 },
        },
        yAxis: {
            type: 'value',
            axisLine: { show: false },
            axisTick: { show: false },
            splitLine: { lineStyle: { type: 'dashed', color: isDark ? '#374151' : '#E5E7EB' } },
            axisLabel: { color: '#9CA3AF', fontSize: 10 },
        },
        series: [
            {
                name: 'Income',
                type: 'bar',
                data: data.map(item => item.income),
                itemStyle: { color: primaryColor, borderRadius: [4, 4, 0, 0] },
                barWidth: 10,
            },
            {
                name: 'Expenses',
                type: 'bar',
                data: data.map(item => item.expense),
                itemStyle: { color: isDark ? '#4B5563' : '#E5E7EB', borderRadius: [4, 4, 0, 0] },
                barWidth: 10,
            },
        ],
        animationDuration: 1500,
        animationEasing: 'cubicOut',
    };

    return (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow dark:shadow-none p-5 transition-colors duration-300">
            <div className="flex justify-between items-center mb-6">
                <h3 className="font-semibold text-gray-800 dark:text-gray-100">Sales Overview</h3>
                <div className="flex flex-wrap gap-4 text-xs dark:text-gray-400">
                    <div className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: primaryColor }}></div> Income
                    </div>
                    <div className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-gray-300 dark:bg-gray-600"></div> Expenses
                    </div>
                    <select className="border dark:border-slate-600 rounded px-1 text-gray-500 dark:text-gray-400 outline-none bg-transparent dark:bg-slate-800">
                        <option>All Departments</option>
                    </select>
                </div>
            </div>

            <div className="h-64 w-full">
                <ReactECharts
                    option={option}
                    style={{ height: '100%', width: '100%' }}
                    opts={{ renderer: 'svg' }}
                />
            </div>
        </div>
    );
};

export default SalesOverview;
