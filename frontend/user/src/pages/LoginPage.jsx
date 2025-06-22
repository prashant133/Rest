import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [deliveryMethod, setDeliveryMethod] = useState("email"); // Default to email
  const [otpToken, setOtpToken] = useState(null);
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
          navigate("/");
        } else {
          await axios.post("http://localhost:5000/api/v1/user/logout", {}, { withCredentials: true });
          setError("This interface is for regular users only");
        }
      } catch {
        setError(null);
      }
    };
    checkAuth();
  }, [navigate]);

  // Handle email, password, and delivery method submission to send OTP
  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Email and password are required");
      return;
    }
    if (!["email", "sms"].includes(deliveryMethod)) {
      setError("Please select a valid delivery method");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/v1/user/send-otp",
        { email, password, deliveryMethod },
        { withCredentials: true }
      );
      if (response.data.success) {
        setOtpToken(response.data.data.token);
        setIsOtpSent(true);
      } else {
        setError(response.data.message || "Failed to send OTP");
      }
    } catch (err) {
      const message = err.response?.data?.message || "Error sending OTP";
      if (deliveryMethod === "sms") {
        setError(
          "Unable to send OTP via SMS. Please use Email or ensure your mobile number is registered with R.E.S.T."
        );
        setDeliveryMethod("email"); // Switch to email for retry
      } else {
        setError(message);
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle OTP verification
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otp) {
      setError("Please enter the OTP");
      return;
    }
    if (!otpToken || !deliveryMethod) {
      setError("Session expired. Please request a new OTP.");
      setIsOtpSent(false);
      setOtpToken(null);
      setDeliveryMethod("email");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/v1/user/verify-otp",
        { otp, token: otpToken, deliveryMethod },
        { withCredentials: true }
      );
      if (response.data.success) {
        const authResponse = await axios.get("http://localhost:5000/api/v1/user/check-auth", {
          withCredentials: true,
        });
        if (authResponse.data.success && authResponse.data.data.role === "user") {
          setOtpToken(null);
          setDeliveryMethod("email");
          navigate("/");
        } else {
          await axios.post("http://localhost:5000/api/v1/user/logout", {}, { withCredentials: true });
          setError("This interface is for regular users only");
          setIsOtpSent(false);
        }
      } else {
        setError(response.data.message || "Invalid OTP. Please try again.");
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
              <div className="mb-4">
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
              <div className="mb-6">
                <label className="block text-sm font-semibold mb-2">OTP Delivery Method</label>
                <div className="flex space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="deliveryMethod"
                      value="email"
                      checked={deliveryMethod === "email"}
                      onChange={(e) => setDeliveryMethod(e.target.value)}
                      className="mr-2"
                    />
                    Email
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="deliveryMethod"
                      value="sms"
                      checked={deliveryMethod === "sms"}
                      onChange={(e) => setDeliveryMethod(e.target.value)}
                      className="mr-2"
                    />
                    SMS
                  </label>
                </div>
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