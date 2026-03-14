import React, { useState, useEffect } from "react";
import { RecaptchaVerifier, signInWithPhoneNumber, ConfirmationResult } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, CheckCircle2, AlertCircle, Loader2, Globe } from "lucide-react";
import { toast } from "sonner";
import { countryCodes } from "@/lib/countryCodes";

interface PhoneAuthProps {
  onSuccess: (user: any) => void;
}

const PhoneAuth: React.FC<PhoneAuthProps> = ({ onSuccess }) => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [countryCode, setCountryCode] = useState("+91");
  const [otp, setOtp] = useState("");
  const [verificationId, setVerificationId] = useState<ConfirmationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<"phone" | "otp">("phone");

  useEffect(() => {
    if (!(window as any).recaptchaVerifier) {
      try {
        (window as any).recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
          size: "invisible",
        });
      } catch (err) {
        console.error("Recaptcha initialization failed:", err);
      }
    }
  }, []);

  const handleSendOtp = async () => {
    if (!phoneNumber || phoneNumber.length < 7) {
      toast.error("Please enter a valid phone number");
      return;
    }

    setLoading(true);
    try {
      const formattedPhone = `${countryCode}${phoneNumber}`;
      const appVerifier = (window as any).recaptchaVerifier;
      if (!appVerifier) throw new Error("Recaptcha verifier not initialized");

      const confirmationResult = await signInWithPhoneNumber(auth, formattedPhone, appVerifier);
      setVerificationId(confirmationResult);
      setStep("otp");
      toast.success("OTP sent successfully!");
    } catch (error: any) {
      console.error("Error sending OTP:", error);
      if (error.code === 'auth/operation-not-allowed') {
        toast.error("Phone sign-in is not enabled in Firebase. Please check console.");
      } else {
        toast.error(error.message || "Failed to send OTP");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp || otp.length !== 6) {
      toast.error("Please enter a 6-digit OTP");
      return;
    }

    setLoading(true);
    try {
      if (verificationId) {
        const result = await verificationId.confirm(otp);
        toast.success("Phone verified successfully!");
        onSuccess(result.user);
      }
    } catch (error: any) {
      console.error("Error verifying OTP:", error);
      toast.error("Invalid OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 w-full max-w-sm mx-auto p-4">
      <div id="recaptcha-container"></div>
      
      <AnimatePresence mode="wait">
        {step === "phone" ? (
          <motion.div
            key="phone-step"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-4"
          >
            <div className="space-y-2">
              <label className="text-xs font-body font-bold text-slate-500 uppercase tracking-widest ml-1">
                Select Country & Phone
              </label>
              <div className="flex gap-2">
                <div className="relative w-1/3">
                  <select
                    value={countryCode}
                    onChange={(e) => setCountryCode(e.target.value)}
                    className="w-full pl-3 pr-8 py-3 bg-white/50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/10 focus:border-primary outline-none transition-all font-body text-sm appearance-none cursor-pointer"
                  >
                    {countryCodes.map((c) => (
                      <option key={`${c.code}-${c.name}`} value={c.code}>
                        {c.flag} {c.code}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                    <Globe className="w-4 h-4" />
                  </div>
                </div>
                <div className="relative flex-1">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="tel"
                    placeholder="Phone Number"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ""))}
                    className="w-full pl-9 pr-4 py-3 bg-white/50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/10 focus:border-primary outline-none transition-all font-body text-sm"
                  />
                </div>
              </div>
            </div>
            
            <button
              onClick={handleSendOtp}
              disabled={loading || phoneNumber.length < 7}
              className="w-full py-4 rounded-2xl bg-slate-900 text-white font-body font-bold shadow-xl hover:bg-slate-800 disabled:opacity-50 flex items-center justify-center gap-2 transition-all active:scale-98"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Send Verification Code"}
            </button>
            <p className="text-[10px] text-center text-slate-400 px-4">
              We'll send a 6-digit code to verify your phone. Standard messaging rates may apply.
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="otp-step"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <div className="text-center space-y-2">
              <p className="text-sm font-body text-slate-600">
                A verification code has been sent to <br/>
                <span className="font-bold text-slate-900">{countryCode} {phoneNumber}</span>
              </p>
              <button 
                onClick={() => setStep("phone")}
                className="text-xs text-primary font-bold hover:underline transition-all"
              >
                Change Number
              </button>
            </div>
            
            <div className="space-y-4 pt-2">
              <input
                type="text"
                placeholder="000000"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                className="w-full px-4 py-4 bg-white/50 border border-slate-200 rounded-2xl text-center text-2xl tracking-[0.5em] focus:ring-2 focus:ring-primary/10 focus:border-primary outline-none transition-all font-display font-bold text-slate-900 placeholder:text-slate-200"
                maxLength={6}
                autoFocus
              />
              
              <button
                onClick={handleVerifyOtp}
                disabled={loading || otp.length !== 6}
                className="w-full py-4 rounded-2xl gradient-fairy text-slate-900 font-body font-bold shadow-dreamy disabled:opacity-50 flex items-center justify-center gap-2 transition-all active:scale-98 border border-border/20"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Verify & Continue"}
              </button>
              
              <div className="text-center">
                <button 
                  onClick={handleSendOtp}
                  disabled={loading}
                  className="text-xs text-slate-400 hover:text-slate-600 font-medium"
                >
                  Didn't receive the code? Resend
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PhoneAuth;
