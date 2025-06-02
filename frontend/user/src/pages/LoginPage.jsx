import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const navigate = useNavigate();

  // Check authentication status on component mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/v1/user/check-auth", {
          withCredentials: true,
        });
        if (response.data.success && response.data.data.role === "user") {
          // If user is authenticated and has role "user", redirect to home
          navigate("/");
        } else {
          // If role is not "user", clear cookies and show error
          await axios.post("http://localhost:5000/api/v1/user/logout", {}, { withCredentials: true });
          setError("This interface is for regular users only");
        }
      } catch {
        // Not authenticated, stay on login page
        setError(null);
      }
    };
    checkAuth();
  }, [navigate]);

  // Handle email and password submission to send OTP
  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Email and password are required");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/v1/user/send-otp",
        { email, password },
        { withCredentials: true }
      );
      if (response.data.success) {
        setIsOtpSent(true);
      } else {
        setError(response.data.message || "Failed to send OTP");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Error sending OTP");
    } finally {
      setLoading(false);
    }
  };

  // Handle OTP verification
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otp) {
      setError("OTP is required");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/v1/user/verify-otp",
        { otp },
        { withCredentials: true }
      );
      if (response.data.success) {
        // Check if the user has the "user" role
        const authResponse = await axios.get("http://localhost:5000/api/v1/user/check-auth", {
          withCredentials: true,
        });
        if (authResponse.data.success && authResponse.data.data.role === "user") {
          navigate("/");
        } else {
          // If role is not "user", trigger logout
          await axios.post("http://localhost:5000/api/v1/user/logout", {}, { withCredentials: true });
          setError("This interface is for regular users only");
        }
      } else {
        setError(response.data.message || "Failed to verify OTP");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Error verifying OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Header Section */}
      <section className="bg-gradient-to-b from-[#0c1c35] to-[#13284c] text-white py-20 text-center">
        <h1 className="text-4xl font-bold mb-0">Login to R.E.S.T</h1>
        <p className="text-lg max-w-2xl mx-auto mt-2">
          Access your account to connect with the retired telecommunications community.
        </p>
      </section>

      {/* Login Form Section */}
      <section className="py-16 px-6">
        <div className="max-w-md mx-auto">
          <h2 className="text-3xl font-bold text-center mb-10">Sign In</h2>
          {error && (
            <div className="text-center py-4 text-red-600">
              <p>{error}</p>
            </div>
          )}
          {!isOtpSent ? (
            <form onSubmit={handleSendOtp} className="border border-gray-700 rounded-lg p-6">
              <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-semibold mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-700 rounded-lg bg-gray-100 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="Enter your email"
                  required
                />
              </div>
              <div className="mb-6">
                <label htmlFor="password" className="block text-sm font-semibold mb-2">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-700 rounded-lg bg-gray-100 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="Enter your password"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-black text-white px-5 py-2 rounded hover:bg-gray-800 transition"
                disabled={loading}
              >
                {loading ? "Sending OTP..." : "Send OTP"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="border border-gray-700 rounded-lg p-6">
              <div className="mb-6">
                <label htmlFor="otp" className="block text-sm font-semibold mb-2">
                  OTP
                </label>
                <input
                  type="text"
                  id="otp"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-700 rounded-lg bg-gray-100 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="Enter the OTP"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-black text-white px-5 py-2 rounded hover:bg-gray-800 transition"
                disabled={loading}
              >
                {loading ? "Verifying OTP..." : "Verify OTP"}
              </button>
            </form>
          )}
          <p className="text-center mt-4 text-sm">
            Don't have an account?{" "}
            <Link to="/signup" className="text-blue-400 hover:underline">
              Sign Up
            </Link>
          </p>
          <p className="text-center mt-2 text-sm">
            <Link to="/forgot-password" className="text-blue-400 hover:underline">
              Forgot Password?
            </Link>
          </p>
        </div>
      </section>
    </>
  );
}

export default Login;