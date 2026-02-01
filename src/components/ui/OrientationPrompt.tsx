import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCcw } from 'lucide-react';

const OrientationPrompt = () => {
  const [isPortrait, setIsPortrait] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const checkOrientation = () => {
      // Check if on mobile/tablet
      const isMobile = window.innerWidth <= 1024;
      const isPortraitMode = window.innerHeight > window.innerWidth;
      setIsPortrait(isMobile && isPortraitMode);
    };

    checkOrientation();
    window.addEventListener('resize', checkOrientation);
    window.addEventListener('orientationchange', checkOrientation);

    return () => {
      window.removeEventListener('resize', checkOrientation);
      window.removeEventListener('orientationchange', checkOrientation);
    };
  }, []);

  // Reset dismissed state when orientation changes
  useEffect(() => {
    if (!isPortrait) {
      setDismissed(false);
    }
  }, [isPortrait]);

  if (!isPortrait || dismissed) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 bg-gradient-sky flex flex-col items-center justify-center p-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="bg-card rounded-3xl p-8 shadow-card text-center max-w-sm"
          initial={{ scale: 0.8, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          transition={{ type: 'spring', damping: 15 }}
        >
          {/* Rotating phone animation */}
          <motion.div 
            className="mb-6 flex justify-center"
            animate={{ rotate: [0, -90, -90, 0] }}
            transition={{ 
              duration: 2, 
              repeat: Infinity, 
              repeatDelay: 1,
              times: [0, 0.3, 0.7, 1]
            }}
          >
            <div className="relative">
              <div className="w-16 h-28 bg-foreground/20 rounded-2xl border-4 border-foreground/30 flex items-center justify-center">
                <div className="w-10 h-20 bg-gradient-primary rounded-lg" />
              </div>
              <motion.div
                className="absolute -right-8 top-1/2 -translate-y-1/2"
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 0.5, repeat: Infinity }}
              >
                <RotateCcw className="w-6 h-6 text-primary" />
              </motion.div>
            </div>
          </motion.div>

          <motion.div
            className="text-5xl mb-4"
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            🎹
          </motion.div>

          <h2 className="text-2xl font-black text-primary mb-2">
            Rotate Your Device!
          </h2>
          
          <p className="text-muted-foreground mb-6">
            For the best piano experience, please turn your device to <strong>landscape mode</strong> (sideways) 📱➡️🖥️
          </p>

          <motion.button
            className="bg-muted text-muted-foreground px-6 py-3 rounded-2xl font-semibold"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setDismissed(true)}
          >
            Continue Anyway
          </motion.button>
        </motion.div>

        {/* Decorative elements */}
        <motion.div
          className="absolute top-10 left-10 text-3xl"
          animate={{ y: [0, -10, 0], rotate: [-10, 10, -10] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          🎵
        </motion.div>
        <motion.div
          className="absolute bottom-10 right-10 text-3xl"
          animate={{ y: [0, -15, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
        >
          ✨
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default OrientationPrompt;
