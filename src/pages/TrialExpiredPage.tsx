import React from 'react';
import { motion } from 'framer-motion';
import { Crown, Sparkles, ArrowRight, Zap, Target, Heart, Check, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const TrialExpiredPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedPlan, setSelectedPlan] = React.useState<'monthly' | 'yearly'>('monthly');
  const [isProcessing, setIsProcessing] = React.useState(false);

  const plans: Record<'monthly' | 'yearly', { price: number, label: string, duration: string, savings?: string }> = {
    monthly: { price: 100, label: "Monthly Initiation", duration: "30 days" },
    yearly: { price: 350, label: "Yearly Mastery", duration: "1 year", savings: "70% off" }
  };

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    if (!user) {
      toast.error("Please login to continue");
      return;
    }

    setIsProcessing(true);
    const res = await loadRazorpay();

    if (!res) {
      toast.error("Razorpay SDK failed to load. Are you online?");
      setIsProcessing(false);
      return;
    }

    try {
      const plan = plans[selectedPlan];
      const data = await fetch('http://localhost:5001/api/payment/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: plan.price, planType: selectedPlan })
      }).then(t => t.json());

      const options = {
        key: 'rzp_test_manifestation_123', // Test Key
        amount: data.amount,
        currency: data.currency,
        name: "Manifestation Studio",
        description: `${plan.label} Subscription`,
        order_id: data.id,
        handler: async (response: any) => {
          const verifyRes = await fetch('http://localhost:5001/api/payment/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              ...response,
              userId: user.id,
              planType: selectedPlan
            })
          }).then(t => t.json());

          if (verifyRes.success) {
            toast.success("Welcome to the Premium Realm! ✨");
            navigate('/');
            window.location.reload(); // Refresh to update user plan globally
          }
        },
        prefill: {
          name: user.name || "",
          email: user.email || "",
        },
        theme: {
          color: "#E879F9"
        }
      };

      const paymentObject = new (window as any).Razorpay(options);
      paymentObject.open();
    } catch (error) {
      console.error(error);
      toast.error("Manifestation failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6 relative overflow-hidden">
      {/* Dynamic Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-card/40 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-8 shadow-2xl relative z-10 text-center space-y-8"
      >
        <div className="space-y-4">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", damping: 10 }}
            className="w-20 h-20 rounded-3xl gradient-lavender mx-auto flex items-center justify-center shadow-pink"
          >
            <Crown className="w-10 h-10 text-white animate-float" />
          </motion.div>
          
          <div className="space-y-2">
            <h1 className="text-3xl font-display font-bold tracking-tight text-foreground">
              Initiation Complete
            </h1>
            <p className="text-muted-foreground text-sm px-4">
              Your 10-day trial in the digital realm has concluded. Ready to step into mastery?
            </p>
          </div>
        </div>

        <div className="space-y-4 text-left">
          <div className="flex gap-3 mb-4">
            {(['monthly', 'yearly'] as const).map((p) => (
              <motion.button
                key={p}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedPlan(p)}
                className={`flex-1 p-5 rounded-[2rem] border-2 transition-all relative overflow-hidden ${
                  selectedPlan === p 
                    ? "border-primary bg-primary/10 shadow-dreamy" 
                    : "border-white/5 bg-white/5 hover:bg-white/10"
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/80">{p}</span>
                  {selectedPlan === p && (
                    <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                  )}
                </div>
                <div className="text-2xl font-display font-bold text-foreground">₹{plans[p].price}</div>
                <div className="text-[11px] text-muted-foreground/80 font-medium">{plans[p].duration}</div>
                {plans[p].savings && (
                  <div className="absolute top-0 right-0 bg-gold text-[9px] font-black px-3 py-1 rounded-bl-xl text-white shadow-sm">
                    {plans[p].savings}
                  </div>
                )}
              </motion.button>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-3">
            {[
              { icon: Sparkles, text: "Unlimited Affirmation Loops", color: "text-blue-400" },
              { icon: Zap, text: "High-Frequency Subliminal Audio", color: "text-purple-400" },
              { icon: Target, text: "Advanced Scripting Templates", color: "text-pink-400" },
              { icon: Heart, text: "Mirror Work Mastery Mode", color: "text-rose-400" }
            ].map((feature, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + (i * 0.1) }}
                className="bg-white/5 backdrop-blur-sm border border-white/5 p-4 rounded-2xl flex items-center gap-4 group hover:bg-white/10 transition-colors"
              >
                <div className={`w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0`}>
                  <feature.icon className={`w-4 h-4 ${feature.color}`} />
                </div>
                <span className="text-sm font-medium text-foreground/90">{feature.text}</span>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="space-y-4 pt-2">
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handlePayment}
            disabled={isProcessing}
            className="w-full py-5 rounded-[1.5rem] gradient-lavender text-white font-display font-bold text-lg shadow-pink flex items-center justify-center gap-3 group relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            {isProcessing ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : (
              <>
                Unlock Mastery — ₹{plans[selectedPlan].price}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </motion.button>
          
          <button 
            onClick={() => navigate('/')}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors font-medium"
          >
            Return to basic reality
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default TrialExpiredPage;
