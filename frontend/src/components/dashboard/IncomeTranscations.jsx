import React from 'react'
import TranscationInfoCard from '../cards/TranscationInfoCard'
import { LuCalendarDays } from 'react-icons/lu'

const IncomeTranscations = ({ transactions }) => {
  return (
    <div className="card relative overflow-hidden">
      <div className="flex items-center justify-between mb-6 mt-2 px-1">
        <h5 className="flex items-center gap-2 font-semibold bg-gradient-to-r from-green-400 via-blue-400 to-cyan-300 bg-clip-text text-transparent tracking-wide drop-shadow-md">
          <LuCalendarDays className="text-cyan-300" />
          Incomes for Last 2 Months
        </h5>

       
      </div>

      <div className="max-h-[350px] overflow-y-auto pr-2 scroll-hidden">
        {transactions?.length > 0 ? (
          transactions.slice(0, 5).map((income) => (
            <div key={income._id} className="mb-3 last:mb-0">
              <TranscationInfoCard
                title={income.category || 'Unknown Category'}
                icon={income.icon}
                amount={income.amount}
                date={income.date}
                type="income"
                hideDeleteBtn
              />
            </div>
          ))
        ) : (
          <p className="text-gray-400 text-sm mt-3 text-center">
            No income records for the past 60 days.
          </p>
        )}
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent"></div>
    </div>
  )
}

export default IncomeTranscations
