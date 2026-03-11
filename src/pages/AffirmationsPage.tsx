import { motion, AnimatePresence } from "framer-motion";
import { Heart, Share2, RotateCcw, ArrowLeft, Bookmark, Volume2, VolumeX, Music } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { affirmationCategories } from "@/data/affirmations";

const ambientSounds = [
  { id: "rain", label: "🌧️ Raindrops", emoji: "🌧️" },
  { id: "waves", label: "🌊 Ocean Waves", emoji: "🌊" },
  { id: "bowl", label: "🔔 Singing Bowl", emoji: "🔔" },
  { id: "forest", label: "🌿 Forest", emoji: "🌿" },
  { id: "wind", label: "🍃 Gentle Wind", emoji: "🍃" },
];

// Generate ambient sound using Web Audio API
const createAmbientSound = (type: string, audioCtx: AudioContext): (() => void) => {
  if (type === "rain") {
    // Rain: filtered white noise with modulation
    const bufferSize = 2 * audioCtx.sampleRate;
    const noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }
    const whiteNoise = audioCtx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;
    const filter = audioCtx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.value = 800;
    filter.Q.value = 0.5;
    const gain = audioCtx.createGain();
    gain.gain.value = 0.12;
    whiteNoise.connect(filter).connect(gain).connect(audioCtx.destination);
    whiteNoise.start();
    return () => { whiteNoise.stop(); };
  }
  
  if (type === "waves") {
    // Ocean waves: modulated noise
    const bufferSize = 2 * audioCtx.sampleRate;
    const noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }
    const whiteNoise = audioCtx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;
    const filter = audioCtx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 500;
    const gain = audioCtx.createGain();
    gain.gain.value = 0.15;
    // Wave modulation
    const lfo = audioCtx.createOscillator();
    lfo.type = "sine";
    lfo.frequency.value = 0.1;
    const lfoGain = audioCtx.createGain();
    lfoGain.gain.value = 0.1;
    lfo.connect(lfoGain).connect(gain.gain);
    lfo.start();
    whiteNoise.connect(filter).connect(gain).connect(audioCtx.destination);
    whiteNoise.start();
    return () => { whiteNoise.stop(); lfo.stop(); };
  }
  
  if (type === "bowl") {
    // Singing bowl: sustained harmonic tone
    const osc1 = audioCtx.createOscillator();
    osc1.type = "sine";
    osc1.frequency.value = 256;
    const osc2 = audioCtx.createOscillator();
    osc2.type = "sine";
    osc2.frequency.value = 384;
    const osc3 = audioCtx.createOscillator();
    osc3.type = "sine";
    osc3.frequency.value = 512;
    const gain = audioCtx.createGain();
    gain.gain.value = 0.06;
    const lfo = audioCtx.createOscillator();
    lfo.type = "sine";
    lfo.frequency.value = 0.3;
    const lfoGain = audioCtx.createGain();
    lfoGain.gain.value = 0.02;
    lfo.connect(lfoGain).connect(gain.gain);
    osc1.connect(gain);
    osc2.connect(gain);
    osc3.connect(gain);
    gain.connect(audioCtx.destination);
    osc1.start(); osc2.start(); osc3.start(); lfo.start();
    return () => { osc1.stop(); osc2.stop(); osc3.stop(); lfo.stop(); };
  }
  
  if (type === "forest") {
    // Forest: higher filtered noise with subtle birds (oscillators)
    const bufferSize = 2 * audioCtx.sampleRate;
    const noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }
    const whiteNoise = audioCtx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;
    const filter = audioCtx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.value = 2000;
    filter.Q.value = 0.3;
    const gain = audioCtx.createGain();
    gain.gain.value = 0.06;
    whiteNoise.connect(filter).connect(gain).connect(audioCtx.destination);
    whiteNoise.start();
    return () => { whiteNoise.stop(); };
  }
  
  // Wind
  const bufferSize = 2 * audioCtx.sampleRate;
  const noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
  const output = noiseBuffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    output[i] = Math.random() * 2 - 1;
  }
  const whiteNoise = audioCtx.createBufferSource();
  whiteNoise.buffer = noiseBuffer;
  whiteNoise.loop = true;
  const filter = audioCtx.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = 300;
  const gain = audioCtx.createGain();
  gain.gain.value = 0.1;
  const lfo = audioCtx.createOscillator();
  lfo.type = "sine";
  lfo.frequency.value = 0.15;
  const lfoGain = audioCtx.createGain();
  lfoGain.gain.value = 0.06;
  lfo.connect(lfoGain).connect(gain.gain);
  lfo.start();
  whiteNoise.connect(filter).connect(gain).connect(audioCtx.destination);
  whiteNoise.start();
  return () => { whiteNoise.stop(); lfo.stop(); };
};

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
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get("category") || null;
  const [selectedCategory, setSelectedCategory] = useState<string | null>(initialCategory);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [liked, setLiked] = useState<Set<string>>(new Set());
  const [saved, setSaved] = useState<Set<string>>(new Set());
  const [activeSound, setActiveSound] = useState<string | null>(null);
  const [showSounds, setShowSounds] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const stopFnRef = useRef<(() => void) | null>(null);

  const activeCategory = affirmationCategories.find((c) => c.id === selectedCategory);

  useEffect(() => {
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
      next.has(aff) ? next.delete(aff) : next.add(aff);
      return next;
    });
  };

  const toggleSave = (aff: string) => {
    setSaved((prev) => {
      const next = new Set(prev);
      next.has(aff) ? next.delete(aff) : next.add(aff);
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
      {/* Dreamy decorations */}
      <div className="absolute top-20 right-8 w-24 h-24 rounded-full bg-primary-foreground/10 blur-2xl animate-drift pointer-events-none" />
      <div className="absolute bottom-32 left-4 w-16 h-16 rounded-full bg-primary-foreground/10 blur-2xl animate-float pointer-events-none" />
      <div className="absolute top-1/3 left-1/4 w-3 h-3 rounded-full bg-primary-foreground/30 animate-sparkle pointer-events-none" />
      <div className="absolute top-1/2 right-1/3 w-2 h-2 rounded-full bg-primary-foreground/25 animate-sparkle pointer-events-none" style={{ animationDelay: '0.7s' }} />

      {/* Header */}
      <div className="px-5 pt-14 pb-4 flex items-center gap-3">
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
            className="text-center px-4 py-10 rounded-3xl bg-primary-foreground/10 backdrop-blur-sm border border-primary-foreground/10 shadow-dreamy"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -20 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <div className="text-3xl mb-4 animate-pulse-soft">{activeCategory.icon}</div>
            <p className="text-xl font-display italic text-primary-foreground leading-relaxed">
              "{affirmation}"
            </p>
            <div className="mt-4 flex justify-center gap-1">
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
