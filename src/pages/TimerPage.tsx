import { motion } from "framer-motion";
import { ArrowLeft, Play, Pause, RotateCcw } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const sessions = [
  { label: "Robotic Affirmations", duration: 600, icon: "💬", color: "gradient-pink" },
  { label: "Visualization", duration: 300, icon: "🔮", color: "gradient-lilac" },
  { label: "Gratitude Practice", duration: 180, icon: "🙏", color: "gradient-lavender" },
  { label: "SATS Practice", duration: 600, icon: "🌙", color: "gradient-blush" },
  { label: "Mental Diet Focus", duration: 300, icon: "🧠", color: "gradient-dreamy" },
];

const TimerPage = () => {
  const navigate = useNavigate();
  const [selectedSession, setSelectedSession] = useState(0);
  const [timeLeft, setTimeLeft] = useState(sessions[0].duration);
  const [isRunning, setIsRunning] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setIsRunning(false);
            setIsComplete(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isRunning, timeLeft]);

  const selectSession = (i: number) => {
    setSelectedSession(i);
    setTimeLeft(sessions[i].duration);
    setIsRunning(false);
    setIsComplete(false);
  };

  const reset = () => {
    setTimeLeft(sessions[selectedSession].duration);
    setIsRunning(false);
    setIsComplete(false);
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const progress = 1 - timeLeft / sessions[selectedSession].duration;
  const circumference = 2 * Math.PI * 110;

  return (
    <div className="min-h-screen pb-24 bg-background relative overflow-hidden">
      <div className="fixed top-32 right-0 w-24 h-24 rounded-full bg-pink-dream/15 blur-3xl animate-drift pointer-events-none" />
      <div className="fixed bottom-48 left-0 w-20 h-20 rounded-full bg-lilac/10 blur-3xl animate-float pointer-events-none" />

      <div className="px-5 pt-14 pb-4 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-xl glass-pink flex items-center justify-center">
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        <div>
          <h1 className="text-lg font-display font-bold text-foreground">Manifestation Timer</h1>
          <p className="text-xs text-muted-foreground font-body">Stay focused on your practice ⏱️</p>
        </div>
      </div>

      {/* Session selector */}
      <div className="px-5 mb-6">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {sessions.map((session, i) => (
            <button
              key={i}
              onClick={() => selectSession(i)}
              className={`shrink-0 px-4 py-2.5 rounded-xl text-xs font-body font-medium flex items-center gap-2 transition-all border ${
                selectedSession === i
                  ? "bg-primary/10 border-primary/30 text-primary shadow-sm"
                  : "bg-muted/50 border-border/20 text-muted-foreground"
              }`}
            >
              <span>{session.icon}</span>
              <span>{session.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Timer circle */}
      <div className="flex flex-col items-center justify-center px-8 py-4">
        <div className="relative w-64 h-64">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 240 240">
            <circle cx="120" cy="120" r="110" fill="none" strokeWidth="4" className="stroke-muted/30" />
            <motion.circle
              cx="120" cy="120" r="110" fill="none" strokeWidth="6"
              strokeLinecap="round"
              className="stroke-primary"
              strokeDasharray={circumference}
              strokeDashoffset={circumference * (1 - progress)}
              transition={{ duration: 0.5 }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-xl mb-1">{sessions[selectedSession].icon}</span>
            <p className="text-4xl font-display font-bold text-foreground">
              {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
            </p>
            <p className="text-xs text-muted-foreground font-body mt-1">
              {sessions[selectedSession].label}
            </p>
          </div>
        </div>

        {isComplete && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-4 px-6 py-3 rounded-2xl gradient-pink shadow-pink"
          >
            <p className="text-sm font-body font-medium text-primary-foreground text-center">
              🎉 Session Complete! Well done ✨
            </p>
          </motion.div>
        )}

        {/* Controls */}
        <div className="flex items-center gap-6 mt-8">
          <motion.button
            onClick={reset}
            className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center border border-border/20"
            whileTap={{ scale: 0.9 }}
          >
            <RotateCcw className="w-5 h-5 text-muted-foreground" />
          </motion.button>
          <motion.button
            onClick={() => setIsRunning(!isRunning)}
            className="w-20 h-20 rounded-full gradient-lavender flex items-center justify-center shadow-dreamy"
            whileTap={{ scale: 0.9 }}
          >
            {isRunning ? (
              <Pause className="w-8 h-8 text-primary-foreground" />
            ) : (
              <Play className="w-8 h-8 text-primary-foreground ml-1" />
            )}
          </motion.button>
          <div className="w-14 h-14" /> {/* Spacer for symmetry */}
        </div>
      </div>

      {/* Tips */}
      <div className="px-5 mt-6">
        <div className="rounded-2xl p-5 gradient-fairy shadow-card border border-border/20">
          <h3 className="text-sm font-display font-semibold text-foreground mb-3">
            💡 Tips for {sessions[selectedSession].label}
          </h3>
          {selectedSession === 0 && (
            <p className="text-xs font-body text-foreground/70 leading-relaxed">
              Repeat your chosen affirmation robotically — no need to feel anything. The repetition itself creates belief. Stay consistent for at least 10 minutes.
            </p>
          )}
          {selectedSession === 1 && (
            <p className="text-xs font-body text-foreground/70 leading-relaxed">
              Create a vivid scene of your wish fulfilled. See it from first person. Focus on emotions — joy, gratitude, peace. Let it feel real.
            </p>
          )}
          {selectedSession === 2 && (
            <p className="text-xs font-body text-foreground/70 leading-relaxed">
              List things you're grateful for. Feel genuine appreciation for each one. Gratitude raises your vibration and attracts more blessings.
            </p>
          )}
          {selectedSession === 3 && (
            <p className="text-xs font-body text-foreground/70 leading-relaxed">
              Lie down comfortably. As you feel drowsy, loop a short scene implying your wish fulfilled. Let yourself drift into the feeling.
            </p>
          )}
          {selectedSession === 4 && (
            <p className="text-xs font-body text-foreground/70 leading-relaxed">
              Monitor every thought. Catch any negative or contradicting thoughts immediately. Redirect to a positive assumption aligned with your desires.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default TimerPage;
