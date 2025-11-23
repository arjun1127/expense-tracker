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

const IncomeMonthlyChart = ({ data }) => {
  const chartData =
    data?.months?.map((month, index) => ({
      month,
      income: data.values[index],
    })) || [];

  return (
    <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 via-cyan-950/30 to-indigo-950/40 border border-cyan-700/40 shadow-lg shadow-cyan-900/20 hover:shadow-cyan-700/30 transition-all duration-300">
      <h3 className="text-lg font-semibold text-cyan-300 mb-3 flex items-center gap-2">
        <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></span>
        Monthly Income Summary
      </h3>

      <div style={{ width: "100%", height: 320 }}>
        <ResponsiveContainer>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(34,211,238,0.1)" />

            <XAxis
              dataKey="month"
              stroke="#22d3ee"
              tick={{ fill: "#a5f3fc", fontSize: 12 }}
            />
            <YAxis
              stroke="#22d3ee"
              tick={{ fill: "#a5f3fc", fontSize: 12 }}
              tickFormatter={(value) => `₹${value / 1000}k`}
            />

            <Tooltip
              contentStyle={{
                backgroundColor: "#0f172a",
                border: "1px solid #22d3ee",
                borderRadius: "10px",
                color: "#e0f2fe",
                boxShadow: "0 0 10px rgba(34,211,238,0.2)",
              }}
              formatter={(value) => [`₹${value.toLocaleString()}`, "Income"]}
            />

            <Legend wrapperStyle={{ color: "#94a3b8", fontSize: "0.9rem" }} />

            <defs>
              <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#22d3ee" stopOpacity={0.9} />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.1} />
              </linearGradient>
            </defs>

            <Line
              type="monotone"
              dataKey="income"
              stroke="url(#incomeGradient)"
              strokeWidth={3}
              dot={{
                r: 5,
                fill: "#22d3ee",
                stroke: "#0f172a",
                strokeWidth: 2,
              }}
              activeDot={{
                r: 7,
                fill: "#a855f7",
                stroke: "#22d3ee",
                strokeWidth: 2,
                filter: "drop-shadow(0 0 6px rgba(168,85,247,0.6))",
              }}
              animationBegin={200}
              animationDuration={800}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default IncomeMonthlyChart;
