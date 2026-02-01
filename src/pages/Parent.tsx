import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, RotateCcw, Clock, Trophy, Star, BarChart3 } from 'lucide-react';
import BigButton from '@/components/ui/BigButton';
import ProgressBar from '@/components/ui/ProgressBar';
import { getProgress, resetProgress } from '@/lib/storage';
import { useState } from 'react';

const Parent = () => {
  const navigate = useNavigate();
  const progress = getProgress();
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const handleReset = () => {
    resetProgress();
    setShowResetConfirm(false);
    window.location.reload();
  };

  const stats = [
    {
      icon: <Star className="w-6 h-6 star-filled fill-star" />,
      label: 'Total Stars',
      value: progress.totalStars,
    },
    {
      icon: <Trophy className="w-6 h-6 text-accent" />,
      label: 'Current Level',
      value: progress.currentLevel,
    },
    {
      icon: <Clock className="w-6 h-6 text-secondary" />,
      label: 'Play Time',
      value: `${progress.playTimeMinutes} min`,
    },
    {
      icon: <BarChart3 className="w-6 h-6 text-primary" />,
      label: 'Lessons Done',
      value: progress.completedLessons.length,
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

          <h1 className="text-2xl font-bold">Parent Dashboard</h1>
        </motion.div>

        {/* Stats Grid */}
        <motion.div 
          className="grid grid-cols-2 gap-4 mb-6"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.1 },
            },
          }}
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              className="bg-card rounded-3xl p-5 shadow-card text-center"
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
            >
              <div className="flex justify-center mb-2">{stat.icon}</div>
              <p className="text-2xl font-black">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Progress Section */}
        <motion.div 
          className="bg-card rounded-3xl p-6 shadow-card mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="font-bold text-lg mb-4">Learning Progress</h2>
          
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Level Progress</span>
                <span>{progress.currentLevel} / 10</span>
              </div>
              <ProgressBar 
                value={progress.currentLevel} 
                max={10} 
                color="primary" 
              />
            </div>

            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Lessons Completed</span>
                <span>{progress.completedLessons.length} / 10</span>
              </div>
              <ProgressBar 
                value={progress.completedLessons.length} 
                max={10} 
                color="success" 
              />
            </div>

            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Songs Unlocked</span>
                <span>{progress.unlockedSongs.length} / 5</span>
              </div>
              <ProgressBar 
                value={progress.unlockedSongs.length} 
                max={5} 
                color="accent" 
              />
            </div>
          </div>
        </motion.div>

        {/* Game Scores */}
        <motion.div 
          className="bg-card rounded-3xl p-6 shadow-card mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="font-bold text-lg mb-4">Game High Scores</h2>
          
          <div className="space-y-3">
            {Object.entries(progress.gameScores).length === 0 ? (
              <p className="text-muted-foreground text-center py-4">
                No games played yet!
              </p>
            ) : (
              Object.entries(progress.gameScores).map(([game, score]) => (
                <div 
                  key={game}
                  className="flex justify-between items-center bg-muted rounded-2xl px-4 py-3"
                >
                  <span className="capitalize">{game.replace('-', ' ')}</span>
                  <span className="font-bold">{score} pts</span>
                </div>
              ))
            )}
          </div>
        </motion.div>

        {/* Reset Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          {!showResetConfirm ? (
            <BigButton 
              variant="secondary" 
              icon={<RotateCcw />}
              onClick={() => setShowResetConfirm(true)}
            >
              Reset All Progress
            </BigButton>
          ) : (
            <motion.div 
              className="bg-destructive/10 rounded-3xl p-6 text-center"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
            >
              <p className="font-bold text-destructive mb-4">
                Are you sure? This will delete all progress!
              </p>
              <div className="flex gap-3">
                <BigButton 
                  variant="secondary"
                  onClick={() => setShowResetConfirm(false)}
                  className="flex-1"
                >
                  Cancel
                </BigButton>
                <BigButton 
                  variant="primary"
                  onClick={handleReset}
                  className="flex-1 !bg-destructive"
                >
                  Reset
                </BigButton>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* App Info */}
        <motion.div 
          className="mt-8 text-center text-muted-foreground text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <p>Kids Piano Trainer v1.0</p>
          <p>Made with ❤️ for little musicians</p>
        </motion.div>
      </div>
    </div>
  );
};

export default Parent;
