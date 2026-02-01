import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Piano from '@/components/piano/Piano';
import Mascot from '@/components/ui/Mascot';
import StarRating from '@/components/ui/StarRating';
import BigButton from '@/components/ui/BigButton';
import { ArrowLeft, Play, RotateCcw } from 'lucide-react';
import { playNote, playSuccessSound, playStarSound } from '@/lib/audio';
import { saveGameScore, getProgress } from '@/lib/storage';

const NOTES = ['C4', 'D4', 'E4', 'F4', 'G4'];
const BEATS_PER_ROUND = 8;
const ROUNDS = 3;
const BEAT_INTERVAL = 600; // ms

const RhythmTap = () => {
  const navigate = useNavigate();
  const [gameState, setGameState] = useState<'ready' | 'countdown' | 'playing' | 'finished'>('ready');
  const [currentRound, setCurrentRound] = useState(0);
  const [currentBeat, setCurrentBeat] = useState(0);
  const [score, setScore] = useState(0);
  const [pattern, setPattern] = useState<number[]>([]);
  const [highlightedKeys, setHighlightedKeys] = useState<string[]>([]);
  const [hitResults, setHitResults] = useState<('perfect' | 'good' | 'miss')[]>([]);
  const [earnedStars, setEarnedStars] = useState(0);
  const [countdown, setCountdown] = useState(3);
  const [lastHitTime, setLastHitTime] = useState<number | null>(null);
  const [beatStartTime, setBeatStartTime] = useState<number | null>(null);

  const generatePattern = useCallback(() => {
    // Generate a pattern where some beats should be hit (1) and some not (0)
    const newPattern = Array.from({ length: BEATS_PER_ROUND }, () => 
      Math.random() > 0.3 ? 1 : 0
    );
    setPattern(newPattern);
    return newPattern;
  }, []);

  const startGame = () => {
    setScore(0);
    setCurrentRound(0);
    setGameState('countdown');
    setCountdown(3);
  };

  const startRound = () => {
    setCurrentBeat(0);
    setHitResults([]);
    generatePattern();
    setGameState('playing');
  };

  // Countdown effect
  useEffect(() => {
    if (gameState !== 'countdown') return;

    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(prev => prev - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      startRound();
    }
  }, [gameState, countdown]);

  // Beat progression
  useEffect(() => {
    if (gameState !== 'playing') return;

    if (currentBeat >= BEATS_PER_ROUND) {
      // Round complete
      if (currentRound + 1 >= ROUNDS) {
        endGame();
      } else {
        setCurrentRound(prev => prev + 1);
        setGameState('countdown');
        setCountdown(3);
      }
      return;
    }

    const now = Date.now();
    setBeatStartTime(now);

    // Show highlight on beat
    if (pattern[currentBeat] === 1) {
      const note = NOTES[currentBeat % NOTES.length];
      setHighlightedKeys([note]);
    }

    const timer = setTimeout(() => {
      // Check if player missed this beat
      if (pattern[currentBeat] === 1 && !lastHitTime) {
        setHitResults(prev => [...prev, 'miss']);
      }
      
      setHighlightedKeys([]);
      setLastHitTime(null);
      setCurrentBeat(prev => prev + 1);
    }, BEAT_INTERVAL);

    return () => clearTimeout(timer);
  }, [gameState, currentBeat, pattern, lastHitTime, currentRound]);

  const handleKeyPress = (note: string) => {
    if (gameState !== 'playing') return;
    
    const now = Date.now();
    const shouldHit = pattern[currentBeat] === 1;
    
    if (shouldHit && beatStartTime) {
      const timing = now - beatStartTime;
      
      // Perfect: within 150ms, Good: within 300ms
      if (timing < 150) {
        setScore(prev => prev + 100);
        setHitResults(prev => [...prev, 'perfect']);
        playSuccessSound();
      } else if (timing < 300) {
        setScore(prev => prev + 50);
        setHitResults(prev => [...prev, 'good']);
        playNote(note, 0.3);
      } else {
        setHitResults(prev => [...prev, 'miss']);
      }
      
      setLastHitTime(now);
    }
  };

  const endGame = useCallback(() => {
    setGameState('finished');
    setHighlightedKeys([]);
    
    const maxScore = ROUNDS * BEATS_PER_ROUND * 100;
    const percentage = score / maxScore;
    const stars = percentage >= 0.7 ? 3 : percentage >= 0.4 ? 2 : percentage >= 0.2 ? 1 : 0;
    setEarnedStars(stars);
    
    if (stars > 0) {
      playStarSound();
    }
    
    saveGameScore('rhythm-tap', score);
  }, [score]);

  if (gameState === 'ready') {
    return (
      <div className="min-h-screen bg-gradient-sky flex flex-col items-center justify-center p-4 safe-top safe-bottom">
        <motion.div 
          className="bg-card rounded-3xl p-8 shadow-card text-center max-w-sm w-full relative"
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
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 0.6, repeat: Infinity }}
            className="text-6xl mb-4"
          >
            🥁
          </motion.div>
          
          <h1 className="text-2xl font-black text-primary mb-2">Rhythm Tap</h1>
          <p className="text-muted-foreground mb-6">
            Tap in rhythm with the beat!
          </p>

          <div className="bg-muted rounded-2xl p-4 mb-6 text-left">
            <p className="font-semibold">How to play:</p>
            <ul className="text-sm text-muted-foreground mt-2 space-y-1">
              <li>• Watch for glowing keys</li>
              <li>• Tap when they light up</li>
              <li>• Perfect timing = more points!</li>
            </ul>
          </div>

          <BigButton variant="primary" icon={<Play />} onClick={startGame}>
            Start Game
          </BigButton>
        </motion.div>
      </div>
    );
  }

  if (gameState === 'countdown') {
    return (
      <div className="min-h-screen bg-gradient-sky flex flex-col items-center justify-center p-4 safe-top safe-bottom">
        <motion.div
          className="text-9xl font-black text-primary"
          key={countdown}
          initial={{ scale: 2, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.5, opacity: 0 }}
        >
          {countdown || 'GO!'}
        </motion.div>
        <p className="text-xl text-muted-foreground mt-4">Round {currentRound + 1}</p>
      </div>
    );
  }

  if (gameState === 'finished') {
    const progress = getProgress();
    const highScore = progress.gameScores['rhythm-tap'] || 0;

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
            {earnedStars >= 2 ? 'Great Rhythm! 🎶' : 'Keep Practicing! 💪'}
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

  return (
    <div className="min-h-screen bg-gradient-sky flex flex-col safe-top safe-bottom">
      {/* Header */}
      <motion.div 
        className="flex items-center justify-between p-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <span className="text-2xl font-black text-primary">{score}</span>

        <div className="bg-card rounded-full px-4 py-2 shadow-soft">
          <span className="font-bold">Round {currentRound + 1}/{ROUNDS}</span>
        </div>

        <div className="font-bold">
          {currentBeat + 1}/{BEATS_PER_ROUND}
        </div>
      </motion.div>

      {/* Beat indicator */}
      <div className="flex justify-center gap-1 px-4">
        {pattern.map((shouldHit, index) => (
          <motion.div
            key={index}
            className={`w-6 h-6 rounded-full ${
              index < hitResults.length
                ? hitResults[index] === 'perfect'
                  ? 'bg-success'
                  : hitResults[index] === 'good'
                  ? 'bg-accent'
                  : 'bg-destructive/50'
                : index === currentBeat
                ? shouldHit
                  ? 'bg-primary animate-pulse'
                  : 'bg-muted'
                : shouldHit
                ? 'bg-primary/30'
                : 'bg-muted/50'
            }`}
            initial={{ scale: 0 }}
            animate={{ 
              scale: index === currentBeat ? [1, 1.2, 1] : 1,
            }}
            transition={{ 
              duration: 0.3,
              repeat: index === currentBeat ? Infinity : 0 
            }}
          />
        ))}
      </div>

      {/* Main game area */}
      <div className="flex-1 flex flex-col items-center justify-center px-4">
        <Mascot emotion="excited" size="md" />
        
        <motion.p 
          className="mt-4 text-xl font-bold text-center"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 0.6, repeat: Infinity }}
        >
          Tap on the beat! 🎵
        </motion.p>
      </div>

      {/* Piano */}
      <motion.div 
        className="px-2 pb-4"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Piano 
          highlightedKeys={highlightedKeys}
          onKeyPress={handleKeyPress}
          colorfulKeys={true}
          size="large"
        />
      </motion.div>
    </div>
  );
};

export default RhythmTap;
