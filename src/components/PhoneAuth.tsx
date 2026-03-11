import React, { useState, useEffect } from "react";
import { RecaptchaVerifier, signInWithPhoneNumber, ConfirmationResult } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface PhoneAuthProps {
  onSuccess: (user: any) => void;
}

const PhoneAuth: React.FC<PhoneAuthProps> = ({ onSuccess }) => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [verificationId, setVerificationId] = useState<ConfirmationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<"phone" | "otp">("phone");

  useEffect(() => {
    if (!(window as any).recaptchaVerifier) {
      (window as any).recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
        size: "invisible",
      });
    }
  }, []);

  const handleSendOtp = async () => {
    if (!phoneNumber || phoneNumber.length < 10) {
      toast.error("Please enter a valid Indian phone number");
      return;
    }

    setLoading(true);
    try {
      const formattedPhone = phoneNumber.startsWith("+91") ? phoneNumber : `+91${phoneNumber}`;
      const appVerifier = (window as any).recaptchaVerifier;
      const confirmationResult = await signInWithPhoneNumber(auth, formattedPhone, appVerifier);
      setVerificationId(confirmationResult);
      setStep("otp");
      toast.success("OTP sent successfully!");
    } catch (error: any) {
      console.error("Error sending OTP:", error);
      toast.error(error.message || "Failed to send OTP");
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
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <div className="flex">
                <span className="flex items-center px-3 border border-r-0 border-border rounded-l-xl bg-muted/50 text-sm font-medium">
                  +91
                </span>
                <input
                  type="tel"
                  placeholder="Indian Phone Number"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ""))}
                  className="w-full pl-3 pr-4 py-3 bg-background border border-border rounded-r-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-body"
                  maxLength={10}
                />
              </div>
            </div>
            <button
              onClick={handleSendOtp}
              disabled={loading || phoneNumber.length < 10}
              className="w-full py-3 rounded-xl gradient-pink text-primary-foreground font-body font-bold shadow-pink disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Send OTP"}
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="otp-step"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <div className="text-center mb-2">
              <p className="text-sm text-muted-foreground">OTP sent to +91 {phoneNumber}</p>
              <button 
                onClick={() => setStep("phone")}
                className="text-xs text-primary underline mt-1"
              >
                Change Number
              </button>
            </div>
            <input
              type="text"
              placeholder="Enter 6-digit OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
              className="w-full px-4 py-3 bg-background border border-border rounded-xl text-center text-xl tracking-[0.5em] focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-display font-bold"
              maxLength={6}
            />
            <button
              onClick={handleVerifyOtp}
              disabled={loading || otp.length !== 6}
              className="w-full py-3 rounded-xl gradient-lilac text-primary-foreground font-body font-bold shadow-dreamy disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Verify OTP"}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PhoneAuth;
