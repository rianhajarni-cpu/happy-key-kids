import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Mascot from '@/components/ui/Mascot';
import BigButton from '@/components/ui/BigButton';
import { getProgress } from '@/lib/storage';
import { Book, Gamepad2, Piano, Music, Settings, Star } from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();
  const progress = getProgress();

  const menuItems = [
    { label: 'Learn', icon: <Book className="w-7 h-7" />, path: '/learn', variant: 'primary' as const },
    { label: 'Play Games', icon: <Gamepad2 className="w-7 h-7" />, path: '/games', variant: 'fun' as const },
    { label: 'Free Play', icon: <Piano className="w-7 h-7" />, path: '/free-play', variant: 'secondary' as const },
    { label: 'Songs', icon: <Music className="w-7 h-7" />, path: '/songs', variant: 'accent' as const },
  ];

  return (
    <div className="min-h-screen bg-gradient-sky safe-top safe-bottom">
      <div className="container max-w-md mx-auto px-4 py-6">
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
            <Star className="w-6 h-6 star-filled fill-star" />
            <span className="font-bold text-lg">{progress.totalStars}</span>
          </motion.div>
          
          <motion.button
            className="p-3 bg-card rounded-full shadow-soft"
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/parent')}
          >
            <Settings className="w-6 h-6 text-muted-foreground" />
          </motion.button>
        </motion.div>

        {/* Mascot & Title */}
        <motion.div 
          className="flex flex-col items-center mb-8"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Mascot emotion="happy" size="lg" />
          <motion.h1 
            className="text-3xl font-black text-center mt-4 bg-gradient-primary bg-clip-text text-transparent"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Kids Piano
          </motion.h1>
          <motion.p 
            className="text-muted-foreground font-semibold"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Learn by playing! 🎵
          </motion.p>
        </motion.div>

        {/* Level indicator */}
        <motion.div 
          className="bg-card rounded-2xl p-4 mb-6 shadow-card text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <p className="text-sm text-muted-foreground">Your Level</p>
          <p className="text-4xl font-black text-primary">{progress.currentLevel}</p>
        </motion.div>

        {/* Menu Buttons */}
        <motion.div 
          className="space-y-4"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1,
                delayChildren: 0.5,
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
              >
                {item.label}
              </BigButton>
            </motion.div>
          ))}
        </motion.div>

        {/* Floating decorations */}
        <div className="fixed bottom-0 left-0 right-0 h-20 pointer-events-none overflow-hidden">
          <motion.div
            className="absolute bottom-4 left-4 text-4xl"
            animate={{ y: [0, -10, 0], rotate: [-5, 5, -5] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            🎹
          </motion.div>
          <motion.div
            className="absolute bottom-8 right-8 text-3xl"
            animate={{ y: [0, -15, 0], rotate: [5, -5, 5] }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            🎶
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Home;
