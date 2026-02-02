import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCcw } from 'lucide-react';
import { useLocation } from 'react-router-dom';

// Routes that allow portrait mode
const PORTRAIT_ALLOWED_ROUTES = ['/', '/home', '/parent'];

const OrientationPrompt = () => {
  const [isPortrait, setIsPortrait] = useState(false);
  const location = useLocation();

  // Check if current route allows portrait mode
  const allowsPortrait = PORTRAIT_ALLOWED_ROUTES.includes(location.pathname);

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

  // Don't show if portrait is allowed on this route or if already in landscape
  if (allowsPortrait || !isPortrait) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[100] bg-gradient-sky flex flex-col items-center justify-center p-6"
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
            Landscape Mode Required
          </h2>
          
          <p className="text-muted-foreground mb-4">
            This app works <strong>only in landscape mode</strong> for the best piano playing experience!
          </p>

          <div className="bg-accent/20 rounded-2xl p-4 mb-4">
            <p className="text-sm font-semibold text-accent-foreground">
              📱 Please rotate your device sideways to continue
            </p>
          </div>

          <div className="flex justify-center gap-2 text-2xl">
            <motion.span
              animate={{ x: [0, 10, 0] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              📱
            </motion.span>
            <span>➡️</span>
            <motion.span
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              🖥️
            </motion.span>
          </div>
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
        <motion.div
          className="absolute top-20 right-20 text-2xl"
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
        >
          🎶
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default OrientationPrompt;
