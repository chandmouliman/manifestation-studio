import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Moon, Play, Pause, Volume2 } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const sleepAffirmations = [
  "As I drift to sleep, my desires are manifesting.",
  "I am safe, I am loved, I am at peace.",
  "My subconscious mind is creating my dream reality.",
  "I release all worries and trust the process.",
  "While I sleep, the universe is aligning everything for me.",
  "I am worthy of all the beautiful things coming my way.",
  "My mind is calm, my body is relaxed, my soul is at peace.",
  "I fall asleep knowing that tomorrow brings miracles.",
  "Every cell in my body vibrates with peace and love.",
  "I am becoming the person I've always wanted to be.",
  "My dreams tonight plant seeds for tomorrow's reality.",
  "I surrender to the universe and trust divine timing.",
];

const nightSounds = [
  { id: "rain", label: "Rain", emoji: "🌧️" },
  { id: "crickets", label: "Crickets", emoji: "🦗" },
  { id: "waves", label: "Waves", emoji: "🌊" },
  { id: "wind", label: "Wind", emoji: "🍃" },
];

const createNightSound = (type: string, audioCtx: AudioContext): (() => void) => {
  const bufferSize = 2 * audioCtx.sampleRate;
  const noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
  const output = noiseBuffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) output[i] = Math.random() * 2 - 1;

  const whiteNoise = audioCtx.createBufferSource();
  whiteNoise.buffer = noiseBuffer;
  whiteNoise.loop = true;

  const filter = audioCtx.createBiquadFilter();
  const gain = audioCtx.createGain();

  if (type === "rain") {
    filter.type = "bandpass"; filter.frequency.value = 600; filter.Q.value = 0.4;
    gain.gain.value = 0.08;
  } else if (type === "crickets") {
    filter.type = "bandpass"; filter.frequency.value = 4000; filter.Q.value = 2;
    gain.gain.value = 0.03;
  } else if (type === "waves") {
    filter.type = "lowpass"; filter.frequency.value = 400;
    gain.gain.value = 0.1;
    const lfo = audioCtx.createOscillator(); lfo.type = "sine"; lfo.frequency.value = 0.08;
    const lfoGain = audioCtx.createGain(); lfoGain.gain.value = 0.06;
    lfo.connect(lfoGain).connect(gain.gain); lfo.start();
  } else {
    filter.type = "lowpass"; filter.frequency.value = 250;
    gain.gain.value = 0.06;
    const lfo = audioCtx.createOscillator(); lfo.type = "sine"; lfo.frequency.value = 0.12;
    const lfoGain = audioCtx.createGain(); lfoGain.gain.value = 0.04;
    lfo.connect(lfoGain).connect(gain.gain); lfo.start();
  }

  whiteNoise.connect(filter).connect(gain).connect(audioCtx.destination);
  whiteNoise.start();
  return () => { whiteNoise.stop(); };
};

