
export interface DailyContent {
  affirmation: string;
  imageUrl: string;
  lastUpdated: string;
}

const CACHE_KEY = 'assume_daily_content';

const DEFAULT_IMAGES = [
  'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1501862700950-18e48223c21c?auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1534067783941-51c9c23ecefd?auto=format&fit=crop&q=80',
];

const SEARCH_COLLECTIONS = ['1052192', '3671521']; // Aesthetic & Manifestation curated collections

export const getDailyContent = async (): Promise<DailyContent> => {
  const cached = localStorage.getItem(CACHE_KEY);
  const today = new Date().toISOString().split('T')[0];

  if (cached) {
    const parsed = JSON.parse(cached) as DailyContent;
    if (parsed.lastUpdated === today) {
      return parsed;
    }
  }

  try {
    // Fetch random affirmation from the daily quote API found on GitHub
    const affResponse = await fetch('https://adrijan-petek.github.io/daily-quotes-api/api/daily.json');
    const affData = await affResponse.json();
    const affirmation = affData.quote.quote;

    // Fetch random high-quality image from curated Unsplash collections
    const collectionId = SEARCH_COLLECTIONS[Math.floor(Math.random() * SEARCH_COLLECTIONS.length)];
    const imageUrl = `https://source.unsplash.com/collection/${collectionId}/1600x900`;

    const newContent: DailyContent = {
      affirmation,
      imageUrl,
      lastUpdated: today
    };

    localStorage.setItem(CACHE_KEY, JSON.stringify(newContent));
    return newContent;
  } catch (error) {
    console.error('Error fetching daily content:', error);
    // Fallback to affirmations.dev if daily quotes fails
    try {
      const fallbackAffRes = await fetch('https://affirmations.dev');
      const fallbackAffData = await fallbackAffRes.json();
      return {
        affirmation: fallbackAffData.affirmation,
        imageUrl: DEFAULT_IMAGES[Math.floor(Math.random() * DEFAULT_IMAGES.length)],
        lastUpdated: today
      };
    } catch {
      return {
        affirmation: "Everything is working out for your highest good.",
        imageUrl: DEFAULT_IMAGES[Math.floor(Math.random() * DEFAULT_IMAGES.length)],
        lastUpdated: today
      };
    }
  }
};
