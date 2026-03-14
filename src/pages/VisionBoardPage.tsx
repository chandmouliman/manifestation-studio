import { motion, AnimatePresence } from "framer-motion";
import { Plus, X, ImageIcon, Sparkles, ChevronDown } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { logUserActivity } from "@/lib/activity";

interface VisionItem {
  id: string;
  type: "image" | "text";
  content: string;
  category?: string;
  bgClass?: string;
  bg_class?: string; // Support backend naming
}

const visionCategories = [
  {
    id: "dream-home",
    name: "Dream Home",
    emoji: "🏡",
    examples: [
      { type: "text" as const, content: "🏡 My beautiful dream home", bgClass: "bg-lavender-light" },
      { type: "text" as const, content: "🛋️ Cozy minimalist living room", bgClass: "bg-pink-soft" },
      { type: "text" as const, content: "🌸 A garden full of flowers", bgClass: "bg-rose-light" },
    ],
  },
  {
    id: "travel",
    name: "Travel",
    emoji: "✈️",
    examples: [
      { type: "text" as const, content: "✈️ First class to Paris", bgClass: "bg-lilac-light" },
      { type: "text" as const, content: "🏝️ Beach sunset in Maldives", bgClass: "bg-gold-light" },
      { type: "text" as const, content: "🗼 Exploring Tokyo streets", bgClass: "bg-lavender-light" },
    ],
  },
  {
    id: "career",
    name: "Career",
    emoji: "💼",
    examples: [
      { type: "text" as const, content: "💼 CEO of my dream company", bgClass: "bg-sage-light" },
      { type: "text" as const, content: "🎤 Speaking on world stages", bgClass: "bg-gold-light" },
      { type: "text" as const, content: "📈 Multiple income streams", bgClass: "bg-lavender-light" },
    ],
  },
  {
    id: "love",
    name: "Love & Relationships",
    emoji: "💕",
    examples: [
      { type: "text" as const, content: "💕 Deeply loved & cherished", bgClass: "bg-rose-light" },
      { type: "text" as const, content: "💍 Dream wedding by the sea", bgClass: "bg-pink-soft" },
      { type: "text" as const, content: "🥰 Soulmate connection daily", bgClass: "bg-lavender-light" },
    ],
  },
  {
    id: "luxury",
    name: "Luxury Lifestyle",
    emoji: "✨",
    examples: [
      { type: "text" as const, content: "✨ Luxury lifestyle everyday", bgClass: "bg-gold-light" },
      { type: "text" as const, content: "🚗 Driving my dream car", bgClass: "bg-lavender-light" },
      { type: "text" as const, content: "👗 Designer wardrobe goals", bgClass: "bg-pink-soft" },
    ],
  },
  {
    id: "health",
    name: "Health & Wellness",
    emoji: "🌿",
    examples: [
      { type: "text" as const, content: "🌿 Perfect glowing health", bgClass: "bg-sage-light" },
      { type: "text" as const, content: "🧘‍♀️ Inner peace & balance", bgClass: "bg-lilac-light" },
      { type: "text" as const, content: "💪 Strong & confident body", bgClass: "bg-rose-light" },
    ],
  },
];

const boardGradients = [
  "bg-lavender-light", "bg-rose-light", "bg-gold-light",
  "bg-sage-light", "bg-pink-soft", "bg-lilac-light",
  "bg-lavender-soft",
];

const categoryCardBgs = [
  "bg-lavender-light", "bg-rose-light", "bg-gold-light",
  "bg-sage-light", "bg-pink-soft", "bg-lilac-light",
  "bg-lavender-soft",
];

