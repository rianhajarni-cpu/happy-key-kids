import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Mascot from '@/components/ui/Mascot';
import BigButton from '@/components/ui/BigButton';
import { getProgress } from '@/lib/storage';
import { Book, Gamepad2, Piano, Music, Settings, Star } from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();
  const progress = getProgress();
  const [isLandscape, setIsLandscape] = useState(false);

  useEffect(() => {
    const checkOrientation = () => {
      setIsLandscape(window.innerWidth > window.innerHeight);
    };
    checkOrientation();
    window.addEventListener('resize', checkOrientation);
    return () => window.removeEventListener('resize', checkOrientation);
  }, []);

  const menuItems = [
    { label: 'Learn', icon: <Book className="w-6 h-6" />, path: '/learn', variant: 'primary' as const },
    { label: 'Play Games', icon: <Gamepad2 className="w-6 h-6" />, path: '/games', variant: 'fun' as const },
    { label: 'Free Play', icon: <Piano className="w-6 h-6" />, path: '/free-play', variant: 'secondary' as const },
    { label: 'Songs', icon: <Music className="w-6 h-6" />, path: '/songs', variant: 'accent' as const },
  ];

  return (
    <div className="h-screen max-h-screen overflow-auto bg-gradient-sky">
      <div className={`container mx-auto px-4 ${isLandscape ? 'max-w-4xl py-3' : 'max-w-md py-6'}`}>
        {/* Header with Stars */}
        <motion.div 
          className="flex items-center justify-between mb-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <motion.div 
            className="flex items-center gap-2 bg-card rounded-full px-4 py-2 shadow-soft"
            whileHover={{ scale: 1.05 }}
          >
            <Star className="w-5 h-5 star-filled fill-star" />
            <span className="font-bold">{progress.totalStars}</span>
          </motion.div>
          
          <motion.button
            className="p-2 bg-card rounded-full shadow-soft"
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/parent')}
          >
            <Settings className="w-5 h-5 text-muted-foreground" />
          </motion.button>
        </motion.div>

        {/* Content - Horizontal layout for landscape */}
        <div className={`${isLandscape ? 'flex items-center gap-8' : ''}`}>
          {/* Mascot & Title */}
          <motion.div 
            className={`flex flex-col items-center ${isLandscape ? 'w-48 shrink-0' : 'mb-6'}`}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Mascot emotion="happy" size={isLandscape ? 'md' : 'lg'} />
            <motion.h1 
              className={`font-black text-center mt-3 bg-gradient-primary bg-clip-text text-transparent ${isLandscape ? 'text-2xl' : 'text-3xl'}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              Kids Piano
            </motion.h1>
            <motion.p 
              className="text-muted-foreground font-semibold text-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              Learn by playing! 🎵
            </motion.p>

            {/* Level indicator */}
            <motion.div 
              className="bg-card rounded-xl px-4 py-2 mt-3 shadow-card text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <p className="text-xs text-muted-foreground">Level</p>
              <p className="text-2xl font-black text-primary">{progress.currentLevel}</p>
            </motion.div>
          </motion.div>

          {/* Menu Buttons */}
          <motion.div 
            className={`${isLandscape ? 'flex-1 grid grid-cols-2 gap-3' : 'space-y-3'}`}
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.1,
                  delayChildren: isLandscape ? 0.2 : 0.5,
                },
              },
            }}
          >
            {menuItems.map((item) => (
              <motion.div
                key={item.path}
                variants={{
                  hidden: { opacity: 0, x: -30 },
                  visible: { opacity: 1, x: 0 },
                }}
              >
                <BigButton
                  variant={item.variant}
                  icon={item.icon}
                  onClick={() => navigate(item.path)}
                  className={isLandscape ? 'py-4' : ''}
                >
                  {item.label}
                </BigButton>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Floating decorations */}
        {!isLandscape && (
          <div className="fixed bottom-0 left-0 right-0 h-20 pointer-events-none overflow-hidden">
            <motion.div
              className="absolute bottom-4 left-4 text-3xl"
              animate={{ y: [0, -10, 0], rotate: [-5, 5, -5] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              🎹
            </motion.div>
            <motion.div
              className="absolute bottom-8 right-8 text-2xl"
              animate={{ y: [0, -15, 0], rotate: [5, -5, 5] }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              🎶
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
