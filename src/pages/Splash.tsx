import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Mascot from '@/components/ui/Mascot';
import { resumeAudioContext } from '@/lib/audio';

const Splash = () => {
  const navigate = useNavigate();
  const [showStart, setShowStart] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowStart(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleStart = async () => {
    await resumeAudioContext();
    navigate('/home');
  };

  return (
    <motion.div 
      className="min-h-screen bg-gradient-sky flex flex-col items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Floating decorations */}
      <motion.div
        className="absolute top-20 left-10 text-4xl"
        animate={{ y: [0, -20, 0], rotate: [-10, 10, -10] }}
        transition={{ duration: 3, repeat: Infinity }}
      >
        🎵
      </motion.div>
      <motion.div
        className="absolute top-32 right-12 text-3xl"
        animate={{ y: [0, -15, 0], rotate: [10, -10, 10] }}
        transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
      >
        🎶
      </motion.div>
      <motion.div
        className="absolute bottom-40 left-16 text-3xl"
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 2, repeat: Infinity, delay: 1 }}
      >
        ✨
      </motion.div>
      <motion.div
        className="absolute bottom-32 right-10 text-4xl"
        animate={{ scale: [1, 1.2, 1], rotate: [0, 5, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        🎹
      </motion.div>

      {/* Main content */}
      <motion.div 
        className="flex flex-col items-center"
        initial={{ scale: 0.8, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ delay: 0.2, type: 'spring' }}
      >
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <Mascot emotion="excited" size="lg" />
        </motion.div>

        <motion.h1 
          className="text-4xl font-black text-center mt-6 bg-gradient-primary bg-clip-text text-transparent"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          Kids Piano
        </motion.h1>

        <motion.p 
          className="text-lg text-muted-foreground font-semibold mt-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          Learn by playing! 🎵
        </motion.p>
      </motion.div>

      {/* Start button */}
      <AnimatePresence>
        {showStart && (
          <motion.button
            className="mt-12 bg-gradient-primary text-primary-foreground px-12 py-5 rounded-full text-xl font-bold shadow-button"
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleStart}
          >
            <motion.span
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              Let's Play! 🎹
            </motion.span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Loading dots before button appears */}
      {!showStart && (
        <motion.div 
          className="mt-12 flex gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-3 h-3 rounded-full bg-primary"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.15 }}
            />
          ))}
        </motion.div>
      )}
    </motion.div>
  );
};

export default Splash;
