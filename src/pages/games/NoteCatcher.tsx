import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Piano from '@/components/piano/Piano';
import Mascot from '@/components/ui/Mascot';
import StarRating from '@/components/ui/StarRating';
import BigButton from '@/components/ui/BigButton';
import { ArrowLeft, Play, RotateCcw } from 'lucide-react';
import { playNote, playSuccessSound, playFailSound, playStarSound } from '@/lib/audio';
import { saveGameScore, getProgress } from '@/lib/storage';

const NOTES = ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4', 'C5'];
const GAME_DURATION = 30; // seconds
const ROUNDS = 10;

const NoteCatcher = () => {
  const navigate = useNavigate();
  const [gameState, setGameState] = useState<'ready' | 'playing' | 'finished'>('ready');
  const [score, setScore] = useState(0);
  const [currentRound, setCurrentRound] = useState(0);
  const [targetNote, setTargetNote] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [combo, setCombo] = useState(0);
  const [showFeedback, setShowFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [earnedStars, setEarnedStars] = useState(0);

  const generateNewTarget = useCallback(() => {
    const randomNote = NOTES[Math.floor(Math.random() * NOTES.length)];
    setTargetNote(randomNote);
  }, []);

  const startGame = () => {
    setGameState('playing');
    setScore(0);
    setCombo(0);
    setCurrentRound(0);
    setTimeLeft(GAME_DURATION);
    generateNewTarget();
  };

  const endGame = useCallback(() => {
    setGameState('finished');
    setTargetNote(null);
    
    // Calculate stars
    const maxScore = ROUNDS * 100 + (ROUNDS * 10); // base + combo bonus
    const percentage = score / maxScore;
    const stars = percentage >= 0.8 ? 3 : percentage >= 0.5 ? 2 : percentage >= 0.2 ? 1 : 0;
    setEarnedStars(stars);
    
    if (stars > 0) {
      playStarSound();
    }
    
    saveGameScore('note-catcher', score);
  }, [score]);

  useEffect(() => {
    if (gameState !== 'playing') return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          endGame();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState, endGame]);

  useEffect(() => {
    if (currentRound >= ROUNDS && gameState === 'playing') {
      endGame();
    }
  }, [currentRound, gameState, endGame]);

  const handleKeyPress = (note: string) => {
    if (gameState !== 'playing' || !targetNote) return;

    if (note === targetNote) {
      // Correct!
      const comboBonus = Math.min(combo * 10, 50);
      setScore(prev => prev + 100 + comboBonus);
      setCombo(prev => prev + 1);
      setShowFeedback('correct');
      playSuccessSound();
      
      setCurrentRound(prev => prev + 1);
      
      if (currentRound + 1 < ROUNDS) {
        setTimeout(() => {
          generateNewTarget();
          setShowFeedback(null);
        }, 300);
      }
    } else {
      // Wrong
      setCombo(0);
      setShowFeedback('wrong');
      playFailSound();
      setTimeout(() => setShowFeedback(null), 300);
    }
  };

  // Ready screen
  if (gameState === 'ready') {
    return (
      <div className="min-h-screen bg-gradient-sky flex flex-col items-center justify-center p-4 safe-top safe-bottom">
        <motion.div 
          className="bg-card rounded-3xl p-8 shadow-card text-center max-w-sm w-full"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
        >
          <motion.button
            className="absolute top-4 left-4 p-3 bg-muted rounded-full"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/games')}
          >
            <ArrowLeft className="w-6 h-6" />
          </motion.button>

          <motion.div
            animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-6xl mb-4"
          >
            🎯
          </motion.div>
          
          <h1 className="text-2xl font-black text-primary mb-2">Note Catcher</h1>
          <p className="text-muted-foreground mb-6">
            Tap the glowing key as fast as you can!
          </p>

          <div className="bg-muted rounded-2xl p-4 mb-6 text-left">
            <p className="font-semibold">How to play:</p>
            <ul className="text-sm text-muted-foreground mt-2 space-y-1">
              <li>• Watch for the glowing key</li>
              <li>• Tap it quickly!</li>
              <li>• Build combos for bonus points</li>
            </ul>
          </div>

          <BigButton variant="primary" icon={<Play />} onClick={startGame}>
            Start Game
          </BigButton>
        </motion.div>
      </div>
    );
  }

  // Finished screen
  if (gameState === 'finished') {
    const progress = getProgress();
    const highScore = progress.gameScores['note-catcher'] || 0;

    return (
      <div className="min-h-screen bg-gradient-sky flex flex-col items-center justify-center p-4 safe-top safe-bottom">
        <motion.div 
          className="bg-card rounded-3xl p-8 shadow-card text-center max-w-sm w-full"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
        >
          <Mascot emotion={earnedStars >= 2 ? 'excited' : 'happy'} size="md" />
          
          <motion.h2 
            className="text-2xl font-black mt-4 text-primary"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {earnedStars >= 2 ? 'Amazing! 🎉' : 'Good Try! 👏'}
          </motion.h2>

          <motion.div 
            className="mt-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <p className="text-4xl font-black text-accent-foreground">{score}</p>
            <p className="text-muted-foreground">points</p>
          </motion.div>

          <motion.div 
            className="mt-4 flex justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <StarRating rating={earnedStars} size="lg" />
          </motion.div>

          {score >= highScore && score > 0 && (
            <motion.p 
              className="mt-2 text-success font-bold"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.7, type: 'spring' }}
            >
              🏆 New High Score!
            </motion.p>
          )}

          <motion.div 
            className="mt-6 space-y-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <BigButton variant="primary" icon={<RotateCcw />} onClick={startGame}>
              Play Again
            </BigButton>
            <BigButton variant="secondary" onClick={() => navigate('/games')}>
              Back to Games
            </BigButton>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  // Playing screen
  return (
    <div className="min-h-screen bg-gradient-sky flex flex-col safe-top safe-bottom">
      {/* Header */}
      <motion.div 
        className="flex items-center justify-between p-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-2">
          <span className="text-2xl font-black text-primary">{score}</span>
          {combo > 1 && (
            <motion.span 
              className="bg-accent px-2 py-1 rounded-full text-sm font-bold"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              key={combo}
            >
              x{combo}
            </motion.span>
          )}
        </div>

        <div className="bg-card rounded-full px-4 py-2 shadow-soft">
          <span className="font-bold">{currentRound}/{ROUNDS}</span>
        </div>

        <div className={`font-bold text-xl ${timeLeft <= 5 ? 'text-destructive animate-pulse' : ''}`}>
          {timeLeft}s
        </div>
      </motion.div>

      {/* Main game area */}
      <div className="flex-1 flex flex-col items-center justify-center px-4">
        <AnimatePresence mode="wait">
          {showFeedback === 'correct' && (
            <motion.div
              className="absolute text-6xl"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1.5, opacity: 1 }}
              exit={{ scale: 2, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              ✨
            </motion.div>
          )}
          {showFeedback === 'wrong' && (
            <motion.div
              className="absolute text-4xl"
              initial={{ scale: 0 }}
              animate={{ scale: 1, x: [-10, 10, -10, 10, 0] }}
              exit={{ opacity: 0 }}
            >
              ❌
            </motion.div>
          )}
        </AnimatePresence>

        <Mascot emotion={combo >= 3 ? 'excited' : 'happy'} size="md" />
        
        <motion.p 
          className="mt-4 text-xl font-bold text-center"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 0.5, repeat: Infinity }}
        >
          Tap the glowing key! 🎯
        </motion.p>
      </div>

      {/* Piano */}
      <motion.div 
        className="px-2 pb-4"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Piano 
          highlightedKeys={targetNote ? [targetNote] : []}
          onKeyPress={handleKeyPress}
          colorfulKeys={true}
          size="large"
        />
      </motion.div>
    </div>
  );
};

export default NoteCatcher;
