import React, { useState } from 'react'
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa'
import '../../index.css';

const Input = ({ value, onChange, placeholder, label, type }) => {
  const [showPassword, setShowPassword] = useState(false)

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev)
  }

  return (
    <div className="w-full">
      {label && (
        <label className="text-[13px] text-light-200 block mb-1">{label}</label>
      )}

      <div className="input-box">
        <input
          type={type === 'password' ? (showPassword ? 'text' : 'password') : type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className="w-full bg-transparent outline-none border-none placeholder:text-white text-white"
        />

        {type === 'password' && (
          <span onClick={togglePasswordVisibility} className="cursor-pointer">
            {showPassword ? (
              <FaRegEye className="text-white" size={20} />
            ) : (
              <FaRegEyeSlash className="text-white" size={20} />
            )}
          </span>
        )}
      </div>
    </div>
  )
}

export default Input
