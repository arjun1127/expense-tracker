import React, { useState } from 'react';
import AuthLayout from '../../components/layouts/AuthLayout';
import { useNavigate, Link } from 'react-router-dom';
import Input from '../../components/inputs/Input';
import { validateEmail } from '../../utils/helper';
import ProfilePhotoSelector from '../../components/inputs/ProfilePhotoSelector';
import { API_PATHS } from '../../utils/apiPath';
import axiosInstance from '../../utils/axiosInstance';
import { UserContext } from '../../context/userContext';
import { uploadImage } from '../../utils/uploadImage';
import VerifyOtpModal from './VerifyOtpModal';

const SignUp = () => {
  const [profilePic, setProfilePic] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const navigate = useNavigate();
  const { updateUser } = React.useContext(UserContext);

  const handleSignUp = async (e) => {
    e.preventDefault();
    let profileImageUrl = "";
    if (!validateEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!fullName.trim()) {
      setError('Full name is required.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    setError("");

    try {
      if (profilePic) {
        const imgUploadRes = await uploadImage(profilePic);
        profileImageUrl = imgUploadRes.imageUrl || "";
      }

      await axiosInstance.post(API_PATHS.AUTH.REGISTER, {
        fullName,
        email,
        password,
        profileImageUrl,
      });

      // open OTP modal
      setShowOtpModal(true);

    } catch (err) {
      if (err.response && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    }
  };

  const handleModalClose = () => {
    setShowOtpModal(false);
  };

  const handleVerified = (user) => {
    // user is verified successfully
    // backend usually returns token -> stored already by modal, but update context if user object passed
    if (user) {
      updateUser(user);
    }
    navigate('/dashboard');
  };

  return (
    <AuthLayout>
      <div className="lg:w-[80%] max-w-2xl w-full bg-dark-400 rounded-2xl shadow-lg px-8 py-6 relative">
        <h3 className="text-2xl font-semibold text-light-200 text-center mb-2">
          Create an Account
        </h3>
        <p className="text-sm text-green-400 text-center mb-6">
          Join us today! It only takes a few steps 
        </p>

        <form onSubmit={handleSignUp} className="flex flex-col gap-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <Input
              label="Full Name"
              type="text"
              placeholder="Enter your full name"
              value={fullName}
              onChange={({ target }) => setFullName(target.value)}
              required
            />

            <Input
              label="Email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <div className="flex justify-center md:justify-end">
              <ProfilePhotoSelector image={profilePic} setImage={setProfilePic} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <p className="text-red-500 text-xs mt-1">{error}</p>}

          <button
            type="submit"
            className="mt-2 py-2.5 bg-green-500 text-white text-sm font-semibold rounded-lg shadow hover:bg-green-600 transition"
          >
            Sign Up
          </button>

          <p className="text-xs text-dark-600 text-center mt-4">
            Already have an account?{' '}
            <Link to="/login" className="text-green-400 hover:underline">
              Login
            </Link>
          </p>
        </form>

        {showOtpModal && (
          <VerifyOtpModal
            email={email}
            onClose={handleModalClose}
            onVerified={handleVerified}
          />
        )}
      </div>
    </AuthLayout>
  );
};

export default SignUp;
