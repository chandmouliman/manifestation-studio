import { motion, AnimatePresence } from "framer-motion";
import { Heart, Share2, RotateCcw, ArrowLeft, Bookmark, Volume2, VolumeX, Music } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { logUserActivity } from "@/lib/activity";
import { affirmationCategories } from "@/data/affirmations";
import { getDailyContent, DailyContent } from "@/lib/dailySource";
import { ambientSounds, createAmbientSound } from "@/lib/sounds";

const categoryGradients: Record<string, string> = {
  lavender: "gradient-lavender",
  gold: "gradient-gold",
  rose: "gradient-rose",
  sage: "gradient-lilac",
};

const categoryCardBgs: Record<string, string> = {
  lavender: "bg-lavender-light",
  gold: "bg-gold-light",
  rose: "bg-rose-light",
  sage: "bg-sage-light",
};

const AffirmationsPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get("category") || null;
  const [selectedCategory, setSelectedCategory] = useState<string | null>(initialCategory);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [liked, setLiked] = useState<Set<string>>(new Set());
  const [saved, setSaved] = useState<Set<string>>(new Set());
  const [activeSound, setActiveSound] = useState<string | null>(null);
  const [showSounds, setShowSounds] = useState(false);
  const [dailyContent, setDailyContent] = useState<DailyContent | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const stopFnRef = useRef<(() => void) | null>(null);

  const activeCategory = affirmationCategories.find((c) => c.id === selectedCategory);

  useEffect(() => {
    const fetchDaily = async () => {
      const content = await getDailyContent();
      setDailyContent(content);
    };
    fetchDaily();

    return () => {
      stopFnRef.current?.();
      audioCtxRef.current?.close();
    };
  }, []);

  const toggleSound = (soundId: string) => {
    if (activeSound === soundId) {
      stopFnRef.current?.();
      stopFnRef.current = null;
      setActiveSound(null);
      return;
    }
    stopFnRef.current?.();
    if (!audioCtxRef.current || audioCtxRef.current.state === 'closed') {
      audioCtxRef.current = new AudioContext();
    }
    const stop = createAmbientSound(soundId, audioCtxRef.current);
    stopFnRef.current = stop;
    setActiveSound(soundId);
  };

  const toggleLike = (aff: string) => {
    setLiked((prev) => {
      const next = new Set(prev);
      const isLiked = next.has(aff);
      isLiked ? next.delete(aff) : next.add(aff);
      if (user?.id && !isLiked) {
        logUserActivity(user.id, 'AFFIRMATION_LIKED', `User liked: "${aff.substring(0, 50)}..."`);
      }
      return next;
    });
  };

  const toggleSave = (aff: string) => {
    setSaved((prev) => {
      const next = new Set(prev);
      const isSaved = next.has(aff);
      isSaved ? next.delete(aff) : next.add(aff);
      if (user?.id && !isSaved) {
        logUserActivity(user.id, 'AFFIRMATION_SAVED', `User saved: "${aff.substring(0, 50)}..."`);
      }
      return next;
    });
  };

  if (!selectedCategory || !activeCategory) {
    return (
      <div className="min-h-screen pb-24 bg-background relative overflow-hidden">
        {/* Decorative blobs */}
        <div className="fixed top-16 right-0 w-32 h-32 rounded-full bg-pink-dream/20 blur-3xl animate-drift pointer-events-none" />
        <div className="fixed bottom-40 left-0 w-24 h-24 rounded-full bg-lilac/15 blur-3xl animate-float pointer-events-none" />

        <div className="px-5 pt-14 pb-2">
          <h1 className="text-2xl font-display font-bold text-foreground">Affirmations</h1>
          <p className="text-sm text-muted-foreground font-body mt-1">
            Choose a category to begin ✨
          </p>
        </div>
        <div className="px-5 space-y-3 pb-4">
          {affirmationCategories.map((cat, i) => (
            <motion.button
              key={cat.id}
              className={`w-full rounded-2xl p-4 shadow-dreamy border border-border/20 flex items-center gap-4 text-left ${categoryCardBgs[cat.color] || 'gradient-fairy'}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.04 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                setSelectedCategory(cat.id);
                setCurrentIndex(0);
                if (!activeSound) toggleSound("bedroom");
                if (user?.id) {
                  logUserActivity(user.id, 'AFFIRMATION_CATEGORY_SELECTED', `User selected category: ${cat.name}`);
                }
              }}
            >
              <div className="w-12 h-12 rounded-xl glass-card flex items-center justify-center shadow-card">
                <span className="text-2xl">{cat.icon}</span>
              </div>
              <div className="flex-1">
                <p className="text-base font-body font-semibold text-foreground">{cat.name}</p>
                <p className="text-xs text-muted-foreground font-body">
                  {cat.affirmations.length} affirmations
                </p>
              </div>
              <div className={`w-2 h-8 rounded-full ${
                cat.color === "lavender" ? "bg-lavender" :
                cat.color === "gold" ? "bg-gold" :
                cat.color === "rose" ? "bg-rose" : "bg-sage"
              }`} />
            </motion.button>
          ))}
        </div>
      </div>
    );
  }

  const affirmation = activeCategory.affirmations[currentIndex];

  const nextAffirmation = () => {
    setCurrentIndex((prev) => (prev + 1) % activeCategory.affirmations.length);
  };

  const bgClass = categoryGradients[activeCategory.color] || "gradient-lavender";

  return (
    <div className={`min-h-screen pb-24 ${bgClass} flex flex-col relative overflow-hidden`}>
      {/* Dynamic Background Image for Daily or Category */}
      {dailyContent && selectedCategory === 'self-concept' && (
        <div 
          className="absolute inset-0 z-0 opacity-40 transition-opacity duration-1000"
          style={{ 
            backgroundImage: `url(${dailyContent.imageUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
      )}
      <div className="absolute inset-0 bg-black/5 z-0" />
      
      {/* Dreamy decorations */}
      <div className="absolute top-20 right-8 w-24 h-24 rounded-full bg-primary-foreground/10 blur-2xl animate-drift pointer-events-none z-10" />
      <div className="absolute bottom-32 left-4 w-16 h-16 rounded-full bg-primary-foreground/10 blur-2xl animate-float pointer-events-none z-10" />
      <div className="absolute top-1/3 left-1/4 w-3 h-3 rounded-full bg-primary-foreground/30 animate-sparkle pointer-events-none z-10" />
      <div className="absolute top-1/2 right-1/3 w-2 h-2 rounded-full bg-primary-foreground/25 animate-sparkle pointer-events-none z-10" style={{ animationDelay: '0.7s' }} />

      {/* Header */}
      <div className="px-5 pt-14 pb-4 flex items-center gap-3 relative z-20">
        <button
          onClick={() => {
            setSelectedCategory(null);
            stopFnRef.current?.();
            setActiveSound(null);
          }}
          className="w-10 h-10 rounded-xl bg-primary-foreground/20 backdrop-blur-sm flex items-center justify-center"
        >
          <ArrowLeft className="w-5 h-5 text-primary-foreground" />
        </button>
        <div className="flex-1">
          <h1 className="text-lg font-display font-bold text-primary-foreground">
            {activeCategory.icon} {activeCategory.name}
          </h1>
          <p className="text-xs text-primary-foreground/70 font-body">
            {currentIndex + 1} of {activeCategory.affirmations.length}
          </p>
        </div>
        {/* Sound toggle */}
        <button
          onClick={() => setShowSounds(!showSounds)}
          className={`w-10 h-10 rounded-xl backdrop-blur-sm flex items-center justify-center ${
            activeSound ? "bg-primary-foreground/30" : "bg-primary-foreground/15"
          }`}
        >
          {activeSound ? (
            <Volume2 className="w-5 h-5 text-primary-foreground" />
          ) : (
            <Music className="w-5 h-5 text-primary-foreground/70" />
          )}
        </button>
      </div>

      {/* Sound Picker */}
      <AnimatePresence>
        {showSounds && (
          <motion.div
            className="px-5 pb-3"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
              {ambientSounds.map((sound) => (
                <button
                  key={sound.id}
                  onClick={() => toggleSound(sound.id)}
                  className={`shrink-0 px-3 py-2 rounded-xl text-xs font-body font-medium flex items-center gap-1.5 transition-all ${
                    activeSound === sound.id
                      ? "bg-primary-foreground/30 text-primary-foreground shadow-sm"
                      : "bg-primary-foreground/10 text-primary-foreground/70"
                  }`}
                >
                  <span>{sound.emoji}</span>
                  <span>{sound.label.split(' ').slice(1).join(' ')}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Affirmation Card */}
      <div className="flex-1 flex items-center justify-center px-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            className="text-center px-6 py-12 rounded-[2rem] premium-blur border border-white/20 shadow-dreamy relative z-20 soft-glow"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -20 }}
            transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
          >
            <div className="text-4xl mb-6 animate-pulse-soft">{activeCategory.icon}</div>
            <p className="text-2xl font-display italic text-primary-foreground leading-relaxed text-shadow-premium">
              "{affirmation}"
            </p>
            <div className="mt-8 flex justify-center gap-1.5">
              {activeCategory.affirmations.map((_, i) => (
                <div
                  key={i}
                  className={`w-1.5 h-1.5 rounded-full transition-all ${
                    i === currentIndex ? "bg-primary-foreground w-4" : "bg-primary-foreground/30"
                  }`}
                />
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Actions */}
      <div className="px-8 pb-8">
        <div className="flex items-center justify-center gap-6 mb-6">
          <motion.button
            onClick={() => toggleLike(affirmation)}
            className="w-14 h-14 rounded-2xl bg-primary-foreground/15 backdrop-blur-sm flex items-center justify-center border border-primary-foreground/10"
            whileTap={{ scale: 0.9 }}
          >
            <Heart
              className={`w-6 h-6 transition-all ${
                liked.has(affirmation) ? "text-primary-foreground fill-primary-foreground scale-110" : "text-primary-foreground/70"
              }`}
            />
          </motion.button>
          <motion.button
            onClick={nextAffirmation}
            className="w-16 h-16 rounded-full bg-primary-foreground/25 backdrop-blur-sm flex items-center justify-center shadow-dreamy border border-primary-foreground/15"
            whileTap={{ scale: 0.9 }}
          >
            <RotateCcw className="w-7 h-7 text-primary-foreground" />
          </motion.button>
          <motion.button
            onClick={() => toggleSave(affirmation)}
            className="w-14 h-14 rounded-2xl bg-primary-foreground/15 backdrop-blur-sm flex items-center justify-center border border-primary-foreground/10"
            whileTap={{ scale: 0.9 }}
          >
            <Bookmark
              className={`w-6 h-6 transition-all ${
                saved.has(affirmation) ? "text-primary-foreground fill-primary-foreground scale-110" : "text-primary-foreground/70"
              }`}
            />
          </motion.button>
        </div>
        <motion.button
          onClick={() => {
            if (navigator.share) {
              navigator.share({ text: affirmation });
            }
          }}
          className="w-full py-3 rounded-2xl bg-primary-foreground/15 backdrop-blur-sm text-primary-foreground font-body font-medium text-sm flex items-center justify-center gap-2 border border-primary-foreground/10"
          whileTap={{ scale: 0.98 }}
        >
          <Share2 className="w-4 h-4" />
          Share Affirmation
        </motion.button>
      </div>
    </div>
  );
};

export default AffirmationsPage;
