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
const ROUNDS = 5;

const MelodyCopy = () => {
  const navigate = useNavigate();
  const [gameState, setGameState] = useState<'ready' | 'demo' | 'playing' | 'finished'>('ready');
  const [currentRound, setCurrentRound] = useState(0);
  const [melody, setMelody] = useState<string[]>([]);
  const [playerInput, setPlayerInput] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [highlightedKeys, setHighlightedKeys] = useState<string[]>([]);
  const [earnedStars, setEarnedStars] = useState(0);

  const generateMelody = useCallback((length: number) => {
    const newMelody = Array.from({ length }, () => 
      NOTES[Math.floor(Math.random() * NOTES.length)]
    );
    setMelody(newMelody);
    return newMelody;
  }, []);

  const playMelodyDemo = useCallback(async (melodyToPlay: string[]) => {
    setGameState('demo');
    
    for (let i = 0; i < melodyToPlay.length; i++) {
      const note = melodyToPlay[i];
      setHighlightedKeys([note]);
      playNote(note, 0.4);
      await new Promise(resolve => setTimeout(resolve, 600));
      setHighlightedKeys([]);
      await new Promise(resolve => setTimeout(resolve, 200));
    }
    
    setGameState('playing');
    setPlayerInput([]);
  }, []);

  const startGame = () => {
    setScore(0);
    setCurrentRound(0);
    startRound(0);
  };

  const startRound = (round: number) => {
    setCurrentRound(round);
    setPlayerInput([]);
    const length = Math.min(3 + round, 6); // Start with 3, max 6
    const newMelody = generateMelody(length);
    setTimeout(() => playMelodyDemo(newMelody), 500);
  };

  const handleKeyPress = (note: string) => {
    if (gameState !== 'playing') return;

    const newInput = [...playerInput, note];
    setPlayerInput(newInput);

    const currentIndex = newInput.length - 1;
    
    if (note !== melody[currentIndex]) {
      // Wrong note - end round with partial score
      const roundScore = Math.floor((currentIndex / melody.length) * 100);
      setScore(prev => prev + roundScore);
      
      if (currentRound + 1 >= ROUNDS) {
        endGame();
      } else {
        setTimeout(() => startRound(currentRound + 1), 1000);
      }
      return;
    }

    if (newInput.length === melody.length) {
      // Completed melody correctly!
      setScore(prev => prev + 100);
      playSuccessSound();
      
      if (currentRound + 1 >= ROUNDS) {
        setTimeout(() => endGame(), 500);
      } else {
        setTimeout(() => startRound(currentRound + 1), 1000);
      }
    }
  };

  const endGame = useCallback(() => {
    setGameState('finished');
    setHighlightedKeys([]);
    
    const maxScore = ROUNDS * 100;
    const percentage = score / maxScore;
    const stars = percentage >= 0.8 ? 3 : percentage >= 0.5 ? 2 : percentage >= 0.2 ? 1 : 0;
    setEarnedStars(stars);
    
    if (stars > 0) {
      playStarSound();
    }
    
    saveGameScore('melody-copy', score);
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
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-6xl mb-4"
          >
            🎵
          </motion.div>
          
          <h1 className="text-2xl font-black text-primary mb-2">Melody Copy</h1>
          <p className="text-muted-foreground mb-6">
            Listen and repeat the melody!
          </p>

          <div className="bg-muted rounded-2xl p-4 mb-6 text-left">
            <p className="font-semibold">How to play:</p>
            <ul className="text-sm text-muted-foreground mt-2 space-y-1">
              <li>• Watch the glowing keys</li>
              <li>• Then repeat the pattern</li>
              <li>• Melodies get longer each round!</li>
            </ul>
          </div>

          <BigButton variant="primary" icon={<Play />} onClick={startGame}>
            Start Game
          </BigButton>
        </motion.div>
      </div>
    );
  }

  if (gameState === 'finished') {
    const progress = getProgress();
    const highScore = progress.gameScores['melody-copy'] || 0;

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
            {earnedStars >= 2 ? 'Great Memory! 🧠' : 'Nice Try! 👏'}
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

        <div className="w-12" />
      </motion.div>

      {/* Main game area */}
      <div className="flex-1 flex flex-col items-center justify-center px-4">
        <Mascot emotion={gameState === 'demo' ? 'thinking' : 'happy'} size="md" />
        
        <motion.div 
          className="mt-4 bg-card rounded-2xl px-6 py-4 shadow-card text-center"
          animate={gameState === 'demo' ? { scale: [1, 1.02, 1] } : {}}
          transition={{ duration: 0.5, repeat: gameState === 'demo' ? Infinity : 0 }}
        >
          {gameState === 'demo' && (
            <p className="text-lg font-bold text-primary">
              🎵 Listen carefully...
            </p>
          )}
          {gameState === 'playing' && (
            <p className="text-lg font-bold text-success">
              ✨ Your turn! ({playerInput.length}/{melody.length})
            </p>
          )}
        </motion.div>

        {/* Note indicators */}
        <div className="flex gap-2 mt-4">
          {melody.map((_, index) => (
            <motion.div
              key={index}
              className={`w-4 h-4 rounded-full ${
                index < playerInput.length 
                  ? 'bg-success' 
                  : index === playerInput.length && gameState === 'playing'
                  ? 'bg-accent animate-pulse'
                  : 'bg-muted'
              }`}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: index * 0.1 }}
            />
          ))}
        </div>
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

export default MelodyCopy;
