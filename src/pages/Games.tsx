import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Target, Music, Timer } from 'lucide-react';
import BigButton from '@/components/ui/BigButton';

const Games = () => {
  const navigate = useNavigate();

  const games = [
    {
      id: 'note-catcher',
      title: 'Note Catcher',
      description: 'Tap the glowing key!',
      icon: <Target className="w-10 h-10" />,
      color: 'bg-game-red',
      path: '/games/note-catcher',
    },
    {
      id: 'melody-copy',
      title: 'Melody Copy',
      description: 'Repeat the melody!',
      icon: <Music className="w-10 h-10" />,
      color: 'bg-game-blue',
      path: '/games/melody-copy',
    },
    {
      id: 'rhythm-tap',
      title: 'Rhythm Tap',
      description: 'Tap in rhythm!',
      icon: <Timer className="w-10 h-10" />,
      color: 'bg-game-green',
      path: '/games/rhythm-tap',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-sky safe-top safe-bottom">
      <div className="container max-w-md mx-auto px-4 py-6">
        {/* Header */}
        <motion.div 
          className="flex items-center gap-4 mb-6"
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

          <h1 className="text-2xl font-bold">Play Games</h1>
        </motion.div>

        {/* Game Cards */}
        <motion.div 
          className="grid grid-cols-1 gap-4"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.15 },
            },
          }}
        >
          {games.map((game) => (
            <motion.div
              key={game.id}
              variants={{
                hidden: { opacity: 0, y: 20, scale: 0.9 },
                visible: { opacity: 1, y: 0, scale: 1 },
              }}
            >
              <motion.button
                className={`w-full ${game.color} rounded-3xl p-6 shadow-card text-left`}
                whileHover={{ scale: 1.03, y: -3 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate(game.path)}
              >
                <div className="flex items-center gap-4">
                  <motion.div 
                    className="bg-white/30 rounded-2xl p-3"
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    {game.icon}
                  </motion.div>
                  <div>
                    <h3 className="font-bold text-xl text-foreground/90">{game.title}</h3>
                    <p className="text-foreground/70">{game.description}</p>
                  </div>
                </div>
              </motion.button>
            </motion.div>
          ))}
        </motion.div>

        {/* Fun decoration */}
        <motion.div 
          className="mt-12 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <motion.div
            className="text-6xl"
            animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            🎮
          </motion.div>
          <p className="text-muted-foreground mt-2 font-semibold">Have fun playing!</p>
        </motion.div>
      </div>
    </div>
  );
};

export default Games;