const NightModePage = () => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeSound, setActiveSound] = useState<string | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const stopFnRef = useRef<(() => void) | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      stopFnRef.current?.();
      audioCtxRef.current?.close();
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const togglePlayback = () => {
    if (isPlaying) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      setIsPlaying(false);
    } else {
      intervalRef.current = setInterval(() => {
        setCurrentIndex(prev => (prev + 1) % sleepAffirmations.length);
      }, 8000);
      setIsPlaying(true);
    }
  };

  const toggleSound = (soundId: string) => {
    if (activeSound === soundId) {
      stopFnRef.current?.(); stopFnRef.current = null; setActiveSound(null); return;
    }
    stopFnRef.current?.();
    if (!audioCtxRef.current || audioCtxRef.current.state === "closed") {
      audioCtxRef.current = new AudioContext();
    }
    stopFnRef.current = createNightSound(soundId, audioCtxRef.current);
    setActiveSound(soundId);
  };

  return (
    <div className="min-h-screen pb-24 bg-foreground relative overflow-hidden">
      {/* Night sky decorations */}
      <div className="absolute top-20 left-12 w-2 h-2 rounded-full bg-primary-foreground/40 animate-sparkle" />
      <div className="absolute top-32 right-16 w-1.5 h-1.5 rounded-full bg-primary-foreground/30 animate-sparkle" style={{ animationDelay: "0.5s" }} />
      <div className="absolute top-48 left-1/3 w-1 h-1 rounded-full bg-primary-foreground/25 animate-sparkle" style={{ animationDelay: "1s" }} />
      <div className="absolute top-60 right-1/4 w-2 h-2 rounded-full bg-primary-foreground/35 animate-sparkle" style={{ animationDelay: "1.5s" }} />
      <div className="absolute top-24 right-1/3 w-1.5 h-1.5 rounded-full bg-lilac/30 animate-sparkle" style={{ animationDelay: "0.8s" }} />
      <div className="absolute top-72 left-1/4 w-1 h-1 rounded-full bg-pink-dream/30 animate-sparkle" style={{ animationDelay: "2s" }} />
      <div className="absolute bottom-40 right-12 w-20 h-20 rounded-full bg-lilac/8 blur-3xl animate-drift pointer-events-none" />
      <div className="absolute top-40 left-4 w-16 h-16 rounded-full bg-pink-dream/8 blur-3xl animate-float pointer-events-none" />

      {/* Header */}
      <div className="px-5 pt-14 pb-4 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-xl bg-primary-foreground/10 flex items-center justify-center">
          <ArrowLeft className="w-5 h-5 text-primary-foreground/70" />
        </button>
        <div>
          <h1 className="text-lg font-display font-bold text-primary-foreground flex items-center gap-2">
            <Moon className="w-5 h-5 text-lilac" /> Night Mode
          </h1>
          <p className="text-xs text-primary-foreground/50 font-body">SATS & Sleep Affirmations</p>
        </div>
      </div>

      {/* Moon illustration */}
      <div className="flex justify-center py-6">
        <motion.div
          className="w-24 h-24 rounded-full bg-gradient-to-br from-lilac/30 to-pink-dream/20 flex items-center justify-center shadow-glow"
          animate={{ scale: [1, 1.05, 1], opacity: [0.8, 1, 0.8] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          <span className="text-5xl">🌙</span>
        </motion.div>
      </div>

      {/* Current affirmation */}
      <div className="px-8 py-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            className="rounded-2xl p-6 bg-primary-foreground/5 backdrop-blur-sm border border-primary-foreground/10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-lg font-display italic text-primary-foreground/90 leading-relaxed text-center">
              "{sleepAffirmations[currentIndex]}"
            </p>
          </motion.div>
        </AnimatePresence>
        <div className="flex justify-center gap-1 mt-4">
          {sleepAffirmations.slice(0, 8).map((_, i) => (
            <div key={i} className={`w-1.5 h-1.5 rounded-full transition-all ${i === currentIndex % 8 ? "bg-lilac w-4" : "bg-primary-foreground/20"}`} />
          ))}
        </div>
      </div>

      {/* Controls */}
      <div className="px-8 space-y-4">
        <div className="flex items-center justify-center gap-6">
          <button
            onClick={() => setCurrentIndex(prev => (prev - 1 + sleepAffirmations.length) % sleepAffirmations.length)}
            className="w-12 h-12 rounded-full bg-primary-foreground/10 flex items-center justify-center"
          >
            <span className="text-primary-foreground/60 text-lg">←</span>
          </button>
          <motion.button
            onClick={togglePlayback}
            className="w-16 h-16 rounded-full bg-lilac/30 backdrop-blur-sm flex items-center justify-center border border-lilac/20 shadow-glow"
            whileTap={{ scale: 0.9 }}
          >
            {isPlaying ? (
              <Pause className="w-7 h-7 text-primary-foreground" />
            ) : (
              <Play className="w-7 h-7 text-primary-foreground ml-1" />
            )}
          </motion.button>
          <button
            onClick={() => setCurrentIndex(prev => (prev + 1) % sleepAffirmations.length)}
            className="w-12 h-12 rounded-full bg-primary-foreground/10 flex items-center justify-center"
          >
            <span className="text-primary-foreground/60 text-lg">→</span>
          </button>
        </div>

        {/* Night sounds */}
        <div>
          <p className="text-xs text-primary-foreground/40 font-body text-center mb-3 uppercase tracking-wider">
            <Volume2 className="w-3 h-3 inline mr-1" /> Sleep Sounds
          </p>
          <div className="flex gap-2 justify-center">
            {nightSounds.map((sound) => (
              <button
                key={sound.id}
                onClick={() => toggleSound(sound.id)}
                className={`px-4 py-2 rounded-xl text-xs font-body font-medium flex items-center gap-1.5 transition-all ${
                  activeSound === sound.id
                    ? "bg-lilac/30 text-primary-foreground border border-lilac/30"
                    : "bg-primary-foreground/8 text-primary-foreground/50 border border-transparent"
                }`}
              >
                <span>{sound.emoji}</span>
                <span>{sound.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* SATS Instructions */}
        <div className="rounded-2xl p-5 bg-primary-foreground/5 border border-primary-foreground/10 mt-6">
          <h3 className="text-sm font-display font-semibold text-primary-foreground/80 mb-2 flex items-center gap-2">
            🧘 SATS Practice Guide
          </h3>
          <div className="space-y-2">
            {[
              "Lie comfortably and close your eyes",
              "Take 3 slow, deep breaths",
              "Create a short scene implying your wish is fulfilled",
              "Loop the scene in first person",
              "Feel the emotions — joy, gratitude, peace",
              "Let yourself drift to sleep in the scene",
            ].map((step, i) => (
              <p key={i} className="text-xs font-body text-primary-foreground/50 flex gap-2">
                <span className="text-lilac shrink-0">{i + 1}.</span>
                <span>{step}</span>
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NightModePage;
