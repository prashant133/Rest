import { useState } from 'react';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

const Index = () => {
  const [currentPage, setCurrentPage] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(email, password)) {
      navigate('/');
    }
  };

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Sending OTP to:', email);
    setCurrentPage('otp');
  };

  const handleOtpVerification = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Verifying OTP:', otp);
    setCurrentPage('reset');
  };

  const handlePasswordReset = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    console.log('Password reset successful');
    setCurrentPage('login');
    setEmail('');
    setPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setOtp('');
  };

  const renderLoginPage = () => (
    <Card className="w-full max-w-md bg-white/80 backdrop-blur-sm border-blue-200 shadow-lg">
      <CardContent className="p-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-blue-800 mb-2">REST</h1>
          <p className="text-xl text-blue-700">Admin Login</p>
        </div>
        
        <form onSubmit={handleLogin} className="space-y-6">
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-600 h-5 w-5" />
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-12 h-12 border-blue-300 focus:border-blue-500 rounded-lg"
              required
            />
          </div>
          
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-600 h-5 w-5" />
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-12 pr-12 h-12 border-blue-300 focus:border-blue-500 rounded-lg"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-600"
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
          
          <Button 
            type="submit" 
            className="w-full h-12 bg-yellow-400 hover:bg-yellow-500 text-blue-800 font-semibold rounded-lg transition-colors"
          >
            Login
          </Button>
          
          <div className="text-center">
            <span className="text-blue-600">Forgot password? </span>
            <button
              type="button"
              onClick={() => setCurrentPage('forgot')}
              className="text-yellow-600 hover:text-yellow-700 transition-colors"
            >
              Click Here
            </button>
          </div>
        </form>
      </CardContent>
    </Card>
  );

  const renderForgotPasswordPage = () => (
    <Card className="w-full max-w-md bg-white/80 backdrop-blur-sm border-blue-200 shadow-lg">
      <CardContent className="p-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-blue-800 mb-4">REST</h1>
          <p className="text-blue-700 text-lg">Enter your email address</p>
        </div>
        
        <form onSubmit={handleForgotPassword} className="space-y-6">
          <div>
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-12 border-blue-300 focus:border-blue-500 rounded-lg"
              required
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full h-12 bg-yellow-400 hover:bg-yellow-500 text-blue-800 font-semibold rounded-lg transition-colors"
          >
            Send OTP
          </Button>
          
          <div className="text-center">
            <button
              type="button"
              onClick={() => setCurrentPage('login')}
              className="text-blue-600 hover:text-yellow-600 transition-colors"
            >
              Back to Login
            </button>
          </div>
        </form>
      </CardContent>
    </Card>
  );

  const renderOtpPage = () => (
    <Card className="w-full max-w-md bg-white/80 backdrop-blur-sm border-blue-200 shadow-lg">
      <CardContent className="p-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-blue-800 mb-4">REST</h1>
          <p className="text-blue-700 text-lg">Enter OTP</p>
        </div>
        
        <form onSubmit={handleOtpVerification} className="space-y-6">
          <div>
            <Input
              type="text"
              placeholder="OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="h-12 border-blue-300 focus:border-blue-500 rounded-lg text-center text-xl tracking-widest"
              maxLength={6}
              required
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full h-12 bg-yellow-400 hover:bg-yellow-500 text-blue-800 font-semibold rounded-lg transition-colors"
          >
            Verify OTP
          </Button>
          
          <div className="text-center">
            <button
              type="button"
              onClick={() => setCurrentPage('forgot')}
              className="text-blue-600 hover:text-yellow-600 transition-colors"
            >
              Back to Email Entry
            </button>
          </div>
        </form>
      </CardContent>
    </Card>
  );

  const renderResetPasswordPage = () => (
    <Card className="w-full max-w-md bg-white/80 backdrop-blur-sm border-blue-200 shadow-lg">
      <CardContent className="p-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-blue-800 mb-4">REST</h1>
          <p className="text-blue-700 text-lg">Change Password</p>
        </div>
        
        <form onSubmit={handlePasswordReset} className="space-y-6">
          <div className="relative">
            <Input
              type={showNewPassword ? "text" : "password"}
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="pr-12 h-12 border-blue-300 focus:border-blue-500 rounded-lg"
              required
            />
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-600"
            >
              {showNewPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
          
          <div>
            <Input
              type="password"
              placeholder="Confirm New Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="h-12 border-blue-300 focus:border-blue-500 rounded-lg"
              required
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full h-12 bg-yellow-400 hover:bg-yellow-500 text-blue-800 font-semibold rounded-lg transition-colors"
          >
            Change Password
          </Button>
          
          <div className="text-center">
            <button
              type="button"
              onClick={() => setCurrentPage('login')}
              className="text-blue-600 hover:text-yellow-600 transition-colors"
            >
              Back to Login
            </button>
          </div>
        </form>
      </CardContent>
    </Card>
  );

  const getCurrentPageComponent = () => {
    switch (currentPage) {
      case 'login':
        return renderLoginPage();
      case 'forgot':
        return renderForgotPasswordPage();
      case 'otp':
        return renderOtpPage();
      case 'reset':
        return renderResetPasswordPage();
      default:
        return renderLoginPage();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {getCurrentPageComponent()}
        
        {/* Footer */}
        <div className="mt-8 text-center">
          <div className="flex justify-end space-x-4 mb-4">
            <button className="text-blue-600 hover:text-blue-800 transition-colors">
              Contact
            </button>
            <button className="text-blue-600 hover:text-blue-800 transition-colors">
              Help
            </button>
          </div>
          <p className="text-blue-600 text-sm">
            2025 REST. All Rights Reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
