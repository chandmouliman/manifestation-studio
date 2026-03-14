import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  Sparkles,
  Brain,
  Moon,
  Eye,
  MessageCircle,
  Star,
  ChevronRight,
  ChevronDown,
  User,
  Bell,
  Palette,
  Crown,
  Info,
  ArrowLeft,
  Heart,
  Timer,
  Wrench,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const techniques = [
  {
    icon: Eye,
    title: "Visualization",
    color: "bg-lilac-light",
    iconColor: "text-lilac",
    desc: "Create vivid mental images of your desired reality. See it, feel it, believe it.",
    fullContent: `**How it works:** Visualization is the practice of creating detailed mental images of your desired reality. When you visualize, your subconscious mind cannot distinguish between a vividly imagined experience and an actual one.

**Step-by-step guide:**
1. Find a quiet, comfortable space where you won't be disturbed
2. Close your eyes and take 3 deep breaths to relax
3. Begin constructing your desired scene in vivid detail — what do you see, hear, smell, and feel?
4. Make it a first-person experience, not watching yourself like a movie
5. Focus on the emotions — joy, gratitude, excitement, peace
6. Stay in this state for 5-15 minutes
7. End by saying "Thank you" as if it has already happened

**Why it works:** Neville Goddard taught that "imagination creates reality." Your subconscious mind acts on the images you feed it. When you consistently visualize your desire as already fulfilled, you are reprogramming your beliefs and assumptions, which then manifest in your outer world.

**Tips for beginners:**
• Start with small, believable scenes
• Practice at the same time each day
• Don't force it — let the scene feel natural
• Focus on one specific desire at a time`,
  },
  {
    icon: MessageCircle,
    title: "Robotic Affirmations",
    color: "bg-pink-soft",
    iconColor: "text-rose",
    desc: "Repeat affirmations continuously until they become automatic beliefs.",
    fullContent: `**What are Robotic Affirmations?** This technique involves repeating a chosen affirmation hundreds or even thousands of times throughout the day, regardless of whether you believe it initially. The repetition itself is what creates belief.

**How to practice:**
1. Choose ONE affirmation that directly addresses your desire (e.g., "I am worthy of love" or "Money flows to me easily")
2. Set aside dedicated time — 15 to 30 minutes minimum
3. Repeat the affirmation out loud, in a whisper, or silently in your mind
4. Do it robotically — don't try to feel anything, just repeat
5. Continue throughout the day whenever your mind is idle
6. Do this consistently for at least 3-7 days

**The science behind it:** Repetition rewires neural pathways. This is called neuroplasticity. When you repeat a thought enough times, it becomes a dominant belief in your subconscious mind. Once it becomes a belief, your reality shifts to match it.

**Neville Goddard's perspective:** "An assumption, though false, if persisted in will harden into fact." This technique is the purest form of persisting in an assumption.

**Common mistakes to avoid:**
• Don't change affirmations too frequently
• Don't affirm from a place of desperation
• Don't contradict your affirmation with negative self-talk
• Stay consistent even when you don't see results immediately`,
  },
  {
    icon: Star,
    title: "Living in the End",
    color: "bg-lavender-light",
    iconColor: "text-lavender",
    desc: "Act, think, and feel as if your desire has already been fulfilled.",
    fullContent: `**The core principle:** "Living in the end" means adopting the thoughts, feelings, and behaviors of the version of you who already has what you desire. You don't wait for your desire to feel happy — you feel it NOW.

**How to practice daily:**
1. **Ask yourself:** "How would I feel if my wish were already fulfilled?"
2. **Adopt that feeling state** throughout your day
3. **Make decisions** from the perspective of your desired self
4. **React to situations** as your future self would
5. **Let go of the "how"** — don't worry about the bridge of incidents

**Practical examples:**
• If manifesting a relationship: Feel loved, act confident, be open and joyful
• If manifesting wealth: Feel abundant, be generous, make decisions without scarcity
• If manifesting health: Feel energetic, move your body, speak positively about your health

**Neville Goddard quote:** "Assume the feeling of the wish fulfilled and observe the route that your attention follows." The key insight is that the feeling IS the secret. When you dwell in the feeling of your wish fulfilled, the universe rearranges itself to match your inner state.

**The test:** If someone asked you right now about your desire, could you naturally respond as if it's already done? That's living in the end.`,
  },
  {
    icon: Brain,
    title: "Mental Diet",
    color: "bg-rose-light",
    iconColor: "text-rose",
    desc: "Monitor and control your inner dialogue. Only entertain thoughts aligned with your desires.",
    fullContent: `**What is a Mental Diet?** Coined by Neville Goddard, a mental diet is the practice of strictly monitoring your inner dialogue and only allowing thoughts that align with your desired reality. Just as a food diet controls what you eat, a mental diet controls what you think.

**How to start your mental diet:**
1. **Become aware** of your inner dialogue — most people have 60,000+ thoughts daily
2. **Catch negative thoughts** the moment they arise
3. **Don't fight them** — simply redirect to a positive thought
4. **Replace with the opposite:** "I can't" becomes "I can and I will"
5. **Be patient** — it takes 3-4 days to notice a shift

**The 3-Day Challenge:**
Neville suggested that if you can maintain a strict mental diet for just 3 days, you will see undeniable changes in your outer world. The challenge:
• Day 1: Catch and redirect every negative thought
• Day 2: Notice it becomes easier, thoughts start shifting naturally
• Day 3: You begin to feel the shift in your state of being

**Inner conversations matter most:**
Your inner dialogue — the conversations you have with yourself about others, about situations, about yourself — is what creates your reality. If you imagine negative conversations, you will experience them. If you imagine loving, positive conversations, that is what will manifest.

**Key insight:** "Do not try to change people; they are only messengers telling you who you are. Revalue yourself and they will confirm the change." — Neville Goddard`,
  },
  {
    icon: Moon,
    title: "SATS (State Akin To Sleep)",
    color: "bg-lilac-light",
    iconColor: "text-lilac",
    desc: "Visualize your desire in the drowsy state between waking and sleeping.",
    fullContent: `**What is SATS?** SATS stands for "State Akin To Sleep" — it's the technique Neville Goddard considered the most powerful. It involves visualizing your desire during the hypnagogic state, the drowsy period just before you fall asleep.

**Why the sleepy state is so powerful:** During this state, your conscious mind (the gatekeeper) relaxes, allowing direct access to your subconscious mind. Impressions made during SATS are incredibly powerful because they bypass all resistance and doubt.

**Step-by-step SATS practice:**
1. Lie down in bed as you normally would before sleep
2. Get into a comfortable position and close your eyes
3. Begin to relax your body from head to toe
4. As you feel yourself becoming drowsy, begin your scene
5. Create a SHORT scene (5-10 seconds) that implies your wish is fulfilled
6. The scene should be from FIRST PERSON perspective
7. Loop the scene over and over
8. Fall asleep in the scene if possible
9. If you wake up, repeat until you fall asleep naturally

**Choosing your scene:**
• Pick a scene that would happen AFTER your desire is fulfilled
• Example: If wanting a promotion, imagine a congratulations handshake
• Example: If wanting a relationship, imagine lying next to your person
• The scene should feel natural and real
• Include sensory details — touch, sound, sight

**Tips from Neville:**
• "Feel it real" — the feeling is more important than the visual
• Don't create a long movie — just one short, specific scene
• Practice every night until it feels natural
• You don't need to see it perfectly — feeling is enough

**Common issues:**
• "I fall asleep too fast" — Practice during the day while drowsy
• "I can't visualize" — Focus on feelings and sounds instead
• "My mind wanders" — Gently bring it back, don't force it`,
  },
];

