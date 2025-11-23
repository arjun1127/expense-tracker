import React from 'react'
import CustomPieChart from '../charts/CustomPieChart'
import { LuChartPie } from 'react-icons/lu'

const COLORS = ['#16A34A', '#DC143C', '#7C3AED'] // green, red, purple

const FincaceOverview = ({ totalIncome = 0, totalExpense = 0, totalBalance = 0 }) => {
  const balanceData = [
    { name: 'Income', amount: Number(totalIncome) || 0 },
    { name: 'Expense', amount: Number(totalExpense) || 0 },
    { name: 'Balance', amount: Number(totalBalance) || 0 },
  ]

  return (
    <div className="relative p-4 bg-dark-400/40 backdrop-blur-sm border border-cyan-700/20 shadow-lg shadow-cyan-800/20 transition-all duration-300 hover:border-cyan-500/40 hover:shadow-cyan-500/10">
      
      <div className="flex items-center justify-between mb-6 px-1">
        <h5 className="flex items-center gap-2 font-semibold bg-gradient-to-r from-green-400 via-blue-400 to-cyan-300 bg-clip-text text-transparent tracking-wide drop-shadow-md">
          <LuChartPie className="text-cyan-300" /> Financial Overview
        </h5>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8">
        
        <div className="flex justify-center items-center w-full md:w-1/2">
          <CustomPieChart
            data={balanceData}
            label="Balance"
            totalAmount={`¥${totalBalance}`}
            colors={COLORS}
            showTextAnchor
          />
        </div>

        <div className="flex flex-col gap-3 text-sm w-full md:w-1/2 text-light-100">
          <div className="flex items-center justify-between border-b border-cyan-700/30 pb-2">
            <span className="text-gray-300">Total Income</span>
            <span className="text-green-400 font-semibold">+¥{totalIncome}</span>
          </div>

          <div className="flex items-center justify-between border-b border-cyan-700/30 pb-2">
            <span className="text-gray-300">Total Expense</span>
            <span className="text-red-500 font-semibold">-¥{totalExpense}</span>
          </div>

          <div className="flex items-center justify-between mt-2">
            <span className="text-gray-300">Net Balance</span>
            <span className="text-cyan-300 font-semibold">¥{totalBalance}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FincaceOverview
