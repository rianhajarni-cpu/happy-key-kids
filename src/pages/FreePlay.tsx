import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Piano from '@/components/piano/Piano';
import Mascot from '@/components/ui/Mascot';
import { ArrowLeft, Volume2, VolumeX, Cat, Home } from 'lucide-react';
import { getSettings, saveSettings } from '@/lib/storage';
import { getAnimalEmoji } from '@/lib/audio';

const FreePlay = () => {
  const navigate = useNavigate();
  const [settings, setSettings] = useState(getSettings());
  const [lastNote, setLastNote] = useState<string | null>(null);
  const [animalEmoji, setAnimalEmoji] = useState<string | null>(null);
  const [isLandscape, setIsLandscape] = useState(false);

  useEffect(() => {
    const checkOrientation = () => {
      setIsLandscape(window.innerWidth > window.innerHeight);
    };
    checkOrientation();
    window.addEventListener('resize', checkOrientation);
    return () => window.removeEventListener('resize', checkOrientation);
  }, []);

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
    <div className="h-screen max-h-screen overflow-hidden bg-gradient-sky flex flex-col">
      {/* Compact Header */}
      <motion.div 
        className={`flex items-center justify-between ${isLandscape ? 'px-4 py-2' : 'p-4'}`}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-2">
          <motion.button
            className="p-2 bg-card rounded-full shadow-soft"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/home')}
          >
            <Home className="w-5 h-5" />
          </motion.button>
          {!isLandscape && <h1 className="text-lg font-bold">Free Play</h1>}
        </div>

        <div className="flex gap-2">
          <motion.button
            className={`p-2 rounded-full shadow-soft ${
              settings.animalSoundsEnabled ? 'bg-accent' : 'bg-card'
            }`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleAnimalSounds}
          >
            <Cat className="w-5 h-5" />
          </motion.button>
          <motion.button
            className="p-2 bg-card rounded-full shadow-soft"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleSound}
          >
            {settings.soundEnabled ? (
              <Volume2 className="w-5 h-5" />
            ) : (
              <VolumeX className="w-5 h-5" />
            )}
          </motion.button>
        </div>
      </motion.div>

      {/* Main content - Responsive for landscape */}
      <div className={`flex-1 flex ${isLandscape ? 'flex-row items-center px-4 gap-4' : 'flex-col items-center justify-center px-4'}`}>
        {/* Mascot area */}
        <motion.div 
          className={`flex flex-col items-center ${isLandscape ? 'w-32' : 'mb-4'}`}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <Mascot emotion={lastNote ? 'excited' : 'happy'} size={isLandscape ? 'sm' : 'md'} />
          
          <AnimatePresence>
            {animalEmoji && (
              <motion.div
                className="text-xl font-bold mt-2 bg-card rounded-xl px-3 py-1 shadow-card"
                initial={{ opacity: 0, scale: 0.5, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.5, y: -20 }}
              >
                {animalEmoji}
              </motion.div>
            )}
          </AnimatePresence>

          {!animalEmoji && !isLandscape && (
            <motion.p 
              className="mt-2 text-muted-foreground font-semibold text-center text-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              Tap the keys! 🎵
            </motion.p>
          )}
        </motion.div>

        {/* Piano - Full width in landscape */}
        <motion.div 
          className={`${isLandscape ? 'flex-1 max-w-4xl' : 'w-full'}`}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Piano 
            onKeyPress={handleKeyPress}
            colorfulKeys={true}
            size={isLandscape ? 'large' : 'medium'}
          />
        </motion.div>
      </div>

      {/* Visual effects when playing */}
      <AnimatePresence>
        {lastNote && (
          <motion.div
            className="fixed top-1/3 left-1/2 transform -translate-x-1/2 text-4xl pointer-events-none"
            initial={{ opacity: 1, scale: 0.5, y: 0 }}
            animate={{ opacity: 0, scale: 2, y: -50 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            key={lastNote + Date.now()}
          >
            ✨
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FreePlay;