const learningTopics = [
  {
    title: "What is Law of Assumption",
    icon: "📖",
    color: "gradient-dreamy",
    content: `The Law of Assumption, primarily taught by Neville Goddard (1905-1972), states that whatever you assume to be true becomes your reality. Unlike the Law of Attraction which focuses on "vibrations," the Law of Assumption focuses on your **beliefs and assumptions** about yourself and the world.

**Core principle:** "An assumption, though false, if persisted in will harden into fact." This means that your consistent assumptions — what you believe to be true — will inevitably manifest in your physical reality.

**How it works:**
1. Your consciousness is the only reality
2. The world is a mirror reflecting your assumptions
3. When you change your assumptions, your world changes
4. You don't attract what you want — you attract what you ARE
5. Everyone in your reality is you pushed out (reflecting your beliefs)

**Key differences from Law of Attraction:**
• LOA says "raise your vibration" — Law of Assumption says "change your beliefs"
• LOA focuses on positive thinking — Law of Assumption focuses on ASSUMING the end
• LOA can feel like chasing — Law of Assumption is about BEING

**The promise:** When you truly understand and apply this law, you realize that there are no limits. Every desire you have is achievable because reality is simply a reflection of your inner world. Change within, and the without must follow.`,
  },
  {
    title: "What are Affirmations",
    icon: "✨",
    color: "gradient-pink",
    content: `Affirmations are positive statements that you repeat to yourself to reprogram your subconscious mind. They are one of the most accessible and powerful tools for changing your self-concept and manifesting your desires.

**Why affirmations work:**
Your subconscious mind accepts whatever it is repeatedly told. When you affirm something consistently, it eventually becomes a belief. And your beliefs create your reality.

**Types of affirmations:**
1. **"I am" statements** — The most powerful form: "I am worthy," "I am abundant"
2. **Gratitude affirmations** — "I am so grateful that..." (implies it's already done)
3. **Present tense** — Always state as if it's happening NOW, not in the future
4. **Specific affirmations** — "I am earning ₹10 lakh per month effortlessly"
5. **General affirmations** — "Everything always works out for me"

**Best practices:**
• Choose affirmations that resonate with you personally
• Repeat them morning, afternoon, and before bed
• Say them with conviction, not desperation
• Write them down in a journal for extra impact
• Don't affirm one thing and then think the opposite

**The "I AM" power:**
Neville Goddard emphasized that "I AM" is the name of God — it is your creative power. Whatever you attach to "I AM" becomes your experience. "I am broke" creates poverty. "I am abundant" creates wealth. Choose your "I AM" statements wisely.

**How long until affirmations work?**
There is no fixed timeline. Some people see shifts in hours, others in weeks. The key is PERSISTENCE and FAITH. When you no longer need external validation and simply KNOW your affirmation is true, the manifestation appears.`,
  },
  {
    title: "What is Self Concept",
    icon: "👑",
    color: "gradient-lilac",
    content: `Self-concept is the collection of beliefs you hold about yourself. It's the foundation of everything you manifest. Neville Goddard taught that your self-concept — who you believe yourself to be — determines every aspect of your reality.

**Why self-concept is everything:**
Your self-concept acts as a filter through which all experiences pass. If you believe you are unworthy of love, you will unconsciously push love away. If you believe you are always lucky, fortunate things will constantly happen to you.

**Components of self-concept:**
1. **Self-worth** — Do you believe you deserve good things?
2. **Self-image** — How do you see yourself physically, mentally, emotionally?
3. **Self-efficacy** — Do you believe you can achieve what you want?
4. **Identity** — Who do you believe you ARE at your core?

**How to rebuild your self-concept:**
1. **Audit your current beliefs** — Write down what you believe about yourself
2. **Identify limiting beliefs** — "I'm not good enough," "Love is hard to find"
3. **Create new "I AM" statements** that reflect who you want to be
4. **Affirm daily** — "I am the most confident version of myself"
5. **Act as if** — Make decisions as your ideal self would
6. **Be patient** — Self-concept shifts take time but are permanent

**The mirror analogy:**
Imagine your reality is a mirror. You wouldn't try to change your reflection by touching the mirror — you'd change yourself. Similarly, trying to change external circumstances without changing your self-concept is futile. Change how you see yourself, and the mirror of reality must change too.

**Neville's teaching:** "Change your conception of yourself and you will automatically change the world in which you live." This is not metaphorical — it is literal. Your self-concept IS your destiny.`,
  },
  {
    title: "Teachings of Neville Goddard",
    icon: "🌟",
    color: "gradient-blush",
    content: `Neville Lancelot Goddard (1905-1972) was a mystic, author, and lecturer who taught that human imagination is God, and that through imagination and assumption, anyone can create their desired reality.

**Key teachings:**

**1. Imagination Creates Reality**
"Imagination is the only reality." Everything that exists was first imagined. Your imagination is not fantasy — it is the creative force of the universe working through you.

**2. Everyone Is You Pushed Out (EIYPO)**
Every person in your reality is reflecting your assumptions and beliefs about them. If you believe people are kind, they will be kind to you. If you believe your partner loves you deeply, they will show it. Change your assumptions about others, and they change.

**3. The Feeling Is The Secret**
It's not about thinking the right thoughts — it's about FEELING the reality of your desire. Neville said, "Feeling is the secret." When you can generate the feeling of having your desire, you have planted the seed for its manifestation.

**4. Revision**
Neville taught a technique called "revision" — at the end of each day, replay any negative event and reimagine it the way you WISH it had happened. This actually changes the outcome because reality is fluid and responds to your dominant assumptions.

**5. The Promise**
In his later years, Neville spoke about "The Promise" — a mystical spiritual experience that he believed was the ultimate purpose of human existence, transcending manifestation.

**Recommended works by Neville Goddard:**
• "Feeling Is The Secret" (1944)
• "The Power of Awareness" (1952)
• "Awakened Imagination" (1954)
• "The Law and The Promise" (1961)
• His hundreds of free lectures (available online)

**His legacy:** Neville's teachings have influenced countless modern manifestation and self-help movements. His work remains timeless because it addresses the fundamental nature of consciousness and reality.`,
  },
];

