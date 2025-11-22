import React, { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPath";

const VerifyOtpModal = ({ email, onClose, onVerified }) => {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(60);

  useEffect(() => {
    // start countdown for resend
    setSecondsLeft(60);
    const t = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          clearInterval(t);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [email]);

  const handleVerify = async (e) => {
    e?.preventDefault();
    setError("");
    if (!otp || otp.length !== 6) {
      setError("Enter a valid 6-digit OTP");
      return;
    }
    setLoading(true);
    try {
      const res = await axiosInstance.post(API_PATHS.AUTH.VERIFY_OTP, {
        email,
        otp,
      });
      // store token (if provided) and call success handler
      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
      }
      onVerified?.(res.data.user || null);
    } catch (err) {
      setError(err?.response?.data?.message || "Invalid OTP. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (secondsLeft > 0) return;
    setResendLoading(true);
    setError("");
    try {
      // call register again (backend will generate+send OTP) OR create a dedicated resend endpoint
      // Here we reuse register endpoint with minimal body; backend should detect existing user and regenerate OTP.
      await axiosInstance.post(API_PATHS.AUTH.RESEND_OTP, {
        fullName: " ", // some backends require fields; if your backend has a resend endpoint use that
        email,
        password: " ", // using spaces only if your backend tolerates; recommended: implement /resend-otp endpoint
      });
      setSecondsLeft(60);
    } catch (err) {
      setError(err?.response?.data?.message || "Could not resend OTP");
    } finally {
      setResendLoading(false);
    }
  };

  return (
    // overlay
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* blurred backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />

      {/* modal */}
      <div className="relative z-10 w-[94%] max-w-md bg-dark-400 rounded-2xl shadow-xl p-6">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-light-200 opacity-80 hover:opacity-100"
          aria-label="close"
        >
          ✕
        </button>

        <h3 className="text-center text-2xl font-semibold text-light-200 mb-1">
          Verify your email
        </h3>
        <p className="text-center text-sm text-green-400 mb-4">
          Enter the 6-digit code sent to <span className="font-medium">{email}</span>
        </p>

        <form onSubmit={handleVerify} className="flex flex-col gap-3">
          <input
            inputMode="numeric"
            type="text"
            maxLength={6}
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
            placeholder="123456"
            className="px-4 py-2 rounded bg-dark-500 text-light-200 outline-none text-center tracking-widest text-lg"
          />

          {error && <div className="text-red-400 text-sm">{error}</div>}

          <button
            type="submit"
            onClick={handleVerify}
            className="w-full py-2 rounded bg-green-500 text-white font-semibold hover:bg-green-600 disabled:opacity-60"
            disabled={loading}
          >
            {loading ? "Verifying..." : "Verify & Continue"}
          </button>

          <div className="flex items-center justify-between text-xs text-dark-300">
            <div>
              {secondsLeft > 0 ? (
                <span>Resend OTP in {secondsLeft}s</span>
              ) : (
                <button
                  type="button"
                  onClick={handleResend}
                  className="underline text-green-400 hover:text-green-300"
                  disabled={resendLoading}
                >
                  {resendLoading ? "Resending..." : "Resend OTP"}
                </button>
              )}
            </div>

            <div>
              <button
                type="button"
                onClick={() => {
                  // allow user to cancel verification flow and go to login
                  onClose?.();
                }}
                className="text-sm text-light-200 opacity-80 hover:opacity-100"
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VerifyOtpModal;
