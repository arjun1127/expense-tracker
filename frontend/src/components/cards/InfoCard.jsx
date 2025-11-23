import React from 'react'
import { FaYenSign } from 'react-icons/fa'

const InfoCard = ({ icon, label, value, color }) => {
  return (
    <div className="group flex items-center gap-6 p-6 rounded-2xl border border-dark-500/70 bg-dark-400/60 
                    backdrop-blur-md shadow-lg shadow-black/40 hover:shadow-green-500/20 
                    transition-all duration-500 ease-out hover:-translate-y-2">
     
      <div
        className={`w-14 h-14 flex items-center justify-center text-[26px] text-white ${color} 
                    rounded-2xl drop-shadow-lg transition-transform duration-300 group-hover:scale-110`}
      >
        {icon}
      </div>

      <div>
        <h6 className="text-sm text-gray-400 mb-1 tracking-wide">{label}</h6>
        <span className="text-[22px] md:text-[24px] flex items-center gap-1 text-light-100 font-semibold">
          <FaYenSign className="text-green-400" />
          {value}
        </span>
      </div>
    </div>
  )
}

export default InfoCard
