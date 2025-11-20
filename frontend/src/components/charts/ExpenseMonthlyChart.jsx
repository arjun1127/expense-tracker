import React from "react";
import { motion } from "framer-motion";
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

const ExpenseMonthlyChart = ({ data }) => {
  const chartData =
    data?.months?.map((month, index) => ({
      month,
      expense: data.values[index],
    })) || [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 via-rose-950/30 to-red-950/40 border border-rose-700/40 
                 shadow-lg shadow-rose-900/20 hover:shadow-rose-700/30 transition-all duration-300"
    >
      <h3 className="text-lg font-semibold text-rose-300 mb-3 flex items-center gap-2">
        <span className="w-2 h-2 bg-rose-400 rounded-full animate-pulse"></span>
        Monthly Expense Summary
      </h3>

      <div style={{ width: "100%", height: 320 }}>
        <ResponsiveContainer>
          <LineChart data={chartData}>
            {/* Soft grid lines */}
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(244,63,94,0.1)" />

            {/* X and Y axes styling */}
            <XAxis
              dataKey="month"
              stroke="#fb7185"
              tick={{ fill: "#fecdd3", fontSize: 12 }}
            />
            <YAxis
              stroke="#fb7185"
              tick={{ fill: "#fecdd3", fontSize: 12 }}
              tickFormatter={(value) => `₹${value / 1000}k`}
            />

            {/* Tooltip styling */}
            <Tooltip
              contentStyle={{
                backgroundColor: "#0f172a",
                border: "1px solid #fb7185",
                borderRadius: "10px",
                color: "#ffe4e6",
                boxShadow: "0 0 10px rgba(244,63,94,0.2)",
              }}
              formatter={(value) => [`₹${value.toLocaleString()}`, "Expense"]}
            />

            <Legend wrapperStyle={{ color: "#fecaca", fontSize: "0.9rem" }} />

            {/* Line gradient for smooth visuals */}
            <defs>
              <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#fb7185" stopOpacity={0.9} />
                <stop offset="100%" stopColor="#be123c" stopOpacity={0.1} />
              </linearGradient>
            </defs>

            {/* Line for Expense */}
            <Line
              type="monotone"
              dataKey="expense"
              stroke="url(#expenseGradient)"
              strokeWidth={3}
              dot={{
                r: 5,
                fill: "#fb7185",
                stroke: "#0f172a",
                strokeWidth: 2,
              }}
              activeDot={{
                r: 7,
                fill: "#f43f5e",
                stroke: "#fb7185",
                strokeWidth: 2,
                filter: "drop-shadow(0 0 6px rgba(244,63,94,0.6))",
              }}
              animationBegin={200}
              animationDuration={800}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default ExpenseMonthlyChart;
