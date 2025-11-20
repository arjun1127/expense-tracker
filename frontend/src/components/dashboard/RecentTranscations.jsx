import React from 'react'
import { LuArrowRight } from 'react-icons/lu'
import TranscationInfoCard from '../cards/TranscationInfoCard'

const RecentTranscations = ({ transactions, onSeeMore }) => {
  return (
    <div className="card relative overflow-hidden">

      {/* Header */}
      <div className="flex items-center justify-between mb-6 mt-2 px-1">
        <h5 className="font-semibold bg-gradient-to-r from-green-800 via-blue-400 to-green-400 bg-clip-text text-transparent tracking-wide drop-shadow-md">
          Activity 
        </h5>
        &nbsp;
        &nbsp;
        <button
          className="flex items-center gap-2 text-sm font-medium bg-gradient-to-r from-blue-500/20 to-purple-500/20 hover:from-blue-500/30 hover:to-purple-500/30 text-cyan-200 px-4 py-1.5 rounded-full backdrop-blur-md border border-cyan-500/20 transition-all duration-300 hover:scale-[1.05]"
          onClick={onSeeMore}
        >
           Expenses {/*<LuArrowRight className="text-base" /> */}
        </button>
      </div>

     <div className="flex flex-col gap-3 max-h-72 overflow-y-auto pr-2 scroll-hidden">
        {transactions?.length > 0 ? (
          transactions.slice(0, 5).map((item) => (
            <div key={item._id}>
              <TranscationInfoCard
                icon={item.icon}
                title={item.type === 'expense' ? item.category : item.source}
                date={item.date}
                amount={item.amount}
                type={item.type}
                hideDeleteBtn
              />
            </div>
          ))
        ) : (
          <p className="text-gray-400 text-sm mt-3">
            No recent transactions found.
          </p>
        )}
      </div>
    </div>
  )
}

export default RecentTranscations
