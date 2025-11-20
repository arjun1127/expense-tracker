import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const SummaryChart = ({ monthlyIncomeTrend, monthlyExpenseTrend }) => {
  if (!monthlyIncomeTrend || !monthlyExpenseTrend) return null;

  // Merge both into one dataset
  const mergedData = [];

  const formatMonth = (m, y) => {
    const date = new Date(y, m - 1);
    return date.toLocaleString("default", { month: "short" });
  };

  monthlyIncomeTrend.forEach((item) => {
    mergedData.push({
      month: formatMonth(item._id.month, item._id.year),
      income: item.totalAmount,
      expense: 0,
    });
  });

  monthlyExpenseTrend.forEach((item) => {
    const existing = mergedData.find(
      (d) => d.month === formatMonth(item._id.month, item._id.year)
    );
    if (existing) {
      existing.expense = item.totalAmount;
    } else {
      mergedData.push({
        month: formatMonth(item._id.month, item._id.year),
        income: 0,
        expense: item.totalAmount,
      });
    }
  });

  mergedData.sort((a, b) => new Date(a.month) - new Date(b.month));

  return (
    <div className="w-full h-[250px] md:h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={mergedData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#22d3ee" stopOpacity={0.8} />
              <stop offset="100%" stopColor="#22d3ee" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f472b6" stopOpacity={0.8} />
              <stop offset="100%" stopColor="#f472b6" stopOpacity={0} />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
          <XAxis dataKey="month" stroke="#94a3b8" />
          <YAxis stroke="#94a3b8" />
          <Tooltip
            contentStyle={{
              backgroundColor: "#0f172a",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "8px",
            }}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="income"
            stroke="#22d3ee"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 5 }}
          />
          <Line
            type="monotone"
            dataKey="expense"
            stroke="#f472b6"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SummaryChart;
