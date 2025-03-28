import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import Dashboard1 from '../../assets/dashboard1.png';
import Dashboard2 from '../../assets/dashboard2.png';
import Dashboard3 from '../../assets/dashboard3.png';
import { loginUser } from "../../services/api";

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [activeImage, setActiveImage] = useState(0);
  const images = [Dashboard1, Dashboard2, Dashboard3];

  // Automatically change the image every 2 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveImage((prev) => (prev + 1) % images.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [images.length]);

  // Redirect if already authenticated
  if (isAuthenticated) {
    navigate('/dashboard', { replace: true });
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error('Please enter both email and password');
      return;
    }

    setIsLoading(true);
    try {
      const success = await login(email, password); // Pass email and password correctly
      if (success) {
        navigate('/dashboard'); // Navigate to dashboard on success
      } else {
        toast.error('Invalid email or password');
      }
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <div className="flex items-end justify-center mb-6">
        <div className="w-8 h-8 border-4 border-[#4B0082] mr-2"></div>
        <span className="text-purple-900 text-2xl font-bold">LOGO</span>
      </div>
      <div className="flex items-center justify-center bg-gray-100">
        <div className="w-full max-w-5xl bg-white rounded-lg shadow-lg overflow-hidden flex flex-col md:flex-row h-[500px]">
          {/* Left Section */}
          <div className="hidden md:flex w-1/2 bg-[#4B0082] flex-col justify-between p-6 text-white">
            <div>
              <h2 className="text-2xl font-semibold mb-4">Welcome Back</h2>
              <p className="text-sm text-white/80 mb-6">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </p>
            </div>
            <div className="flex-1 flex items-center justify-center relative">
              {images.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`Dashboard Preview ${index + 1}`}
                  className={`absolute w-full max-w-md rounded-lg transition-opacity duration-500 ${
                    activeImage === index ? 'opacity-100' : 'opacity-0'
                  }`}
                />
              ))}
            </div>
            {/* Dots for navigation */}
            <div className="flex justify-center mt-4 space-x-2">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveImage(index)}
                  className={`w-3 h-3 rounded-full ${
                    activeImage === index ? 'bg-white' : 'bg-white/50'
                  }`}
                ></button>
              ))}
            </div>
            <p className="text-sm text-white/60 text-center mt-6">
              Human Resource Management System © 2023
            </p>
          </div>

          {/* Right Section */}
          <div className="flex-1 flex flex-col items-center justify-center p-6">
            <div className="w-full max-w-md">
              <h1 className="text-2xl font-semibold mb-4 text-center">Welcome Back</h1>
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Email Field */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="Enter your email"
                    className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4B0082]"
                  />
                </div>

                {/* Password Field */}
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      placeholder="Enter your password"
                      className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4B0082]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 px-4 py-2 text-gray-500"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                {/* Forgot Password */}
                <div className="flex justify-between items-center">
                  <Link to="/forgot-password" className="text-sm text-[#4B0082] hover:underline">
                    Forgot password?
                  </Link>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full py-2 rounded-lg text-white font-medium ${
                    isLoading ? 'bg-[#4B0082]/70 cursor-not-allowed' : 'bg-[#4B0082] hover:bg-[#4B0082]/90'
                  } transition-colors`}
                >
                  {isLoading ? 'Logging in...' : 'Login'}
                </button>
              </form>

              {/* Register Link */}
              <p className="text-center text-sm text-gray-600 mt-4">
                Don't have an account?{' '}
                <Link to="/register" className="text-[#4B0082] font-medium hover:underline">
                  Register
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;