const VisionBoardPage = () => {
  const { user } = useAuth();
  const [items, setItems] = useState<VisionItem[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [showExamples, setShowExamples] = useState(false);
  const [selectedExampleCat, setSelectedExampleCat] = useState<string | null>(null);
  const [newText, setNewText] = useState("");
  const [selectedBg, setSelectedBg] = useState("bg-lavender-light");
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchItems = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/vision`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
          const data = await response.json();
          setItems(data.map((item: any) => ({
            ...item,
            id: item.id.toString(),
            bgClass: item.bg_class
          })));
        }
      } catch (error) {
        console.error("Failed to fetch vision board items");
      }
    };
    fetchItems();
  }, []);

  const addTextItem = async () => {
    if (!newText.trim()) return;
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/vision`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ type: 'text', content: newText, bgClass: selectedBg })
      });
      if (response.ok) {
        const newItem = await response.json();
        setItems((prev) => [...prev, { ...newItem, id: newItem.id.toString(), bgClass: newItem.bgClass }]);
        setNewText("");
        setShowAdd(false);
        if (user?.id) {
          logUserActivity(user.id, 'VISION_BOARD_TEXT_ADDED', `User added text: "${newText.substring(0, 30)}..."`);
        }
      }
    } catch (error) {
      console.error("Failed to add vision board item");
    }
  };

  const addImageItem = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (ev) => {
      const content = ev.target?.result as string;
      const token = localStorage.getItem('token');
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/vision`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` 
          },
          body: JSON.stringify({ type: 'image', content })
        });
        if (response.ok) {
          const newItem = await response.json();
          setItems((prev) => [...prev, { ...newItem, id: newItem.id.toString() }]);
          setShowAdd(false);
          if (user?.id) {
            logUserActivity(user.id, 'VISION_BOARD_IMAGE_ADDED', 'User uploaded an image to their vision board');
          }
        }
      } catch (error) {
        console.error("Failed to upload vision board image");
      }
    };
    reader.readAsDataURL(file);
  };

  const addExampleItem = async (item: { type: "text"; content: string; bgClass: string }) => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/vision`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ type: item.type, content: item.content, bgClass: item.bgClass })
      });
      if (response.ok) {
        const newItem = await response.json();
        setItems((prev) => [...prev, { ...newItem, id: newItem.id.toString(), bgClass: newItem.bgClass }]);
        if (user?.id) {
          logUserActivity(user.id, 'VISION_BOARD_EXAMPLE_ADDED', `User added inspiration: "${item.content}"`);
        }
      }
    } catch (error) {
      console.error("Failed to add example item");
    }
  };

  const removeItem = async (id: string) => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/vision/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        setItems((prev) => prev.filter((item) => item.id !== id));
      }
    } catch (error) {
      console.error("Failed to remove vision board item");
    }
  };

  return (
    <div className="min-h-screen pb-24 bg-background relative overflow-hidden">
      {/* Dreamy background decorations */}
      <div className="fixed top-20 right-0 w-28 h-28 rounded-full bg-pink-dream/20 blur-3xl animate-drift pointer-events-none" />
      <div className="fixed bottom-40 left-0 w-20 h-20 rounded-full bg-lilac/15 blur-3xl animate-float pointer-events-none" />
      <div className="fixed top-1/2 right-8 w-3 h-3 rounded-full bg-primary/20 animate-sparkle pointer-events-none" />

      <div className="px-5 pt-14 pb-4">
        <h1 className="text-2xl font-display font-bold text-foreground">Vision Board</h1>
        <p className="text-sm text-muted-foreground font-body mt-1">
          Visualize your dream reality ✨
        </p>
      </div>

      {/* Example Categories */}
      <div className="px-5 mb-4">
        <button
          onClick={() => setShowExamples(!showExamples)}
          className="flex items-center gap-2 text-sm font-body font-medium text-primary"
        >
          <Sparkles className="w-4 h-4" />
          Browse inspiration
          <ChevronDown className={`w-4 h-4 transition-transform ${showExamples ? "rotate-180" : ""}`} />
        </button>
        
        <AnimatePresence>
          {showExamples && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-3"
            >
              {/* Category pills */}
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {visionCategories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedExampleCat(selectedExampleCat === cat.id ? null : cat.id)}
                    className={`shrink-0 px-3 py-1.5 rounded-xl text-xs font-body font-medium flex items-center gap-1.5 transition-all border ${
                      selectedExampleCat === cat.id
                        ? "bg-primary/10 border-primary/30 text-primary"
                        : "bg-muted border-border/30 text-muted-foreground"
                    }`}
                  >
                    {cat.emoji} {cat.name}
                  </button>
                ))}
              </div>

              {/* Example items */}
              <AnimatePresence>
                {selectedExampleCat && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="mt-2 space-y-2"
                  >
                    {visionCategories
                      .find((c) => c.id === selectedExampleCat)
                      ?.examples.map((ex, i) => (
                        <motion.button
                          key={i}
                          className={`w-full rounded-xl p-3 ${ex.bgClass} shadow-card border border-border/20 flex items-center justify-between`}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.05 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => addExampleItem(ex)}
                        >
                          <span className="text-sm font-body text-foreground">{ex.content}</span>
                          <Plus className="w-4 h-4 text-muted-foreground" />
                        </motion.button>
                      ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="px-5">
        <div className="grid grid-cols-2 gap-3">
          {items.map((item, i) => (
            <motion.div
              key={item.id}
              className={`relative rounded-2xl overflow-hidden shadow-dreamy border border-border/20 ${
                item.type === "text" ? (item.bgClass || boardGradients[i % boardGradients.length]) : ""
              } ${i === 0 ? "col-span-2 h-40" : "h-32"}`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.04 }}
              layout
            >
              {item.type === "image" ? (
                <img src={item.content} alt="Vision" className="w-full h-full object-cover" />
              ) : (
                <div className="flex items-center justify-center h-full p-4">
                  <p className="text-center font-display font-semibold text-foreground text-sm leading-relaxed">
                    {item.content}
                  </p>
                </div>
              )}
              <button
                onClick={() => removeItem(item.id)}
                className="absolute top-2 right-2 w-6 h-6 rounded-full bg-foreground/15 backdrop-blur-sm flex items-center justify-center"
              >
                <X className="w-3 h-3 text-foreground/60" />
              </button>
            </motion.div>
          ))}

          {/* Add Button */}
          <motion.button
            className="rounded-2xl h-32 border-2 border-dashed border-primary/20 flex flex-col items-center justify-center gap-2 bg-primary/5"
            onClick={() => setShowAdd(true)}
            whileTap={{ scale: 0.95 }}
          >
            <Plus className="w-6 h-6 text-primary/50" />
            <span className="text-xs text-primary/50 font-body">Add to Board</span>
          </motion.button>
        </div>
      </div>

      {/* Add Modal */}
      <AnimatePresence>
        {showAdd && (
          <motion.div
            className="fixed inset-0 z-50 bg-foreground/30 backdrop-blur-sm flex items-end"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowAdd(false)}
          >
            <motion.div
              className="w-full bg-card rounded-t-3xl p-6 space-y-4 shadow-dreamy"
              initial={{ y: 300 }}
              animate={{ y: 0 }}
              exit={{ y: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-10 h-1 bg-border rounded-full mx-auto" />
              <h3 className="text-lg font-display font-semibold text-foreground">Add to Vision Board</h3>

              <div className="space-y-3">
                <input
                  type="text"
                  value={newText}
                  onChange={(e) => setNewText(e.target.value)}
                  placeholder="Type a goal or dream..."
                  className="w-full px-4 py-3 rounded-xl bg-muted text-foreground font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                />

                {/* Color picker */}
                <div>
                  <p className="text-xs text-muted-foreground font-body mb-2">Background color</p>
                  <div className="flex gap-2">
                    {boardGradients.map((bg) => (
                      <button
                        key={bg}
                        onClick={() => setSelectedBg(bg)}
                        className={`w-8 h-8 rounded-lg ${bg} border-2 transition-all ${
                          selectedBg === bg ? "border-primary scale-110 shadow-sm" : "border-transparent"
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <button
                  onClick={addTextItem}
                  className="w-full py-3 rounded-xl gradient-lavender text-primary-foreground font-body font-medium text-sm shadow-pink"
                >
                  Add to Board
                </button>

                <div className="flex items-center gap-3">
                  <div className="flex-1 h-px bg-border" />
                  <span className="text-xs text-muted-foreground font-body">or</span>
                  <div className="flex-1 h-px bg-border" />
                </div>

                <button
                  onClick={() => fileRef.current?.click()}
                  className="w-full py-3 rounded-xl bg-muted text-foreground font-body font-medium text-sm flex items-center justify-center gap-2"
                >
                  <ImageIcon className="w-4 h-4" />
                  Upload Image
                </button>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={addImageItem}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default VisionBoardPage;
