import React from 'react'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from "react-router-dom";
import Login from './pages/Auth/Login';
import SignUp from './pages/Auth/SignUp';
import Home from './pages/Dashboard/Home';
import Income from './pages/Dashboard/Income';
import Expense from './pages/Dashboard/Expense';
import UserProvider from './context/userContext';
import VerifyOtp from "./pages/Auth/VerifyOtpModal";


function App() {
  return (
    <UserProvider>
    <div className="min h-screen bg-dark-300 text-light-200 flex">
      <Router>
        <Routes>
          <Route path='/' element={<Root />}/>
          <Route path='/login' element={<Login />}/>
          <Route path='/dashboard' element={<Home />}/>
          <Route path='/income' element={<Income />}/>
          <Route path='/signup' element={<SignUp />}/>
          <Route path='/expense' element={<Expense />}/>
          <Route path="/verify-otp" element={<VerifyOtp />} />

        </Routes>
      </Router>
    </div>
    </UserProvider>
  )
}

export default App

const Root = () => {
  // check if token is present in localStorage
  const isAuthenticated = !!localStorage.getItem('token');
  // redirect to dashboard if token is present else redirect to login
  return isAuthenticated ? <Navigate to="/dashboard" /> : <Navigate to="/login" />;
};
