import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  getAuth,
  signInWithEmailAndPassword,
  signInWithPopup,
} from 'firebase/auth';
import {
  auth as Authenticate,
  provider,
  signInWithGoogle,
} from '../firebaseSetup';
import { FaGoogle, FaEnvelope, FaLock, FaGithub } from 'react-icons/fa';
import { Navigate } from 'react-router-dom';
import Loader from '@/components/Loader';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const [isAuthChecked, setIsAuthChecked] = useState(false);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setIsLogin(true);
      }
      setIsAuthChecked(true);
    });
    return () => unsubscribe();
  }, []);

  if (!isAuthChecked) {
    return (
      <div className="flex flex-col gap-3 items-center justify-center min-h-screen bg-gradient-to-br from-purple-400 to-indigo-600">
        <Loader />
        <h1 className="text-pretty ts">Authenticating...</h1>
      </div>
    );
  }

  if (isLogin) {
    return <Navigate to="/projects" replace />;
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await signInWithEmailAndPassword(Authenticate, email, password);
      <Navigate to="/dashboard" replace />;
    } catch (e) {
      setError('Invalid Email or Password');
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      await signInWithGoogle();
      <Navigate to="/dashboard" replace />;
    } catch (e) {
      setError('Invalid credentials');
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGithubLogin = async () => {
    setIsLoading(true);
    try {
      const obj = await signInWithPopup(Authenticate, provider);
      console.log(obj);
      <Navigate to="/dashboard" replace />;
    } catch (e) {
      console.log(e);
      setError('Invalid credentials');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-400 to-indigo-600">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white p-8 rounded-lg shadow-xl w-96"
      >
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
          Login
        </h2>
        {error && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-red-500 mb-4 text-center"
          >
            {error}
          </motion.p>
        )}
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="relative">
            <FaEnvelope className="absolute top-3 left-3 text-gray-400" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full p-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>
          <div className="relative">
            <FaLock className="absolute top-3 left-3 text-gray-400" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full p-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>
          <motion.button
            type="submit"
            className="w-full bg-purple-600 text-white p-2 rounded-md hover:bg-purple-700 transition-colors duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={isLoading}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </motion.button>
        </form>
        <div className="mt-4">
          <motion.button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full bg-red-500 text-white p-2 rounded-md hover:bg-red-600 transition-colors duration-300 flex items-center justify-center"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={isLoading}
          >
            <FaGoogle className="mr-2" />
            {isLoading ? 'Logging in...' : 'Login with Google'}
          </motion.button>
        </div>
        <div className="mt-4">
          <motion.button
            type="button"
            onClick={handleGithubLogin}
            className="w-full bg-white border border-black border-2 text-black p-2 rounded-md  transition-colors duration-300 flex items-center justify-center"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={isLoading}
          >
            <FaGithub className="mr-2" />
            {isLoading ? 'Logging in...' : 'Login with Github'}
          </motion.button>
        </div>

        <div className="mt-4 text-center">
          <p className="text-gray-600 text-sm">
            Don't have an account?{' '}
            <a
              href="/signup"
              className="text-purple-600 hover:underline text-base"
            >
              Register
            </a>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
