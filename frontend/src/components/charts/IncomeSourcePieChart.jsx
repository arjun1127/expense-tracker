import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { motion } from "framer-motion";

const COLORS = ["#06b6d4", "#3b82f6", "#8b5cf6", "#22d3ee", "#0ea5e9", "#a855f7"];
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div
        className="p-3 rounded-lg shadow-lg border border-cyan-700/30"
        style={{
          background:
            "linear-gradient(145deg, rgba(15,23,42,0.9) 0%, rgba(8,51,68,0.95) 100%)",
        }}
      >
        <p className="text-cyan-300 font-medium">{payload[0].name}</p>
        <p className="text-gray-300 text-sm">
          ₹{payload[0].value.toLocaleString()}
        </p>
      </div>
    );
  }
  return null;
};

const IncomeSourcePieChart = ({ data = [] }) => {
  const chartData =
    data.length > 0
      ? data.map((item) => ({
          name: item.source,
          value: item.total,
        }))
      : [{ name: "No Data", value: 1 }];

  return (
    <motion.div
      className="p-5 rounded-2xl border border-cyan-800/30 bg-gradient-to-br from-dark-500/40 via-dark-600/40 to-dark-700/40 shadow-lg shadow-cyan-900/20"
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      whileHover={{
        boxShadow: "0 0 25px rgba(34,211,238,0.25)",
        transition: { duration: 0.3 },
      }}
    >
      <h3 className="text-lg md:text-xl font-semibold text-cyan-300 mb-4 flex items-center justify-between">
        Income by Source
        <span className="text-xs font-medium text-gray-500 italic">
          (Distribution)
        </span>
      </h3>

      <div style={{ width: "100%", height: 320 }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={110}
              paddingAngle={3}
              dataKey="value"
              label={({ name, value }) => `${name}: ₹${value.toLocaleString()}`}
              labelLine={false}
              animationBegin={200}
              animationDuration={1000}
              animationEasing="ease-out"
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                  style={{
                    filter:
                      data.length > 0
                        ? "drop-shadow(0 0 6px rgba(34,211,238,0.4))"
                        : "none",
                    transition: "all 0.3s ease",
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) =>
                    (e.target.style.filter =
                      "drop-shadow(0 0 12px rgba(34,211,238,0.7))")
                  }
                  onMouseLeave={(e) =>
                    (e.target.style.filter =
                      "drop-shadow(0 0 6px rgba(34,211,238,0.4))")
                  }
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend
              verticalAlign="bottom"
              height={40}
              wrapperStyle={{
                color: "#94a3b8",
                fontSize: "0.85rem",
                paddingTop: "10px",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {data.length > 0 && (
        <motion.div
          className="mt-4 p-3 rounded-lg border border-cyan-700/20 bg-dark-700/30 text-gray-300 text-sm"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <p className="text-cyan-400 font-medium mb-1">Top 3 Sources:</p>
          <ul className="list-disc list-inside space-y-1 text-gray-400">
            {data.slice(0, 3).map((item, i) => (
              <li key={i}>
                <span className="text-gray-200">{item.source}</span> — ₹
                {item.total.toLocaleString()}
              </li>
            ))}
          </ul>
        </motion.div>
      )}
    </motion.div>
  );
};

export default IncomeSourcePieChart;
