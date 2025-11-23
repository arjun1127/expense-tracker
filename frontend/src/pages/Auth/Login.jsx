import React, { useState } from 'react'
import AuthLayout from '../../components/layouts/AuthLayout'
import { useNavigate, Link } from 'react-router-dom'
import Input from '../../components/inputs/Input'
import { validateEmail } from '../../utils/helper'
import { API_PATHS } from '../../utils/apiPath'
import axiosInstance from '../../utils/axiosInstance'
import { UserContext } from '../../context/userContext'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null);
  const {updateUser} = React.useContext(UserContext);
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    
    if(!validateEmail(email)) {
      setError("Please enter a valid email address.")
      return;
    }

    if(!password) {
      setError("Password cannot be empty.")
      return;
    }
    setError('');

    //login API call
    try{
      const response=await axiosInstance.post(API_PATHS.AUTH.LOGIN, {email, password});
      const {token, user}=response.data;
      if(token) {
        localStorage.setItem('token', token);
        updateUser(user);
        navigate('/dashboard');
      }
    }catch(err) {
      if(err.response && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
  }
}
  return (
    <AuthLayout>
      <div className="lg:w-[70%] w-full max-w-md bg-dark-400 rounded-2xl p-8 shadow-lg">
        <h3 className="text-2xl font-semibold text-light-200 mb-2">
          Welcome Back 👋
        </h3>
        <p className="text-sm text-dark-700 mb-6">
          Please login to continue managing your expenses
        </p>

        <form onSubmit={handleLogin} className="flex flex-col gap-2">
          <Input
            label="Email Address"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            label="Password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && <p className="text-red-500 text-sm mt-1">{error}</p>}

          <button
            type="submit"
            className="mt-4 py-3 bg-green-500 text-white font-semibold rounded-xl shadow-md hover:bg-green-600 transition-all duration-200"
          >
            Login
          </button>
        </form>

        <p className="text-xs text-dark-600 text-center mt-6">
          Don’t have an account?{' '}
          <Link to="/signup" className="text-green-500 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </AuthLayout>
  )
}

export default Login;
