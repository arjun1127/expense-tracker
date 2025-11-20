// AuthLayout.jsx
import React from 'react';
import extHome from '../../assets/images/exT_homePage.png';
import { LuTrendingUpDown } from 'react-icons/lu';
import { FaYenSign } from 'react-icons/fa';

const AuthLayout = ({ children }) => {
  return (
    <div className="flex w-screen h-screen bg-dark-300">
      {/* Left Section */}
      <div className="w-full md:w-[60vw] h-full px-10 md:px-16 pt-12 pb-12 bg-dark-300 text-light-200 flex flex-col justify-between shadow-xl">
        <div>
          <h2 className="text-3xl font-bold text-green-500 mb-2">
          Expense Tracker
        </h2>
        <p className="text-sm text-dark-600">
          Manage your expenses with ease
        </p>
        </div>

        <div className="flex-1 flex items-center justify-center">{children}</div>

        <p className="text-xs text-dark-700 mt-8 text-center">
          © 2025 Expense Tracker. All rights reserved.
        </p>
      </div>

      {/* Right Section (Decor + Illustration) */}
      <div className="hidden md:block w-[40vw] h-full bg-dark-100 bg-auth-bg-img bg-cover bg-no-repeat bg-center relative overflow-hidden">
        {/* Decorative Shapes */}
        <div className="w-48 h-48 rounded-[40px] bg-green-400 absolute -top-7 -left-5 opacity-90 animate-pulse" />
        <div className="w-48 h-56 rounded-[40px] border-[20px] border-b-cyan-500 absolute -right-10 opacity-80" />
        <div className="w-48 h-56 rounded-[40px] bg-purple-400 absolute -bottom-7 left-5 opacity-90" />

        {/* Background Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-dark-200/40 to-dark-400/60" />

        <div className='grid grid-cols-1 z-20'>
          <StatsInfoCard 
          icon={<LuTrendingUpDown/>}
          label="Track your Income & Expenses"
          value="216,000"
          color="bg-green-500"
          />
        </div>

        {/* Image */}
        <img
          src={extHome}
          alt="auth img"
          className="w-72 lg:w-[95%] absolute bottom-20 left-1/2 -translate-x-1/2 
                    rounded-2xl shadow-lg shadow-blue-950"
        />
      </div>
    </div>
  );
};

export default AuthLayout;

const StatsInfoCard = ({ icon, label, value, color }) => {
  return (
    <div className="flex gap-6 bg-dark-400/90 backdrop-blur-md p-5 rounded-2xl shadow-2xl border border-dark-500 transition-transform hover:-translate-y-1 hover:shadow-green-500/20 duration-300 w-fit my-6 max-h-100 mx-auto">
      {/* Icon Circle */}
      <div
        className={`w-12 h-12 flex items-center justify-center text-[26px] text-white ${color} rounded-full drop-shadow-lg`}
      >
        {icon}
      </div>

      {/* Text Content */}
      <div>
        <h6 className="text-xs text-dark-700 mb-1">{label}</h6>
        <span className="text-[20px] flex items-center gap-1 text-light-200">
          <FaYenSign className="text-green-500" />
          {value}
        </span>
      </div>
    </div>
  )
}


