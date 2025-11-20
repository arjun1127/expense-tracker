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

const SignUp = () => {
  const [profilePic, setProfilePic] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const {updateUser} = React.useContext(UserContext);

  const handleSignUp = async (e) => {
    e.preventDefault();
    let profileImageUrl=""
    if (!validateEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    if(!fullName.trim()){
      setError('Full name is required.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    setError("");
    // signup logic here...

    try{
      if(profilePic){
        const imgUploadRes=await uploadImage(profilePic);
        profileImageUrl=imgUploadRes.imageUrl || "";

      }
      const response=await axiosInstance.post(API_PATHS.AUTH.REGISTER, {fullName, email, password,profileImageUrl });
      const {token,user}=response.data;
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
  };
}

  return (
    <AuthLayout>
        <div className="lg:w-[80%] max-w-2xl w-full bg-dark-400 rounded-2xl shadow-lg px-8 py-6">
        {/* Heading */}
        <h3 className="text-2xl font-semibold text-light-200 text-center mb-2">
          Create an Account
        </h3>
        <p className="text-sm text-green-400 text-center mb-6">
          Join us today! It only takes a few steps 
        </p>

        {/* Form */}
        <form onSubmit={handleSignUp} className="flex flex-col gap-4">
          {/* First Row: Full Name + Email + Profile Photo */}
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

          {/* Second Row: Password */}
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

          {/* Error Message */}
          {error && <p className="text-red-500 text-xs mt-1">{error}</p>}

          {/* Submit Button */}
          <button
            type="submit"
            className="mt-2 py-2.5 bg-green-500 text-white text-sm font-semibold rounded-lg shadow hover:bg-green-600 transition"
          >
            Sign Up
          </button>

          {/* Footer */}
          <p className="text-xs text-dark-600 text-center mt-4">
            Already have an account?{' '}
            <Link to="/login" className="text-green-400 hover:underline">
              Login
            </Link>
          </p>
        </form>
      </div>
    </AuthLayout>
  );
};

export default SignUp;

