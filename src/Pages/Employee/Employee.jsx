import React from 'react'
import EmployeeList from './EmployeeList'
import TopEmployees from './TopEmployees'
import PerformanceChart from './PerformanceChart'

const Employee = () => {
  return (
   <>
   
   <div className="p-6 space-y-6">

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="col-span-2 bg-background rounded-md shadow p-4">
          <PerformanceChart />
        </div>

        <div className="bg-background rounded-md shadow p-4">
          <TopEmployees />
        </div>
      </div>

      {/* Employee Table */}
     <EmployeeList />
    </div>
   </>
  )
}

export default Employee