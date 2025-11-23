import React, { useState } from 'react'
import {
  LuUtensils,
  LuTrendingUp,
  LuTrendingDown,
  LuTrash2,
  LuCoins,
} from 'react-icons/lu'

const TranscationInfoCard = ({
  icon,
  title,
  date,
  amount,
  type,
  hideDeleteBtn,
  onDelete,
}) => {
  const [showConfirm, setShowConfirm] = useState(false)

  const formattedDate = new Date(date).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: '2-digit',
  })

  const handleDeleteClick = () => {
    setShowConfirm(true)
  }

  const confirmDelete = () => {
    onDelete()
    setShowConfirm(false)
  }

  const cancelDelete = () => {
    setShowConfirm(false)
  }

  return (
    <>
      <div
        className="group relative flex items-center justify-between gap-3 px-3 py-3 
                 rounded-xl border border-dark-500/50 bg-dark-400/50 backdrop-blur-md
                 hover:bg-dark-500/60 hover:border-green-500/40
                 shadow-md hover:shadow-green-500/10
                 transition-all duration-300 ease-out hover:-translate-y-[1px]"
      >
        <div className="flex items-center gap-3 min-w-0">
          <div
            className={`w-10 h-10 flex items-center justify-center text-lg text-white rounded-lg
                      ${
                        type === 'income'
                          ? 'bg-gradient-to-br from-green-500 to-emerald-600'
                          : 'bg-gradient-to-br from-red-500 to-rose-600'
                      }
                      shadow-md shadow-black/30 group-hover:scale-105 transition-transform duration-300`}
          >
            {icon ? (
              <img src={icon} alt={title} className="w-5 h-5 object-contain" />
            ) : (
              <LuCoins />
            )}
          </div>

          <div className="truncate">
            <p className="text-light-100 font-medium text-sm truncate">
              {title}
            </p>
            <p className="text-gray-400 text-xs">{formattedDate}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {!hideDeleteBtn && (
            <button
              onClick={handleDeleteClick}
              className="p-1.5 rounded-md text-gray-400 hover:text-red-400 hover:bg-red-500/10 
                       transition-colors duration-200"
              title="Delete transaction"
            >
              <LuTrash2 size={14} />
            </button>
          )}

          <div className="flex items-center gap-1 text-sm font-semibold">
            <span
              className={`${
                type === 'income' ? 'text-green-400' : 'text-red-400'
              } whitespace-nowrap`}
            >
              {type === 'income' ? '+' : '-'}¥{amount}
            </span>
            {type === 'income' ? (
              <LuTrendingUp className="text-green-400 text-sm" />
            ) : (
              <LuTrendingDown className="text-red-400 text-sm" />
            )}
          </div>
        </div>
      </div>

      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-slate-900/90 border border-cyan-800/40 rounded-xl p-5 shadow-lg shadow-cyan-900/30 w-[90%] max-w-sm">
            <h3 className="text-cyan-300 text-lg font-semibold mb-2">
              Confirm Deletion
            </h3>
            <p className="text-gray-400 text-sm mb-4">
              Are you sure you want to delete this transaction?
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={cancelDelete}
                className="px-3 py-1.5 rounded-md text-gray-300 border border-gray-600 
                           hover:bg-gray-700/40 transition-all duration-200"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-3 py-1.5 rounded-md bg-red-600 hover:bg-red-700 
                           text-white shadow-md shadow-red-900/20 transition-all duration-200"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default TranscationInfoCard
