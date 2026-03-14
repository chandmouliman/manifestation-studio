import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, RefreshCw, Sparkles, ChevronRight, Lock, Crown, Mic, Camera, Music } from "lucide-react";
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { logUserActivity } from "@/lib/activity";

// Angel Numbers data
const angelNumbers: Record<string, { meaning: string; message: string }> = {
  "111": { meaning: "Alignment & New Beginnings", message: "Your thoughts are manifesting rapidly. Stay positive and focused on your desires." },
  "222": { meaning: "Trust the Process", message: "Everything is unfolding perfectly. Have faith and patience." },
  "333": { meaning: "Ascended Masters", message: "You are being guided and supported by the universe. Keep going." },
  "444": { meaning: "Protection & Foundation", message: "Angels are surrounding you with love and protection. You are safe." },
  "555": { meaning: "Major Changes Coming", message: "A significant shift is happening. Embrace the transformation." },
  "666": { meaning: "Balance & Realignment", message: "Refocus your thoughts. Release worry and trust your path." },
  "777": { meaning: "Divine Luck & Miracles", message: "You are in alignment. Miracles are flowing to you." },
  "888": { meaning: "Abundance Incoming", message: "Financial abundance and success are on their way to you." },
  "999": { meaning: "Completion & Release", message: "A chapter is closing. Make space for something better." },
  "1111": { meaning: "Manifestation Portal", message: "Your thoughts are creating reality. This is a powerful sign." },
  "1234": { meaning: "Steps in the Right Direction", message: "You are on the right path. Keep moving forward." },
};

// Challenge data
const challenges = [
  {
    title: "7-Day Self Concept Challenge",
    icon: "👑",
    color: "bg-gold-light",
    days: [
      { day: 1, task: "Self love affirmations", desc: "Repeat 'I am worthy of all good things' 100 times" },
      { day: 2, task: "Visualization exercise", desc: "Visualize yourself as your ideal self for 10 minutes" },
      { day: 3, task: "Mental diet practice", desc: "Catch & redirect every negative thought today" },
      { day: 4, task: "Gratitude journaling", desc: "Write 10 things you love about yourself" },
      { day: 5, task: "Self concept meditation", desc: "Meditate on 'I AM' for 15 minutes" },
      { day: 6, task: "Robotic affirmations", desc: "Repeat 'I am the best version of myself' for 20 min" },
      { day: 7, task: "Living in the end", desc: "Spend the entire day AS your ideal self" },
    ],
  },
  {
    title: "7-Day Abundance Challenge",
    icon: "💰",
    color: "bg-lavender-light",
    days: [
      { day: 1, task: "Money affirmations", desc: "Affirm 'Money flows to me easily' 100 times" },
      { day: 2, task: "Abundance visualization", desc: "Visualize your dream bank balance" },
      { day: 3, task: "Gratitude for money", desc: "Thank every dollar you spend today" },
      { day: 4, task: "Wealth self concept", desc: "Journal about yourself as a wealthy person" },
      { day: 5, task: "Release lack beliefs", desc: "Identify and rewrite 5 money limiting beliefs" },
      { day: 6, task: "Act as if wealthy", desc: "Make decisions as your abundant self" },
      { day: 7, task: "Generosity practice", desc: "Give freely knowing abundance is your nature" },
    ],
  },
];

type Tool = "menu" | "rewrite" | "angel" | "challenges" | "scripting" | "mirror" | "audio";

const ToolsPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTool, setActiveTool] = useState<Tool>("menu");
  const isPremium = user?.plan === 'premium';
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);

  // Reality Rewrite
  const [oldBelief, setOldBelief] = useState("");
  const [newBelief, setNewBelief] = useState("");
  const [rewrites, setRewrites] = useState<{ old: string; new: string }[]>([
    { old: "I always fail at everything.", new: "Everything works out for me beautifully." },
    { old: "I'm not good enough.", new: "I am more than enough exactly as I am." },
  ]);

  // Angel Numbers
  const [angelInput, setAngelInput] = useState("");
  const [angelLog, setAngelLog] = useState<{ number: string; date: string }[]>([]);

  // Challenges
  const [selectedChallenge, setSelectedChallenge] = useState<number | null>(null);
  const [completedDays, setCompletedDays] = useState<Set<string>>(new Set());

  const addRewrite = () => {
    if (!oldBelief.trim() || !newBelief.trim()) return;
    setRewrites(prev => [{ old: oldBelief, new: newBelief }, ...prev]);
    setOldBelief(""); setNewBelief("");
    if (user?.id) {
      logUserActivity(user.id, 'REALITY_REWRITE_SAVED', `User reframed: "${oldBelief}" → "${newBelief}"`);
    }
  };

  const logAngel = () => {
    if (!angelInput.trim()) return;
    setAngelLog(prev => [{ number: angelInput, date: new Date().toLocaleDateString() }, ...prev]);
    if (user?.id) {
      const meaning = angelNumbers[angelInput]?.meaning || "Unknown";
      logUserActivity(user.id, 'ANGEL_NUMBER_LOGGED', `User logged angel number ${angelInput} (${meaning})`);
    }
    setAngelInput("");
  };

  const toggleDay = (challengeIdx: number, day: number) => {
    const key = `${challengeIdx}-${day}`;
    setCompletedDays(prev => {
      const next = new Set(prev);
      const isDone = next.has(key);
      isDone ? next.delete(key) : next.add(key);
      if (user?.id && !isDone) {
        const challenge = challenges[challengeIdx];
        logUserActivity(user.id, 'CHALLENGE_DAY_COMPLETED', `User completed Day ${day} of "${challenge.title}"`);
      }
      return next;
    });
  };

  if (activeTool === "menu") {
    const tools = [
      { id: "rewrite" as Tool, icon: "🔄", label: "Reality Rewrite", desc: "Transform limiting beliefs", color: "bg-rose-light" },
      { id: "angel" as Tool, icon: "👼", label: "Angel Numbers", desc: "Track & decode signs", color: "bg-lilac-light" },
      { id: "challenges" as Tool, icon: "🏆", label: "Challenges", desc: "7-day transformation programs", color: "bg-gold-light" },
      { id: "scripting" as Tool, icon: "✍️", label: "Advanced Scripting", desc: "369 & 5x55 Methods", color: "bg-pink-soft", premium: true },
      { id: "mirror" as Tool, icon: "🪞", label: "Mirror Work Mode", desc: "Subconscious reprogramming", color: "bg-sage-light", premium: true },
      { id: "audio" as Tool, icon: "🎧", label: "Subliminal Audio", desc: "High-vibration tracks", color: "bg-indigo-light", premium: true },
    ];

    return (
      <div className="min-h-screen pb-24 bg-background relative overflow-hidden">
        <div className="fixed top-24 right-0 w-24 h-24 rounded-full bg-pink-dream/15 blur-3xl animate-drift pointer-events-none" />
        <div className="px-5 pt-14 pb-4 flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-xl glass-pink flex items-center justify-center">
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <div>
            <h1 className="text-lg font-display font-bold text-foreground">Manifestation Tools</h1>
            <p className="text-xs text-muted-foreground font-body">Power up your practice ✨</p>
          </div>
        </div>
        <div className="px-5 space-y-3">
          {tools.map((tool, i) => (
            <motion.button
              key={tool.id}
              className={`w-full rounded-2xl p-5 ${tool.color} shadow-dreamy border border-border/20 flex items-center gap-4 text-left`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                if (tool.premium && !isPremium) {
                  navigate('/trial-expired'); // or a specific premium pitch page
                  return;
                }
                setActiveTool(tool.id);
                if (user?.id) {
                  logUserActivity(user.id, 'TOOL_SELECTED', `User opened tool: ${tool.label}`);
                }
              }}
            >
              <div className="w-12 h-12 rounded-xl glass-card flex items-center justify-center shadow-card relative">
                <span className="text-2xl">{tool.icon}</span>
                {tool.premium && !isPremium && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-gold flex items-center justify-center border-2 border-white">
                    <Lock size={10} className="text-white" />
                  </div>
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-body font-semibold text-foreground">{tool.label}</p>
                  {tool.premium && <Crown size={12} className="text-gold" />}
                </div>
                <p className="text-xs text-muted-foreground font-body">{tool.desc}</p>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </motion.button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24 bg-background relative overflow-hidden">
      <div className="fixed top-24 right-0 w-20 h-20 rounded-full bg-pink-dream/15 blur-3xl animate-drift pointer-events-none" />

      <div className="px-5 pt-14 pb-4 flex items-center gap-3">
        <button onClick={() => setActiveTool("menu")} className="w-10 h-10 rounded-xl glass-pink flex items-center justify-center">
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        <h1 className="text-lg font-display font-bold text-foreground">
          {activeTool === "rewrite" && "🔄 Reality Rewrite"}
          {activeTool === "angel" && "👼 Angel Numbers"}
          {activeTool === "challenges" && "🏆 Challenges"}
          {activeTool === "scripting" && "✍️ Advanced Scripting"}
          {activeTool === "mirror" && "🪞 Mirror Work"}
          {activeTool === "audio" && "🎧 Subliminal Audio"}
        </h1>
      </div>

      <div className="px-5 space-y-4">
        {/* Reality Rewrite Tool */}
        {activeTool === "rewrite" && (
          <>
            <motion.div
              className="rounded-2xl p-5 gradient-fairy shadow-dreamy border border-border/20 space-y-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <p className="text-xs font-body text-foreground/60 italic">
                Reframe negative beliefs into empowering ones. Your subconscious accepts what you persistently tell it.
              </p>
              <div>
                <label className="text-xs font-body font-medium text-destructive/70 mb-1 block">Old Belief</label>
                <input
                  value={oldBelief}
                  onChange={(e) => setOldBelief(e.target.value)}
                  placeholder="e.g. I always struggle with money..."
                  className="w-full px-4 py-3 rounded-xl bg-destructive/5 text-foreground font-body text-sm focus:outline-none focus:ring-2 focus:ring-destructive/20 border border-destructive/10"
                />
              </div>
              <div className="flex justify-center">
                <div className="w-8 h-8 rounded-full gradient-pink flex items-center justify-center">
                  <RefreshCw className="w-4 h-4 text-primary-foreground" />
                </div>
              </div>
              <div>
                <label className="text-xs font-body font-medium text-primary/70 mb-1 block">New Empowering Belief</label>
                <input
                  value={newBelief}
                  onChange={(e) => setNewBelief(e.target.value)}
                  placeholder="e.g. Money flows to me with ease..."
                  className="w-full px-4 py-3 rounded-xl bg-primary/5 text-foreground font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 border border-primary/10"
                />
              </div>
              <button
                onClick={addRewrite}
                className="w-full py-3 rounded-xl gradient-lavender text-primary-foreground font-body font-medium text-sm shadow-pink"
              >
                Save Rewrite ✨
              </button>
            </motion.div>

            {rewrites.map((r, i) => (
              <motion.div
                key={i}
                className="rounded-2xl p-4 gradient-fairy shadow-card border border-border/20"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <div className="flex items-start gap-3 mb-2">
                  <span className="text-xs text-destructive/60 font-body">❌</span>
                  <p className="text-xs font-body text-foreground/50 line-through">{r.old}</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-xs text-primary font-body">✨</span>
                  <p className="text-sm font-body font-medium text-foreground">{r.new}</p>
                </div>
              </motion.div>
            ))}
          </>
        )}

        {/* Angel Number Tracker */}
        {activeTool === "angel" && (
          <>
            <motion.div
              className="rounded-2xl p-5 gradient-fairy shadow-dreamy border border-border/20 space-y-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <p className="text-xs font-body text-foreground/60 italic">
                Log angel numbers you see throughout your day. The universe is always sending you signs! ✨
              </p>
              <div className="flex gap-2">
                <input
                  value={angelInput}
                  onChange={(e) => setAngelInput(e.target.value.replace(/[^0-9]/g, ""))}
                  placeholder="Enter angel number (e.g. 111)"
                  maxLength={4}
                  className="flex-1 px-4 py-3 rounded-xl bg-muted text-foreground font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 text-center text-lg font-display"
                />
                <button
                  onClick={logAngel}
                  className="px-5 py-3 rounded-xl gradient-lilac text-primary-foreground font-body font-medium text-sm"
                >
                  Log ✨
                </button>
              </div>

              {/* Meaning display */}
              {angelInput && angelNumbers[angelInput] && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="rounded-xl p-4 bg-lilac-light border border-lilac/20"
                >
                  <p className="text-sm font-display font-bold text-foreground mb-1">
                    {angelInput} — {angelNumbers[angelInput].meaning}
                  </p>
                  <p className="text-xs font-body text-foreground/70">{angelNumbers[angelInput].message}</p>
                </motion.div>
              )}
            </motion.div>

            {/* Quick reference */}
            <div>
              <p className="text-xs font-body font-medium text-muted-foreground uppercase tracking-wider mb-3">
                Angel Number Meanings
              </p>
              <div className="grid grid-cols-3 gap-2">
                {Object.entries(angelNumbers).slice(0, 9).map(([num, data]) => (
                  <button
                    key={num}
                    onClick={() => setAngelInput(num)}
                    className="rounded-xl p-3 gradient-fairy shadow-card border border-border/20 text-center"
                  >
                    <p className="text-lg font-display font-bold text-primary">{num}</p>
                    <p className="text-[9px] font-body text-muted-foreground leading-tight">{data.meaning}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Log */}
            {angelLog.length > 0 && (
              <div>
                <p className="text-xs font-body font-medium text-muted-foreground uppercase tracking-wider mb-3">
                  Your Sightings
                </p>
                {angelLog.map((log, i) => (
                  <motion.div
                    key={i}
                    className="flex items-center gap-3 py-2 border-b border-border/20"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <span className="text-lg font-display font-bold text-primary">{log.number}</span>
                    <span className="text-xs text-muted-foreground font-body flex-1">{log.date}</span>
                    {angelNumbers[log.number] && (
                      <span className="text-[10px] font-body text-foreground/50">{angelNumbers[log.number].meaning}</span>
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </>
        )}

        {/* Advanced Scripting */}
        {activeTool === "scripting" && (
          <div className="space-y-6">
            <div className="rounded-2xl p-5 gradient-fairy border border-border/20 shadow-dreamy">
              <h3 className="text-sm font-display font-bold text-foreground mb-2">369 Method Template</h3>
              <p className="text-xs text-muted-foreground font-body mb-4 italic">Write 3 times in the morning, 6 in the afternoon, 9 at night.</p>
              <div className="space-y-3">
                <input placeholder="Your intention (Morning x3)" className="w-full px-4 py-3 rounded-xl bg-primary/5 border border-primary/20 text-sm font-body" />
                <input placeholder="Your intention (Afternoon x6)" className="w-full px-4 py-3 rounded-xl bg-lilac/5 border border-lilac/20 text-sm font-body" />
                <input placeholder="Your intention (Night x9)" className="w-full px-4 py-3 rounded-xl bg-rose/5 border border-rose/20 text-sm font-body" />
                <button className="w-full py-3 rounded-xl gradient-lavender text-primary-foreground font-bold shadow-pink">Record Scripting ✨</button>
              </div>
            </div>
            <div className="rounded-2xl p-5 gradient-fairy border border-border/20 shadow-dreamy">
              <h3 className="text-sm font-display font-bold text-foreground mb-2">5x55 Manifestation</h3>
              <p className="text-xs text-muted-foreground font-body mb-4 italic">Write your intention 55 times for 5 consecutive days.</p>
              <div className="bg-muted/30 p-4 rounded-xl text-center">
                 <span className="text-2xl font-display font-bold text-primary">Day 1 / 5</span>
              </div>
            </div>
          </div>
        )}

        {/* Mirror Work Mode */}
        {activeTool === "mirror" && (
          <div className="space-y-6">
            <div className="relative rounded-3xl overflow-hidden aspect-[3/4] bg-black shadow-dreamy">
              <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover grayscale opacity-60" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
              <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
                <AnimatePresence mode="wait">
                  <motion.p 
                    key={Math.random()} // In real app, cycle these
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="text-white text-xl font-display font-bold drop-shadow-lg"
                  >
                    "I am the architect of my reality"
                  </motion.p>
                </AnimatePresence>
              </div>
            </div>
            <button 
              onClick={async () => {
                if (!isCameraActive) {
                  const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                  if (videoRef.current) videoRef.current.srcObject = stream;
                  setIsCameraActive(true);
                } else {
                  if (videoRef.current && videoRef.current.srcObject) {
                    (videoRef.current.srcObject as MediaStream).getTracks().forEach(t => t.stop());
                    videoRef.current.srcObject = null;
                  }
                  setIsCameraActive(false);
                }
              }}
              className={`w-full py-4 rounded-2xl flex items-center justify-center gap-2 font-display font-bold text-lg shadow-dreamy transition-all ${
                isCameraActive ? "bg-destructive text-white" : "gradient-lavender text-primary-foreground"
              }`}
            >
              <Camera size={20} />
              {isCameraActive ? "Deactivate Mirror" : "Enter Mirror Realm"}
            </button>
          </div>
        )}

        {/* Subliminal Audio */}
        {activeTool === "audio" && (
          <div className="space-y-4">
             {[
               { title: "Quantum Wealth Shift", freq: "888Hz", duration: "11:11" },
               { title: "Subconscious Love Portal", freq: "528Hz", duration: "10:00" },
               { title: "Divine Healing Light", freq: "432Hz", duration: "15:00" },
               { title: "The Master Manifestor", freq: "7.83Hz", duration: "08:16" }
             ].map((track, i) => (
                <div key={i} className="rounded-2xl p-5 gradient-fairy border border-border/20 shadow-card flex items-center gap-4 group hover:border-primary/30 transition-all">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
                    <Music size={20} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-body font-bold text-foreground">{track.title}</p>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest">{track.freq} · {track.duration}</p>
                  </div>
                  <button className="p-2 rounded-lg bg-muted text-foreground/40 hover:text-primary transition-all">
                    <ChevronRight size={18} />
                  </button>
                </div>
             ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ToolsPage;
