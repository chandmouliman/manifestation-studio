
export interface DailyProgress {
  mood: string | null;
  energy: string | null;
  checklist: boolean[];
  date: string; // ISO date string (YYYY-MM-DD)
}

const STREAK_KEY = "assume_manifestation_streak";
const PROGRESS_KEY = "assume_daily_progress";
const LAST_COMPLETED_DATE_KEY = "assume_last_completed_date";

export const getStreak = (): number => {
  const saved = localStorage.getItem(STREAK_KEY);
  return saved ? parseInt(saved, 10) : 0;
};

export const getDailyProgress = (): DailyProgress => {
  const today = new Date().toISOString().split('T')[0];
  const saved = localStorage.getItem(PROGRESS_KEY);
  
  if (saved) {
    const parsed = JSON.parse(saved) as DailyProgress;
    if (parsed.date === today) {
      return parsed;
    }
  }
  
  return { mood: null, energy: null, checklist: [false, false, false, false], date: today };
};

export const saveDailyProgress = (progress: DailyProgress) => {
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
  
  // Check if all tasks are complete
  const moodDone = progress.mood !== null;
  const energyDone = progress.energy !== null;
  const checklistDone = progress.checklist.every(Boolean);

  if (moodDone && energyDone && checklistDone) {
    handleStreakIncrement(progress.date);
  }
};

const handleStreakIncrement = (date: string) => {
  const lastCompleted = localStorage.getItem(LAST_COMPLETED_DATE_KEY);
  if (lastCompleted === date) return; // Already incremented today

  const currentStreak = getStreak();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];

  let newStreak = currentStreak;
  if (lastCompleted === yesterdayStr) {
    newStreak += 1;
  } else if (!lastCompleted) {
    newStreak = 1;
  } else {
    // Streak was broken, logic could be to reset or keep it? 
    // User requested "unlimited days", usually implies keeping it or resetting.
    // Standard streak logic: if not yesterday, reset to 1.
    newStreak = 1;
  }

  localStorage.setItem(STREAK_KEY, newStreak.toString());
  localStorage.setItem(LAST_COMPLETED_DATE_KEY, date);
};

export const checkAndResetStreak = () => {
  const lastCompleted = localStorage.getItem(LAST_COMPLETED_DATE_KEY);
  if (!lastCompleted) return;

  const today = new Date().toISOString().split('T')[0];
  if (lastCompleted === today) return;

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];

  if (lastCompleted !== yesterdayStr) {
    // Streak broken
    // localStorage.setItem(STREAK_KEY, "0"); // Optional: reset to 0 if broken
  }
};
