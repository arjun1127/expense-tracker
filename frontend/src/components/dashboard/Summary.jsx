import React from "react";
import SummaryChart from "../charts/SummaryChart";

const Summary = ({
  totalSavingsRate,
  totalExpenseLast30Days,
  dailyExpenseAvg,
  monthlyIncomeTrend,
  monthlyExpenseTrend,
}) => {
  return (
    <div className=" relative overflow-hidden backdrop-blur-sm border border-cyan-700/20 shadow-lg shadow-cyan-800/20 p-5">
      {/* Header */}
      <h4 className="font-semibold text-lg mb-4 bg-gradient-to-r from-blue-400 via-cyan-300 to-pink-400 bg-clip-text text-transparent tracking-wide drop-shadow-md">
        Financial Summary
      </h4>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="flex flex-col items-center p-3 rounded-xl bg-gradient-to-b from-gray-800/70 to-gray-900/70 shadow-md">
          <p className="text-sm text-gray-400">Savings Rate</p>
          <h3 className="text-cyan-300 text-xl font-semibold mt-1">
            {totalSavingsRate ? `${totalSavingsRate}%` : "0%"}
          </h3>
        </div>

        <div className="flex flex-col items-center p-3 rounded-xl bg-gradient-to-b from-gray-800/70 to-gray-900/70 shadow-md">
          <p className="text-sm text-gray-400">Recent Expenses</p>
          <h3 className="text-pink-400 text-xl font-semibold mt-1">
            ₹{totalExpenseLast30Days?.toLocaleString() || 0}
          </h3> 
        </div>

        <div className="flex flex-col items-center p-3 rounded-xl bg-gradient-to-b from-gray-800/70 to-gray-900/70 shadow-md">
          <p className="text-sm text-gray-400">Daily Expense Avg</p>
          <h3 className="text-blue-400 text-xl font-semibold mt-1">
            ₹{dailyExpenseAvg || 0}
          </h3>
        </div>
      </div>

      {/* Chart */}
      <SummaryChart
        monthlyIncomeTrend={monthlyIncomeTrend}
        monthlyExpenseTrend={monthlyExpenseTrend}
      />

      {/* Decorative bottom line */}
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent"></div>
    </div>
  );
};

export default Summary;
