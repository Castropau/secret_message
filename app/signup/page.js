'use client';

import { useState } from 'react';
import supabase from '../utils/supabase';
import { useRouter } from 'next/navigation';

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const signUp = async (e) => {
    e.preventDefault();
    const { user, error } = await supabase.auth.signUp({ email, password });
    if (error) {
      console.error('Error:', error.message);
      alert('Error signing up');
    } else {
      alert('Check your email for confirmation');
      router.push('/signin');  // Redirect to sign-in page after successful sign-up
    }
  };

  // Go to Sign In page
  const goToSignIn = () => {
    router.push('./');  // Navigate to Sign In page
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm">
        <h1 className="text-2xl font-semibold text-center mb-6">Sign Up</h1>
        <form onSubmit={signUp} className="space-y-4">
          <div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition"
          >
            Sign Up
          </button>
        </form>

        {/* Button to navigate to Sign In page */}
        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">Already have an account?</p>
          <button
            onClick={goToSignIn}
            className="text-blue-500 hover:text-blue-600 text-sm font-semibold"
          >
            Go to Sign In
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