const MenuPage = () => {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const [expandedTechnique, setExpandedTechnique] = useState<number | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<number | null>(null);
  const [isUpgrading, setIsUpgrading] = useState(false);

  const handleUpgrade = async (planType: 'premium' | 'yearly') => {
    if (!user) {
      toast.error("Please log in to upgrade");
      navigate("/login");
      return;
    }

    setIsUpgrading(true);
    try {
      const response = await fetch("http://localhost:5001/api/subscription/upgrade", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id || user.uid, plan: "premium" }), // Map both id/uid
      });

      const data = await response.json();
      if (data.success) {
        updateUser(data.user);
        toast.success(`Upgraded to Premium!`);
      } else {
        throw new Error(data.error || "Upgrade failed");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to upgrade");
    } finally {
      setIsUpgrading(false);
    }
  };

  if (selectedTopic !== null) {
    const topic = learningTopics[selectedTopic];
    return (
      <div className="min-h-screen pb-24 bg-background">
        <div className="px-5 pt-14 pb-4 flex items-center gap-3">
          <button
            onClick={() => setSelectedTopic(null)}
            className="w-10 h-10 rounded-xl glass-pink flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <div>
            <h1 className="text-lg font-display font-bold text-foreground flex items-center gap-2">
              <span>{topic.icon}</span> {topic.title}
            </h1>
          </div>
        </div>
        <motion.div
          className="px-5"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="rounded-2xl p-5 gradient-fairy shadow-dreamy border border-border/30">
            <div className="prose prose-sm max-w-none">
              {topic.content.split('\n\n').map((paragraph, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="mb-4"
                >
                  {paragraph.split('\n').map((line, j) => {
                    if (line.startsWith('**') && line.endsWith('**')) {
                      return (
                        <h3 key={j} className="text-sm font-display font-bold text-foreground mt-4 mb-2">
                          {line.replace(/\*\*/g, '')}
                        </h3>
                      );
                    }
                    if (line.startsWith('**') && line.includes('**')) {
                      const parts = line.split('**');
                      return (
                        <p key={j} className="text-sm font-body text-foreground/80 leading-relaxed mb-1">
                          {parts.map((part, k) =>
                            k % 2 === 1 ? <strong key={k} className="text-foreground">{part}</strong> : part
                          )}
                        </p>
                      );
                    }
                    if (line.startsWith('•') || line.startsWith('1.') || line.startsWith('2.') || line.startsWith('3.') || line.startsWith('4.') || line.startsWith('5.') || line.startsWith('6.') || line.startsWith('7.')) {
                      return (
                        <p key={j} className="text-sm font-body text-foreground/75 leading-relaxed ml-2 mb-0.5 flex gap-2">
                          <span className="text-primary shrink-0">{line.match(/^[•\d.]+/)?.[0]}</span>
                          <span>{line.replace(/^[•\d.]+\s*/, '').replace(/\*\*/g, '')}</span>
                        </p>
                      );
                    }
                    return (
                      <p key={j} className="text-sm font-body text-foreground/80 leading-relaxed">
                        {line}
                      </p>
                    );
                  })}
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24 bg-background">
      {/* Decorative floating elements */}
      <div className="fixed top-20 right-4 w-20 h-20 rounded-full bg-pink-dream/20 blur-2xl animate-drift pointer-events-none" />
      <div className="fixed top-48 left-2 w-16 h-16 rounded-full bg-lilac/15 blur-2xl animate-float pointer-events-none" />

      <div className="px-5 pt-14 pb-4">
        <h1 className="text-2xl font-display font-bold text-foreground">Menu</h1>
        <p className="text-xs text-muted-foreground font-body mt-0.5">Your manifestation toolkit ✨</p>
      </div>

      <div className="px-5 space-y-5">
        {/* Profile Card */}
        <motion.div
          className="rounded-2xl p-5 gradient-fairy shadow-dreamy border border-border/30 flex items-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="w-14 h-14 rounded-full gradient-pink flex items-center justify-center shadow-pink">
            {user?.photoURL ? (
              <img src={user.photoURL} alt="Profile" className="w-full h-full rounded-full object-cover" />
            ) : (
              <User className="w-7 h-7 text-primary-foreground" />
            )}
          </div>
          <div className="flex-1">
            <p className="text-base font-body font-semibold text-foreground">
              {user?.name || user?.displayName || user?.email?.split('@')[0] || "Manifestor"}
            </p>
            <div className="flex flex-col">
              {user?.email && (user?.name || user?.displayName) && (
                <p className="text-[10px] text-muted-foreground font-body lowercase opacity-70">
                  {user.email}
                </p>
              )}
              <p className="text-xs text-muted-foreground font-body capitalize mt-0.5">
                {user?.plan || "Free Plan"}
              </p>
            </div>
          </div>
          {(!user?.plan || user?.plan === 'free') && (
            <button 
              onClick={() => handleUpgrade('premium')}
              disabled={isUpgrading}
              className="px-3 py-1.5 rounded-full bg-gold/10 text-gold text-xs font-body font-semibold flex items-center gap-1 hover:bg-gold/20 transition-colors"
            >
              <Crown className="w-3 h-3" /> {isUpgrading ? "Wait..." : "Upgrade"}
            </button>
          )}
        </motion.div>

        {(!user?.plan || user?.plan === 'free') && (
          <motion.div
            className="rounded-2xl p-5 gradient-lavender shadow-dreamy overflow-hidden relative"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="absolute top-2 right-2 w-8 h-8 rounded-full bg-primary-foreground/10 animate-sparkle" />
            <div className="absolute bottom-3 right-8 w-5 h-5 rounded-full bg-primary-foreground/10 animate-sparkle" style={{ animationDelay: '0.5s' }} />
            <div className="flex items-center gap-2 mb-2">
              <Crown className="w-5 h-5 text-primary-foreground" />
              <h3 className="text-base font-display font-bold text-primary-foreground">Go Premium</h3>
            </div>
            <p className="text-xs text-primary-foreground/80 font-body mb-3">
              Unlock unlimited affirmations, guided visualizations, custom generators & more.
            </p>
            <div className="flex gap-3">
              <button 
                onClick={() => handleUpgrade('premium')}
                className="flex-1 rounded-xl bg-primary-foreground/20 backdrop-blur-sm p-3 text-center hover:bg-primary-foreground/30 transition-colors"
              >
                <p className="text-lg font-display font-bold text-primary-foreground">$4.99</p>
                <p className="text-[10px] text-primary-foreground/70 font-body">/ month</p>
              </button>
              <button 
                onClick={() => handleUpgrade('premium')}
                className="flex-1 rounded-xl bg-primary-foreground/30 backdrop-blur-sm p-3 text-center border border-primary-foreground/20 hover:bg-primary-foreground/40 transition-colors"
              >
                <p className="text-lg font-display font-bold text-primary-foreground">$29.99</p>
                <p className="text-[10px] text-primary-foreground/70 font-body">/ year (save 50%)</p>
              </button>
            </div>
          </motion.div>
        )}

        {/* Quick Tools */}
        <div>
          <h2 className="text-lg font-display font-semibold text-foreground mb-3 flex items-center gap-2">
            <Wrench className="w-5 h-5 text-primary" /> Quick Tools
          </h2>
          <div className="grid grid-cols-3 gap-3">
            <motion.button
              className="rounded-2xl p-4 gradient-lilac shadow-dreamy flex flex-col items-center gap-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              onClick={() => navigate("/night-mode")}
              whileTap={{ scale: 0.95 }}
            >
              <Moon className="w-6 h-6 text-primary-foreground" />
              <span className="text-[10px] font-body font-medium text-primary-foreground">Night Mode</span>
            </motion.button>
            <motion.button
              className="rounded-2xl p-4 gradient-lavender shadow-dreamy flex flex-col items-center gap-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              onClick={() => navigate("/timer")}
              whileTap={{ scale: 0.95 }}
            >
              <Timer className="w-6 h-6 text-primary-foreground" />
              <span className="text-[10px] font-body font-medium text-primary-foreground">Timer</span>
            </motion.button>
            <motion.button
              className="rounded-2xl p-4 gradient-pink shadow-pink flex flex-col items-center gap-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              onClick={() => navigate("/tools")}
              whileTap={{ scale: 0.95 }}
            >
              <Sparkles className="w-6 h-6 text-primary-foreground" />
              <span className="text-[10px] font-body font-medium text-primary-foreground">All Tools</span>
            </motion.button>
          </div>
        </div>

        {/* Learning Section */}
        <div>
          <h2 className="text-lg font-display font-semibold text-foreground mb-3 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-primary" /> Learn
          </h2>
          <div className="space-y-2">
            {learningTopics.map((topic, i) => (
              <motion.button
                key={i}
                className={`w-full rounded-2xl p-4 ${topic.color} shadow-card border border-border/20 flex items-center gap-3`}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.05 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedTopic(i)}
              >
                <span className="text-xl">{topic.icon}</span>
                <span className="text-sm font-body font-medium text-foreground flex-1 text-left">
                  {topic.title}
                </span>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </motion.button>
            ))}
          </div>
        </div>

        {/* Techniques */}
        <div>
          <h2 className="text-lg font-display font-semibold text-foreground mb-3 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" /> Manifestation Techniques
          </h2>
          <div className="space-y-2">
            {techniques.map((tech, i) => (
              <motion.div
                key={i}
                className="rounded-2xl gradient-card shadow-card border border-border/20 overflow-hidden"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + i * 0.05 }}
              >
                <button
                  className="w-full p-4 flex items-center gap-3"
                  onClick={() => setExpandedTechnique(expandedTechnique === i ? null : i)}
                >
                  <div className={`w-9 h-9 rounded-xl ${tech.color} flex items-center justify-center`}>
                    <tech.icon className={`w-4 h-4 ${tech.iconColor}`} />
                  </div>
                  <span className="text-sm font-body font-medium text-foreground flex-1 text-left">
                    {tech.title}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-muted-foreground transition-transform duration-300 ${
                      expandedTechnique === i ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <AnimatePresence>
                  {expandedTechnique === i && (
                    <motion.div
                      className="px-4 pb-4"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="pl-12 space-y-3">
                        {tech.fullContent.split('\n\n').map((paragraph, pi) => (
                          <div key={pi}>
                            {paragraph.split('\n').map((line, li) => {
                              if (line.startsWith('**') && line.endsWith('**')) {
                                return (
                                  <h4 key={li} className="text-xs font-body font-bold text-foreground mt-2 mb-1">
                                    {line.replace(/\*\*/g, '')}
                                  </h4>
                                );
                              }
                              if (line.startsWith('**') && line.includes('**')) {
                                const parts = line.split('**');
                                return (
                                  <p key={li} className="text-xs text-foreground/75 font-body leading-relaxed mb-0.5">
                                    {parts.map((part, k) =>
                                      k % 2 === 1 ? <strong key={k} className="text-foreground">{part}</strong> : part
                                    )}
                                  </p>
                                );
                              }
                              if (line.startsWith('•') || line.match(/^\d\./)) {
                                return (
                                  <p key={li} className="text-xs text-foreground/70 font-body leading-relaxed ml-1 mb-0.5">
                                    {line}
                                  </p>
                                );
                              }
                              return line ? (
                                <p key={li} className="text-xs text-foreground/75 font-body leading-relaxed">
                                  {line}
                                </p>
                              ) : null;
                            })}
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Settings Links */}
        <div>
          <h2 className="text-lg font-display font-semibold text-foreground mb-3">Settings</h2>
          {[
            { icon: Bell, label: "Reminders" },
            { icon: Palette, label: "Appearance" },
            { icon: Info, label: "About" },
          ].map((item, i) => (
            <button
              key={i}
              className="w-full py-3 flex items-center gap-3 border-b border-border/30"
            >
              <item.icon className="w-5 h-5 text-muted-foreground" />
              <span className="text-sm font-body text-foreground flex-1 text-left">
                {item.label}
              </span>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MenuPage;
