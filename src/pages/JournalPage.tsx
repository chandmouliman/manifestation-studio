import { motion, AnimatePresence } from "framer-motion";
import { Plus, Calendar, Heart, Sparkles, ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { journalPrompts } from "@/data/affirmations";
import { logUserActivity } from "@/lib/activity";

interface JournalEntry {
  id: number;
  date: string;
  prompt: string;
  content: string;
  type: "journal" | "gratitude" | "letter";
  mood?: string;
}

const gratitudePrompts = [
  "3 things I'm grateful for today...",
  "Something that made me smile today...",
  "A person I'm grateful to have in my life...",
  "A small blessing I noticed today...",
  "Something about myself I appreciate...",
];

const JournalPage = () => {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [activeTab, setActiveTab] = useState<"journal" | "gratitude" | "letter">("journal");
  const [showWrite, setShowWrite] = useState(false);
  const [currentPrompt, setCurrentPrompt] = useState(journalPrompts[0]);
  const [text, setText] = useState("");
  const [mood, setMood] = useState<string | null>(null);
  const [isFetching, setIsFetching] = useState(true);
  
  const { token, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      toast.error("Please login to access your journal");
      navigate("/login");
      return;
    }

    const fetchEntries = async () => {
      try {
        const response = await fetch("http://localhost:5001/api/journal", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.ok) {
          const data = await response.json();
          setEntries(data);
        }
      } catch (error) {
        toast.error("Failed to fetch entries");
      } finally {
        setIsFetching(false);
      }
    };

    fetchEntries();
  }, [token, navigate]);

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const saveEntry = async () => {
    if (!text.trim()) return;
    
    try {
      const response = await fetch("http://localhost:5001/api/journal", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          content: text,
          mood: mood || undefined,
          energy: activeTab, // Reusing energy field for tab type for now
        }),
      });

      if (response.ok) {
        const newEntry = await response.json();
        setEntries((prev) => [newEntry, ...prev]);
        setText("");
        setShowWrite(false);
        setMood(null);
        toast.success("Entry saved successfully");
        if (user?.id) {
          logUserActivity(user.id, 'JOURNAL_ENTRY_CREATED', `User created a ${activeTab} entry: "${text.substring(0, 50)}..."`);
        }
      } else {
        toast.error("Failed to save entry");
      }
    } catch (error) {
      toast.error("Connection error while saving");
    }
  };

  const randomPrompt = () => {
    if (activeTab === "gratitude") {
      setCurrentPrompt(gratitudePrompts[Math.floor(Math.random() * gratitudePrompts.length)]);
    } else {
      setCurrentPrompt(journalPrompts[Math.floor(Math.random() * journalPrompts.length)]);
    }
  };

  const filteredEntries = entries.filter(e => e.type === activeTab);

  const tabs = [
    { id: "journal" as const, label: "Journal", icon: "📖", gradient: "gradient-lavender" },
    { id: "gratitude" as const, label: "Gratitude", icon: "🙏", gradient: "gradient-pink" },
    { id: "letter" as const, label: "Future Letter", icon: "💌", gradient: "gradient-lilac" },
  ];

  return (
    <div className="min-h-screen pb-24 bg-background relative overflow-hidden">
      <div className="fixed top-32 right-0 w-20 h-20 rounded-full bg-pink-dream/15 blur-3xl animate-drift pointer-events-none" />
      <div className="fixed bottom-48 left-0 w-16 h-16 rounded-full bg-lilac/10 blur-3xl animate-float pointer-events-none" />

      <div className="px-5 pt-14 pb-4">
        <h1 className="text-2xl font-display font-bold text-foreground">Manifestation Journal</h1>
        <p className="text-sm text-muted-foreground font-body mt-1 flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5" />
          {today}
        </p>
      </div>

      {/* Tabs */}
      <div className="px-5 mb-4">
        <div className="flex gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setShowWrite(false);
                if (tab.id === "gratitude") setCurrentPrompt(gratitudePrompts[0]);
                else if (tab.id === "letter") setCurrentPrompt("Write a letter from your future self...");
                else setCurrentPrompt(journalPrompts[0]);
              }}
              className={`flex-1 py-2.5 rounded-xl text-xs font-body font-medium flex items-center justify-center gap-1.5 transition-all border ${
                activeTab === tab.id
                  ? "bg-primary/10 border-primary/30 text-primary shadow-sm"
                  : "bg-muted/50 border-border/20 text-muted-foreground"
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="px-5 space-y-4">
        {/* Write Button */}
        {!showWrite && (
          <motion.button
            className={`w-full rounded-2xl p-5 ${tabs.find(t => t.id === activeTab)?.gradient || "gradient-lavender"} shadow-soft text-left`}
            onClick={() => setShowWrite(true)}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-primary-foreground/20 backdrop-blur-sm flex items-center justify-center">
                <Plus className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <p className="text-sm font-body font-semibold text-primary-foreground">
                  {activeTab === "journal" && "Write Today's Entry"}
                  {activeTab === "gratitude" && "Practice Gratitude"}
                  {activeTab === "letter" && "Write to Your Future Self"}
                </p>
                <p className="text-xs text-primary-foreground/70 font-body">
                  {activeTab === "journal" && "Reflect on your manifestation journey"}
                  {activeTab === "gratitude" && "Count your blessings today"}
                  {activeTab === "letter" && "A message from your dream reality"}
                </p>
              </div>
            </div>
          </motion.button>
        )}

        {/* Write Area */}
        <AnimatePresence>
          {showWrite && (
            <motion.div
              className="rounded-2xl p-5 gradient-fairy shadow-soft border border-border/30 space-y-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {activeTab !== "letter" && (
                <div className="flex items-center justify-between">
                  <p className="text-xs font-body font-medium text-muted-foreground uppercase tracking-wider">
                    {activeTab === "gratitude" ? "Gratitude Prompt" : "Journal Prompt"}
                  </p>
                  <button onClick={randomPrompt} className="text-xs text-primary font-body font-medium">
                    New Prompt ✨
                  </button>
                </div>
              )}

              {activeTab === "letter" ? (
                <div className="space-y-2">
                  <p className="text-xs font-body font-medium text-muted-foreground uppercase tracking-wider">
                    💌 Letter from Future You
                  </p>
                  <p className="text-xs text-foreground/60 font-body italic">
                    Write as if you're your future self looking back. Share what life is like now that your dreams came true.
                  </p>
                  <p className="text-sm font-display italic text-primary">
                    "Dear past me..."
                  </p>
                </div>
              ) : (
                <p className="text-base font-display italic text-foreground">"{currentPrompt}"</p>
              )}

              {/* Mood selector */}
              <div>
                <p className="text-xs text-muted-foreground font-body mb-2">How do you feel?</p>
                <div className="flex gap-2">
                  {["😊", "😌", "🥰", "💪", "😐", "😔"].map((emoji) => (
                    <button
                      key={emoji}
                      onClick={() => setMood(emoji)}
                      className={`w-9 h-9 rounded-lg flex items-center justify-center text-lg transition-all ${
                        mood === emoji ? "bg-primary/15 scale-110 shadow-sm" : "bg-muted/50"
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder={
                  activeTab === "letter"
                    ? "Dear past me, I want you to know that everything worked out beautifully..."
                    : activeTab === "gratitude"
                    ? "I am so grateful for..."
                    : "Write your thoughts..."
                }
                rows={6}
                className="w-full px-4 py-3 rounded-xl bg-muted text-foreground font-body text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
              <div className="flex gap-3">
                <button
                  onClick={() => { setShowWrite(false); setMood(null); }}
                  className="flex-1 py-3 rounded-xl bg-muted text-foreground font-body font-medium text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={saveEntry}
                  className={`flex-1 py-3 rounded-xl ${tabs.find(t => t.id === activeTab)?.gradient || "gradient-lavender"} text-primary-foreground font-body font-medium text-sm`}
                >
                  Save {activeTab === "letter" ? "Letter" : "Entry"} ✨
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Entries */}
        {filteredEntries.length === 0 && !showWrite && (
          <div className="text-center py-12">
            <p className="text-4xl mb-3">
              {activeTab === "journal" ? "📖" : activeTab === "gratitude" ? "🙏" : "💌"}
            </p>
            <p className="text-sm text-muted-foreground font-body">
              {activeTab === "journal" && "Your journal is empty. Start writing!"}
              {activeTab === "gratitude" && "Begin your gratitude practice today!"}
              {activeTab === "letter" && "Write your first letter from the future!"}
            </p>
          </div>
        )}

        {filteredEntries.map((entry, i) => (
          <motion.div
            key={entry.id}
            className="rounded-2xl p-5 gradient-fairy shadow-card border border-border/20"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <div className="flex items-center justify-between mb-1">
              <p className="text-xs text-muted-foreground font-body">{entry.date}</p>
              {entry.mood && <span className="text-lg">{entry.mood}</span>}
            </div>
            {entry.type !== "letter" && (
              <p className="text-xs text-primary font-body italic mb-2">"{entry.prompt}"</p>
            )}
            {entry.type === "letter" && (
              <p className="text-xs text-lilac font-body font-medium mb-2">💌 Letter from Future Self</p>
            )}
            <p className="text-sm text-foreground font-body leading-relaxed">{entry.content}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default JournalPage;
