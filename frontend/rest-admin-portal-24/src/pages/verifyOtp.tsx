import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';

const VerifyOtp: React.FC = () => {
  const [otp, setOtp] = useState('');
  const { verifyOtp } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await verifyOtp(otp);
    if (success) {
      toast({
        title: 'OTP Verified',
        description: 'You have successfully verified your OTP.',
      });
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="w-full bg-white/80 backdrop-blur-sm border-blue-200 shadow-lg">
          <CardContent className="p-8">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-blue-800 mb-4">REST</h1>
              <p className="text-blue-700 text-lg">Enter OTP</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
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
                  onClick={() => navigate('/login')}
                  className="text-blue-600 hover:text-yellow-600 transition-colors"
                >
                  Back to Login
                </button>
              </div>
            </form>
          </CardContent>
        </Card>

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

export default VerifyOtp;