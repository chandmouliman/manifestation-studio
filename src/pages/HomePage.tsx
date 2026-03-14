import { motion, AnimatePresence } from "framer-motion";
import { Flame, Play, Heart, ChevronRight, Moon, Timer, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { dailyQuotes, affirmationCategories } from "@/data/affirmations";
import { getDailyContent, DailyContent } from "@/lib/dailySource";
import { getStreak, getDailyProgress, saveDailyProgress, checkAndResetStreak, DailyProgress } from "@/lib/streakService";
import heroBg from "@/assets/hero-bg.jpg";
import lotusIcon from "@/assets/lotus-icon.png";

const moods = [
  { emoji: "😊", label: "Happy", energy: "Gratitude" },
  { emoji: "😌", label: "Peaceful", energy: "Peace" },
  { emoji: "💪", label: "Motivated", energy: "Success" },
  { emoji: "🥰", label: "Loved", energy: "Love" },
  { emoji: "😐", label: "Neutral", energy: "Confidence" },
  { emoji: "😔", label: "Low", energy: "Anxiety Relief" },
  { emoji: "😤", label: "Frustrated", energy: "Self Concept" },
];

const energyChoices = [
  { label: "Confidence", icon: "👑", color: "bg-gold-light", categoryId: "confidence" },
  { label: "Abundance", icon: "💰", color: "bg-lavender-light", categoryId: "money" },
  { label: "Love", icon: "💕", color: "bg-rose-light", categoryId: "love" },
  { label: "Peace", icon: "🕊️", color: "bg-lilac-light", categoryId: "anxiety-relief" },
  { label: "Success", icon: "⭐", color: "bg-gold-light", categoryId: "success" },
];

import { useAuth } from "@/contexts/AuthContext";

const HomePage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [streak, setStreak] = useState(0);
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [liked, setLiked] = useState(false);
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [selectedEnergy, setSelectedEnergy] = useState<string | null>(null);
  const [checklist, setChecklist] = useState([false, false, false, false]);
  const [dailyProgress, setDailyProgress] = useState<DailyProgress | null>(null);
  const [dailyContent, setDailyContent] = useState<DailyContent | null>(null);

  useEffect(() => {
    const fetchDaily = async () => {
      const content = await getDailyContent();
      setDailyContent(content);
    };
    fetchDaily();
    
    // Initialize streak and progress
    checkAndResetStreak();
    const currentStreak = getStreak();
    const progress = getDailyProgress();
    setStreak(currentStreak);
    setDailyProgress(progress);
    setSelectedMood(progress.mood);
    setSelectedEnergy(progress.energy);
    setChecklist(progress.checklist);

    const today = new Date().getDate();
    setQuoteIndex(today % dailyQuotes.length);
  }, []);

  const todayAffirmation = affirmationCategories[0].affirmations[quoteIndex % affirmationCategories[0].affirmations.length];
  const quickCategories = affirmationCategories.slice(0, 6);
  const checklistItems = ["Repeat affirmations", "Visualization", "Gratitude practice", "Journal entry"];

  const toggleCheck = (i: number) => {
    const newChecklist = checklist.map((v, idx) => idx === i ? !v : v);
    setChecklist(newChecklist);
    
    if (dailyProgress) {
      const updated: DailyProgress = { ...dailyProgress, checklist: newChecklist };
      setDailyProgress(updated);
      saveDailyProgress(updated);
      setStreak(getStreak());
    }
  };

  const handleMoodSelect = (label: string) => {
    setSelectedMood(label);
    if (dailyProgress) {
      const updated: DailyProgress = { ...dailyProgress, mood: label };
      setDailyProgress(updated);
      saveDailyProgress(updated);
      setStreak(getStreak());
    }
  };

  const handleEnergySelect = (label: string) => {
    setSelectedEnergy(label);
    if (dailyProgress) {
      const updated: DailyProgress = { ...dailyProgress, energy: label };
      setDailyProgress(updated);
      saveDailyProgress(updated);
      setStreak(getStreak());
    }
  };

  const completedCount = checklist.filter(Boolean).length;

  return (
    <div className="min-h-screen pb-24 bg-background relative overflow-hidden">
      {/* Dreamy floating decorations */}
      <div className="fixed top-40 right-0 w-24 h-24 rounded-full bg-pink-dream/15 blur-3xl animate-drift pointer-events-none" />
      <div className="fixed bottom-60 left-0 w-20 h-20 rounded-full bg-lilac/10 blur-3xl animate-float pointer-events-none" />
      <div className="fixed top-1/3 left-8 w-3 h-3 rounded-full bg-primary/20 animate-sparkle pointer-events-none" />

      {/* Hero Section */}
      <div className="relative h-72 overflow-hidden">
        <img src={heroBg} alt="Ethereal sky" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-foreground/10 via-primary/10 to-background" />
        <div className="relative z-10 flex flex-col items-center justify-center h-full px-6 text-center">
          <motion.img
            src={lotusIcon}
            alt="Assume"
            className="w-14 h-14 mb-3"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", duration: 1 }}
          />
          <motion.h1
            className="text-2xl font-display font-bold text-primary-foreground drop-shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            {user ? `Welcome, ${user.name || user.displayName || user.email?.split('@')[0] || 'Seeker'}` : "Assume"}
          </motion.h1>
          <motion.p
            className="text-sm text-primary-foreground/80 font-body mt-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {user ? "Your reality is shifting..." : "Manifest Your Reality ✨"}
          </motion.p>
        </div>
      </div>

      <div className="px-5 -mt-8 relative z-10 space-y-5">
        {/* Streak Card */}
        <motion.div
          className="gradient-fairy rounded-2xl p-4 shadow-dreamy border border-border/20 flex items-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="w-14 h-14 rounded-xl gradient-pink flex items-center justify-center shadow-pink">
            <Flame className="w-7 h-7 text-primary-foreground" />
          </div>
          <div className="flex-1">
            <p className="text-sm text-muted-foreground font-body">Manifestation Streak</p>
            <p className="text-2xl font-display font-bold text-foreground">{streak} Days 🔥</p>
          </div>
          <div className="flex gap-1">
            {[...Array(7)].map((_, i) => (
              <div key={i} className={`w-2.5 h-2.5 rounded-full ${i < (streak % 8 || (streak > 0 ? 7 : 0)) ? "bg-rose" : "bg-muted"}`} />
            ))}
          </div>
        </motion.div>

        {/* Mood Check-in */}
        <motion.div
          className="rounded-2xl p-5 gradient-fairy shadow-dreamy border border-border/20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
        >
          <p className="text-xs font-body font-medium text-muted-foreground uppercase tracking-wider mb-3">
            🌸 How do you feel today?
          </p>
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {moods.map((mood) => (
              <motion.button
                key={mood.label}
                onClick={() => handleMoodSelect(mood.label)}
                className={`shrink-0 flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all border ${
                  selectedMood === mood.label
                    ? "bg-primary/10 border-primary/30 shadow-sm scale-105"
                    : "bg-muted/50 border-transparent"
                }`}
                whileTap={{ scale: 0.95 }}
              >
                <span className="text-2xl">{mood.emoji}</span>
                <span className="text-[10px] font-body font-medium text-foreground">{mood.label}</span>
              </motion.button>
            ))}
          </div>
          {selectedMood && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="mt-3 pt-3 border-t border-border/30"
            >
              <p className="text-xs text-primary font-body font-medium mb-2">
                ✨ Suggested energy for you today:
              </p>
              <button
                onClick={() => {
                  const mood = moods.find(m => m.label === selectedMood);
                  const cat = affirmationCategories.find(c => c.name === mood?.energy);
                  if (cat) navigate(`/affirmations?category=${cat.id}`);
                }}
                className="px-4 py-2 rounded-xl gradient-pink text-primary-foreground text-xs font-body font-medium shadow-pink"
              >
                {moods.find(m => m.label === selectedMood)?.energy} Affirmations →
              </button>
            </motion.div>
          )}
        </motion.div>

        {/* Energy Check-in */}
        <motion.div
          className="rounded-2xl p-5 glass-pink shadow-dreamy border border-border/20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.48 }}
        >
          <p className="text-xs font-body font-medium text-muted-foreground uppercase tracking-wider mb-3">
            ⚡ What energy are you choosing today?
          </p>
          <div className="flex gap-2 flex-wrap">
            {energyChoices.map((energy) => (
              <motion.button
                key={energy.label}
                onClick={() => {
                  handleEnergySelect(energy.label);
                  navigate(`/affirmations?category=${energy.categoryId}`);
                }}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-body font-medium transition-all border ${
                  selectedEnergy === energy.label
                    ? "bg-primary/15 border-primary/30 text-primary shadow-sm"
                    : `${energy.color} border-border/20 text-foreground`
                }`}
                whileTap={{ scale: 0.95 }}
              >
                <span>{energy.icon}</span>
                <span>{energy.label}</span>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Daily Quote / Motivation */}
        <motion.div
          className="rounded-3xl p-6 shadow-dreamy relative overflow-hidden premium-blur border border-white/20 soft-glow"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
        >
          {dailyContent?.imageUrl && (
            <div 
              className="absolute inset-0 z-0 opacity-20"
              style={{ 
                backgroundImage: `url(${dailyContent.imageUrl})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            />
          )}
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-primary" />
              <p className="text-xs font-body font-bold text-primary uppercase tracking-widest">
                Daily Inspiration
              </p>
            </div>
            <p className="text-xl font-display italic text-foreground leading-relaxed text-shadow-premium mb-4">
              "{dailyContent?.affirmation || dailyQuotes[quoteIndex]}"
            </p>
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-body text-muted-foreground italic">
                {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </p>
              <button 
                onClick={() => navigate('/affirmations')}
                className="text-[10px] font-body font-bold text-primary underline underline-offset-4"
              >
                Start Session
              </button>
            </div>
          </div>
        </motion.div>

        {/* Daily Affirmation Card */}
        <motion.div
          className="rounded-2xl p-5 gradient-fairy shadow-dreamy border border-border/20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-body font-medium text-muted-foreground uppercase tracking-wider">
              🌸 Morning Affirmation
            </p>
            <button onClick={() => setLiked(!liked)}>
              <Heart className={`w-5 h-5 transition-all ${liked ? "text-rose fill-rose scale-110" : "text-muted-foreground"}`} />
            </button>
          </div>
          <p className="text-base font-display text-foreground leading-relaxed">
            "{todayAffirmation}"
          </p>
        </motion.div>

        {/* Quick Actions Row */}
        <div className="grid grid-cols-3 gap-3">
          <motion.button
            className="rounded-2xl p-4 gradient-pink shadow-pink flex flex-col items-center gap-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65 }}
            onClick={() => navigate("/affirmations")}
            whileTap={{ scale: 0.95 }}
          >
            <Play className="w-6 h-6 text-primary-foreground" />
            <span className="text-[10px] font-body font-medium text-primary-foreground">Quick Session</span>
          </motion.button>
          <motion.button
            className="rounded-2xl p-4 gradient-lilac shadow-dreamy flex flex-col items-center gap-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            onClick={() => navigate("/night-mode")}
            whileTap={{ scale: 0.95 }}
          >
            <Moon className="w-6 h-6 text-primary-foreground" />
            <span className="text-[10px] font-body font-medium text-primary-foreground">Night Mode</span>
          </motion.button>
          <motion.button
            className="rounded-2xl p-4 gradient-lavender shadow-dreamy flex flex-col items-center gap-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.75 }}
            onClick={() => navigate("/timer")}
            whileTap={{ scale: 0.95 }}
          >
            <Timer className="w-6 h-6 text-primary-foreground" />
            <span className="text-[10px] font-body font-medium text-primary-foreground">Timer</span>
          </motion.button>
        </div>

        {/* Quick Categories */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-display font-semibold text-foreground">
              Affirmation Categories
            </h2>
            <button onClick={() => navigate("/affirmations")} className="text-xs text-primary font-body font-medium">
              See All
            </button>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {quickCategories.map((cat, i) => (
              <motion.button
                key={cat.id}
                className="rounded-2xl p-3 gradient-fairy shadow-card border border-border/20 flex flex-col items-center gap-2"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8 + i * 0.05 }}
                onClick={() => navigate(`/affirmations?category=${cat.id}`)}
                whileTap={{ scale: 0.95 }}
              >
                <span className="text-2xl">{cat.icon}</span>
                <span className="text-[11px] font-body font-medium text-foreground">{cat.name}</span>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Daily Manifestation Checklist */}
        <motion.div
          className="rounded-2xl p-5 gradient-fairy shadow-card border border-border/20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-body font-semibold text-foreground">
              ✅ Daily Manifestation Checklist
            </h3>
            <span className="text-xs font-body text-primary font-medium">{completedCount}/{checklistItems.length}</span>
          </div>
          {/* Progress bar */}
          <div className="w-full h-2 rounded-full bg-muted mb-3 overflow-hidden">
            <motion.div
              className="h-full rounded-full gradient-pink"
              initial={{ width: 0 }}
              animate={{ width: `${(completedCount / checklistItems.length) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          {checklistItems.map((task, i) => (
            <button
              key={i}
              onClick={() => toggleCheck(i)}
              className="flex items-center gap-3 py-2 w-full text-left"
            >
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                checklist[i] ? "bg-primary border-primary" : "border-beige-dark"
              }`}>
                {checklist[i] && (
                  <svg className="w-3 h-3 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <span className={`text-sm font-body transition-all ${checklist[i] ? "text-muted-foreground line-through" : "text-foreground"}`}>
                {task}
              </span>
            </button>
          ))}
          {completedCount === checklistItems.length && (
            <motion.p
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center text-xs font-body text-primary font-medium mt-2 py-2 rounded-xl bg-primary/10"
            >
              🎉 Amazing! All tasks complete today!
            </motion.p>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default HomePage;
