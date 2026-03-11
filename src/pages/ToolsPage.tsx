import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, RefreshCw, Sparkles, ChevronRight } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

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

type Tool = "menu" | "rewrite" | "angel" | "challenges";

const ToolsPage = () => {
  const navigate = useNavigate();
  const [activeTool, setActiveTool] = useState<Tool>("menu");

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
  };

  const logAngel = () => {
    if (!angelInput.trim()) return;
    setAngelLog(prev => [{ number: angelInput, date: new Date().toLocaleDateString() }, ...prev]);
    setAngelInput("");
  };

  const toggleDay = (challengeIdx: number, day: number) => {
    const key = `${challengeIdx}-${day}`;
    setCompletedDays(prev => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  };

  if (activeTool === "menu") {
    const tools = [
      { id: "rewrite" as Tool, icon: "🔄", label: "Reality Rewrite", desc: "Transform limiting beliefs", color: "bg-rose-light" },
      { id: "angel" as Tool, icon: "👼", label: "Angel Numbers", desc: "Track & decode signs", color: "bg-lilac-light" },
      { id: "challenges" as Tool, icon: "🏆", label: "Challenges", desc: "7-day transformation programs", color: "bg-gold-light" },
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
              onClick={() => setActiveTool(tool.id)}
            >
              <div className="w-12 h-12 rounded-xl glass-card flex items-center justify-center shadow-card">
                <span className="text-2xl">{tool.icon}</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-body font-semibold text-foreground">{tool.label}</p>
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

        {/* Challenges */}
        {activeTool === "challenges" && (
          <>
            {selectedChallenge === null ? (
              challenges.map((challenge, i) => (
                <motion.button
                  key={i}
                  className={`w-full rounded-2xl p-5 ${challenge.color} shadow-dreamy border border-border/20 text-left`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedChallenge(i)}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-3xl">{challenge.icon}</span>
                    <div>
                      <p className="text-sm font-body font-semibold text-foreground">{challenge.title}</p>
                      <p className="text-xs text-muted-foreground font-body">7 days · Transform your mindset</p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    {challenge.days.map((_, d) => {
                      const done = completedDays.has(`${i}-${d + 1}`);
                      return (
                        <div key={d} className={`flex-1 h-2 rounded-full ${done ? "bg-primary" : "bg-foreground/10"}`} />
                      );
                    })}
                  </div>
                </motion.button>
              ))
            ) : (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <button
                  onClick={() => setSelectedChallenge(null)}
                  className="text-xs text-primary font-body font-medium mb-4 flex items-center gap-1"
                >
                  ← All Challenges
                </button>
                <div className="rounded-2xl p-5 gradient-fairy shadow-dreamy border border-border/20 mb-4">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">{challenges[selectedChallenge].icon}</span>
                    <h2 className="text-base font-display font-bold text-foreground">
                      {challenges[selectedChallenge].title}
                    </h2>
                  </div>
                  <div className="flex gap-1 mb-4">
                    {challenges[selectedChallenge].days.map((_, d) => {
                      const done = completedDays.has(`${selectedChallenge}-${d + 1}`);
                      return <div key={d} className={`flex-1 h-2.5 rounded-full ${done ? "bg-primary" : "bg-muted"}`} />;
                    })}
                  </div>
                </div>

                {challenges[selectedChallenge].days.map((day, d) => {
                  const done = completedDays.has(`${selectedChallenge}-${day.day}`);
                  return (
                    <motion.button
                      key={d}
                      className={`w-full rounded-2xl p-4 mb-2 flex items-start gap-3 text-left border transition-all ${
                        done
                          ? "bg-primary/5 border-primary/20"
                          : "gradient-fairy border-border/20 shadow-card"
                      }`}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: d * 0.05 }}
                      onClick={() => toggleDay(selectedChallenge, day.day)}
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-body font-bold ${
                        done ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                      }`}>
                        {done ? "✓" : day.day}
                      </div>
                      <div>
                        <p className={`text-sm font-body font-semibold ${done ? "text-primary" : "text-foreground"}`}>
                          Day {day.day}: {day.task}
                        </p>
                        <p className="text-xs text-muted-foreground font-body">{day.desc}</p>
                      </div>
                    </motion.button>
                  );
                })}
              </motion.div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ToolsPage;
