import React from 'react'
import StatCard from './StatCard'
import { Calendar } from '../../Lib/calendar'
import { Card } from '../../Lib/card'
import {
  LineChartComponent,
  BarChartComponent,
  PieChartComponent,
  AreaChartComponent,
  ScatterChartComponent
} from '../../ChartGraph'

import AttendanceCard from './AttendanceCard'
import SalarySlipCard from './SalarySlipCard'
import RequestsCard from './RequestsCard'
import EmployeeDistributionCard from './EmployeeDistributionCard'
import AnnouncementsCard from './AnnouncementsCard'
import HRPoliciesCard from './HRPoliciesCard'
import MyTeamCard from './MyTeamCard'
import BirthdaysCard from './BirthdaysCard'

const Dashboard = () => {
    // Payroll-related chart data
    const monthlySalaryData = [
        { month: 'Jan', basic: 45000, hra: 18000, conveyance: 1920, lta: 1500 },
        { month: 'Feb', basic: 45000, hra: 18000, conveyance: 1920, lta: 1500 },
        { month: 'Mar', basic: 46000, hra: 18400, conveyance: 1920, lta: 1500 },
        { month: 'Apr', basic: 46000, hra: 18400, conveyance: 1920, lta: 1500 },
        { month: 'May', basic: 47000, hra: 18800, conveyance: 1920, lta: 1500 },
        { month: 'Jun', basic: 47000, hra: 18800, conveyance: 1920, lta: 1500 }
    ];

    const departmentData = [
        { department: 'IT', count: 45, percentage: 22.5 },
        { department: 'HR', count: 25, percentage: 12.5 },
        { department: 'Finance', count: 30, percentage: 15 },
        { department: 'Marketing', count: 35, percentage: 17.5 },
        { department: 'Operations', count: 40, percentage: 20 },
        { department: 'Sales', count: 25, percentage: 12.5 }
    ];

    const leaveTypesData = [
        { name: 'Casual Leave', value: 35, fill: '#8884d8' },
        { name: 'Sick Leave', value: 25, fill: '#82ca9d' },
        { name: 'Earned Leave', value: 30, fill: '#ffc658' },
        { name: 'Maternity Leave', value: 10, fill: '#ff7c7c' }
    ];

    const attendanceData = [
        { month: 'Jan', present: 185, absent: 15 },
        { month: 'Feb', present: 190, absent: 10 },
        { month: 'Mar', present: 180, absent: 20 },
        { month: 'Apr', present: 195, absent: 5 },
        { month: 'May', present: 188, absent: 12 },
        { month: 'Jun', present: 192, absent: 8 }
    ];

    const performanceData = [
        { x: 85, y: 90, employee: 'John Doe' },
        { x: 78, y: 85, employee: 'Jane Smith' },
        { x: 92, y: 88, employee: 'Bob Johnson' },
        { x: 88, y: 92, employee: 'Alice Brown' },
        { x: 76, y: 80, employee: 'Charlie Wilson' },
        { x: 95, y: 96, employee: 'Diana Davis' },
        { x: 82, y: 87, employee: 'Eve Miller' },
        { x: 89, y: 91, employee: 'Frank Garcia' }
    ];

    return (
        <div className="w-full space-y-4">

            {/* =============================
                TOP SECTION 
                Cards Left  & Calendar Right
            ============================== */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-2 w-full">
                {/* LEFT SIDE: Full dashboard content (takes 3 columns on large screens) */}
                <div className="lg:col-span-3 space-y-4">
                    {/* --- Top Stat Cards Row --- */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-2">

                        <StatCard
                            title="Total Employees"
                            value="200/200"
                            change="+15%"
                            type="employees"
                        />

                        <StatCard
                            title="On Leaves"
                            value="20/200"
                            change="-10%"
                            type="leaves"
                        />

                        <StatCard
                            title="New Joinee"
                            value="10/200"
                            change="+12%"
                            type="new"
                        />

                        <EmployeeDistributionCard />
                    </div>

                    {/* --- Attendance + Salary Slip + Requests --- */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                        <AttendanceCard />
                        <SalarySlipCard />
                        <RequestsCard />
                    </div>
                </div>

                {/* RIGHT SIDE: Calendar Card (Responsive) */}
                <div className="lg:col-span-1">
                    <Card className="p-3 h-full items-center justify-center flex">
                        <Calendar />
                    </Card>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-2">
                <AnnouncementsCard />
                <HRPoliciesCard />
                <MyTeamCard />
                <BirthdaysCard />
            </div>

            {/* =============================
                ANALYTICS CHARTS SECTION
            ============================== */}
            <div className="space-y-4">
                <h2 className="text-2xl font-bold text-gray-800">Analytics Overview</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    <LineChartComponent
                        data={attendanceData}
                        xKey="month"
                        yKey={['present', 'absent']}
                        title="Monthly Attendance Trends"
                        colors={['#10b981', '#ef4444']}
                    />
                    <BarChartComponent
                        data={departmentData}
                        xKey="department"
                        yKey="count"
                        title="Employee Distribution by Department"
                        colors={['#8884d8', '#82ca9d', '#ffc658', '#ff7c7c', '#8dd1e1', '#d084d0']}
                    />
                    <PieChartComponent
                        data={leaveTypesData}
                        dataKey="value"
                        nameKey="name"
                        title="Leave Types Distribution"
                        colors={['#8884d8', '#82ca9d', '#ffc658', '#ff7c7c']}
                    />
                    <AreaChartComponent
                        data={monthlySalaryData}
                        xKey="month"
                        yKey={['basic', 'hra', 'conveyance']}
                        title="Monthly Salary Components Trend"
                        colors={['#8884d8', '#82ca9d', '#ffc658']}
                    />
                    <ScatterChartComponent
                        data={performanceData}
                        xKey="x"
                        yKey="y"
                        title="Employee Performance Scatter Plot"
                        colors={['#8884d8']}
                    />
                </div>
            </div>

        </div>
    )
}

export default Dashboard
