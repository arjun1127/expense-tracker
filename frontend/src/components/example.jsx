import React from "react";

const Card = () => {
  return (
    <div className="p-6 rounded-2xl shadow-lg bg-dark-400 text-light-200 max-w-sm">
      <h2 className="text-2xl font-bold text-green-500 mb-2">
        Appointment Status
      </h2>
      <p className="text-dark-700 mb-4">
        This appointment is currently <span className="text-red-700">Pending</span>.
      </p>

      <div className="h-32 rounded-lg bg-pending bg-cover bg-center flex items-center justify-center">
        <span className="animate-caret-blink text-blue-500 font-mono text-lg">
          Loading...
        </span>
      </div>

      <button className="mt-4 px-4 py-2 rounded-lg bg-green-500 hover:bg-green-600 text-white transition">
        Confirm
      </button>
    </div>
  );
};

export default Card;
