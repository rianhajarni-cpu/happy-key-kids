import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Piano from '@/components/piano/Piano';
import Mascot from '@/components/ui/Mascot';
import { ArrowLeft, Volume2, VolumeX, Cat } from 'lucide-react';
import { getSettings, saveSettings } from '@/lib/storage';
import { getAnimalEmoji } from '@/lib/audio';

const FreePlay = () => {
  const navigate = useNavigate();
  const [settings, setSettings] = useState(getSettings());
  const [lastNote, setLastNote] = useState<string | null>(null);
  const [animalEmoji, setAnimalEmoji] = useState<string | null>(null);

  const handleKeyPress = (note: string) => {
    setLastNote(note);
    if (settings.animalSoundsEnabled) {
      setAnimalEmoji(getAnimalEmoji(note));
      setTimeout(() => setAnimalEmoji(null), 800);
    }
  };

  const toggleSound = () => {
    const newSettings = { ...settings, soundEnabled: !settings.soundEnabled };
    setSettings(newSettings);
    saveSettings(newSettings);
  };

  const toggleAnimalSounds = () => {
    const newSettings = { ...settings, animalSoundsEnabled: !settings.animalSoundsEnabled };
    setSettings(newSettings);
    saveSettings(newSettings);
  };

  return (
    <div className="min-h-screen bg-gradient-sky flex flex-col safe-top safe-bottom">
      {/* Header */}
      <motion.div 
        className="flex items-center justify-between p-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <motion.button
          className="p-3 bg-card rounded-full shadow-soft"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/')}
        >
          <ArrowLeft className="w-6 h-6" />
        </motion.button>

        <h1 className="text-xl font-bold">Free Play</h1>

        <div className="flex gap-2">
          <motion.button
            className={`p-3 rounded-full shadow-soft ${
              settings.animalSoundsEnabled ? 'bg-accent' : 'bg-card'
            }`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleAnimalSounds}
          >
            <Cat className="w-6 h-6" />
          </motion.button>
          <motion.button
            className="p-3 bg-card rounded-full shadow-soft"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleSound}
          >
            {settings.soundEnabled ? (
              <Volume2 className="w-6 h-6" />
            ) : (
              <VolumeX className="w-6 h-6" />
            )}
          </motion.button>
        </div>
      </motion.div>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center px-4">
        {/* Mascot area */}
        <motion.div 
          className="flex flex-col items-center mb-8"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <Mascot emotion={lastNote ? 'excited' : 'happy'} size="lg" />
          
          <AnimatePresence>
            {animalEmoji && (
              <motion.div
                className="text-3xl font-bold mt-4 bg-card rounded-2xl px-6 py-3 shadow-card"
                initial={{ opacity: 0, scale: 0.5, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.5, y: -20 }}
              >
                {animalEmoji}
              </motion.div>
            )}
          </AnimatePresence>

          {!animalEmoji && (
            <motion.p 
              className="mt-4 text-muted-foreground font-semibold text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              Tap the keys to play! 🎵
            </motion.p>
          )}
        </motion.div>

        {/* Visual effects when playing */}
        <AnimatePresence>
          {lastNote && (
            <motion.div
              className="absolute top-1/3 left-1/2 transform -translate-x-1/2 text-6xl pointer-events-none"
              initial={{ opacity: 1, scale: 0.5, y: 0 }}
              animate={{ opacity: 0, scale: 2, y: -100 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
              key={lastNote + Date.now()}
            >
              ✨
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Piano at bottom */}
      <motion.div 
        className="px-2 pb-4"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Piano 
          onKeyPress={handleKeyPress}
          colorfulKeys={true}
          size="large"
        />
      </motion.div>
    </div>
  );
};

export default FreePlay;
