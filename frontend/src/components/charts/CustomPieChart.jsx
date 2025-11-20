import React from 'react'
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend
} from 'recharts'

/**
 * Props:
 *  - data: [{ name: string, amount: number }]
 *  - label: string
 *  - totalAmount: number | string
 *  - colors: array of color strings
 *  - showTextAnchor: boolean
 */
const CustomPieChart = ({ data = [], label = '', totalAmount = '', colors = [], showTextAnchor = false }) => {
  // Safety: ensure numeric amounts
  const safeData = (data || []).map(d => ({ ...d, amount: Number(d.amount) || 0 }))

  // If all zeros -> still render but tooltip/legend will show zeros
  const parentStyle = { width: '100%', height: 300, minHeight: 260 }

  return (
    <div className="w-full" style={parentStyle}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={safeData}
            dataKey="amount"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={90}
            innerRadius={56}
            labelLine={false}
            isAnimationActive={true}
          >
            {safeData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length] || '#374151'} />
            ))}
          </Pie>

          <Tooltip
            contentStyle={{
              backgroundColor: '#0f1724',
              borderRadius: 8,
              border: '1px solid rgba(148,163,184,0.12)',
              color: '#e6eef8',
            }}
            itemStyle={{ color: '#e6eef8' }}
          />
          <Legend
            verticalAlign="bottom"
            height={36}
            wrapperStyle={{ color: '#9CA3AF', fontSize: 13 }}
            iconType="circle"
          />

          {/* center labels */}
          {showTextAnchor && (
            <>
              <text
                x="50%"
                y="50%"
                textAnchor="middle"
                dy={-10}
                fill="#9CA3AF"
                fontSize="12"
              >
                {label}
              </text>
              <text
                x="50%"
                y="50%"
                textAnchor="middle"
                dy={18}
                fill="#fff"
                fontSize="18"
                fontWeight="700"
              >
                {totalAmount}
              </text>
            </>
          )}
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}

export default CustomPieChart
