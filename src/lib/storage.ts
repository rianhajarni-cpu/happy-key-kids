// Local storage keys
const STORAGE_KEYS = {
  PROGRESS: 'kids-piano-progress',
  SETTINGS: 'kids-piano-settings',
} as const;

export interface UserProgress {
  currentLevel: number;
  totalStars: number;
  completedLessons: string[];
  unlockedSongs: string[];
  achievements: string[];
  playTimeMinutes: number;
  lastPlayDate: string;
  gameScores: Record<string, number>;
}

export interface Settings {
  soundEnabled: boolean;
  animalSoundsEnabled: boolean;
  volume: number;
}

const DEFAULT_PROGRESS: UserProgress = {
  currentLevel: 1,
  totalStars: 0,
  completedLessons: [],
  unlockedSongs: ['twinkle-twinkle', 'mary-lamb', 'happy-birthday'],
  achievements: [],
  playTimeMinutes: 0,
  lastPlayDate: new Date().toISOString().split('T')[0],
  gameScores: {},
};

const DEFAULT_SETTINGS: Settings = {
  soundEnabled: true,
  animalSoundsEnabled: false,
  volume: 0.8,
};

export const getProgress = (): UserProgress => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.PROGRESS);
    if (stored) {
      return { ...DEFAULT_PROGRESS, ...JSON.parse(stored) };
    }
  } catch (e) {
    console.error('Error loading progress:', e);
  }
  return DEFAULT_PROGRESS;
};

export const saveProgress = (progress: Partial<UserProgress>): void => {
  try {
    const current = getProgress();
    const updated = { ...current, ...progress };
    localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(updated));
  } catch (e) {
    console.error('Error saving progress:', e);
  }
};

export const getSettings = (): Settings => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (stored) {
      return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) };
    }
  } catch (e) {
    console.error('Error loading settings:', e);
  }
  return DEFAULT_SETTINGS;
};

export const saveSettings = (settings: Partial<Settings>): void => {
  try {
    const current = getSettings();
    const updated = { ...current, ...settings };
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(updated));
  } catch (e) {
    console.error('Error saving settings:', e);
  }
};

export const addStars = (count: number): number => {
  const progress = getProgress();
  const newTotal = progress.totalStars + count;
  saveProgress({ totalStars: newTotal });
  return newTotal;
};

export const completeLesson = (lessonId: string, starsEarned: number): void => {
  const progress = getProgress();
  if (!progress.completedLessons.includes(lessonId)) {
    saveProgress({
      completedLessons: [...progress.completedLessons, lessonId],
      totalStars: progress.totalStars + starsEarned,
    });
  }
};

export const unlockSong = (songId: string): void => {
  const progress = getProgress();
  if (!progress.unlockedSongs.includes(songId)) {
    saveProgress({
      unlockedSongs: [...progress.unlockedSongs, songId],
    });
  }
};

export const resetProgress = (): void => {
  localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(DEFAULT_PROGRESS));
};

export const updatePlayTime = (minutes: number): void => {
  const progress = getProgress();
  const today = new Date().toISOString().split('T')[0];
  saveProgress({
    playTimeMinutes: progress.playTimeMinutes + minutes,
    lastPlayDate: today,
  });
};

export const saveGameScore = (gameId: string, score: number): void => {
  const progress = getProgress();
  const currentBest = progress.gameScores[gameId] || 0;
  if (score > currentBest) {
    saveProgress({
      gameScores: { ...progress.gameScores, [gameId]: score },
    });
  }
};
