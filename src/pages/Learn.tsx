import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Piano from '@/components/piano/Piano';
import Mascot from '@/components/ui/Mascot';
import StarRating from '@/components/ui/StarRating';
import ProgressBar from '@/components/ui/ProgressBar';
import BigButton from '@/components/ui/BigButton';
import { ArrowLeft, Play, RotateCcw } from 'lucide-react';
import { playNote, playSuccessSound, playStarSound, MELODIES, MelodyId } from '@/lib/audio';
import { completeLesson, getProgress } from '@/lib/storage';

interface Lesson {
  id: string;
  title: string;
  melody: MelodyId;
  description: string;
  requiredLevel: number;
}

const LESSONS: Lesson[] = [
  { id: 'lesson-1', title: 'First Notes', melody: 'twinkle-twinkle', description: 'Learn C, G, and A!', requiredLevel: 1 },
  { id: 'lesson-2', title: 'Simple Melody', melody: 'mary-lamb', description: 'Play a cute song!', requiredLevel: 1 },
  { id: 'lesson-3', title: 'Happy Tune', melody: 'happy-birthday', description: 'Birthday song!', requiredLevel: 2 },
];

const Learn = () => {
  const navigate = useNavigate();
  const progress = getProgress();
  
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentNoteIndex, setCurrentNoteIndex] = useState(0);
  const [playerTurn, setPlayerTurn] = useState(false);
  const [correctNotes, setCorrectNotes] = useState(0);
  const [showComplete, setShowComplete] = useState(false);
  const [earnedStars, setEarnedStars] = useState(0);
  const [highlightedKeys, setHighlightedKeys] = useState<string[]>([]);

  const startLesson = (lesson: Lesson) => {
    setSelectedLesson(lesson);
    setCurrentNoteIndex(0);
    setCorrectNotes(0);
    setPlayerTurn(false);
    setIsPlaying(false);
    setShowComplete(false);
  };

  const playDemo = async () => {
    if (!selectedLesson) return;
    
    const melody = MELODIES[selectedLesson.melody];
    setIsPlaying(true);
    setPlayerTurn(false);
    setCurrentNoteIndex(0);

    for (let i = 0; i < melody.notes.length; i++) {
      const note = melody.notes[i];
      setHighlightedKeys([note]);
      playNote(note, 0.5);
      await new Promise(resolve => setTimeout(resolve, melody.tempo));
      setHighlightedKeys([]);
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    setIsPlaying(false);
    setPlayerTurn(true);
    setCurrentNoteIndex(0);
    setCorrectNotes(0);
    
    // Highlight first note for player
    if (melody.notes.length > 0) {
      setHighlightedKeys([melody.notes[0]]);
    }
  };

  const handleKeyPress = (note: string) => {
    if (!selectedLesson || !playerTurn || isPlaying) return;

    const melody = MELODIES[selectedLesson.melody];
    const expectedNote = melody.notes[currentNoteIndex];

    if (note === expectedNote) {
      const newCorrect = correctNotes + 1;
      setCorrectNotes(newCorrect);
      setCurrentNoteIndex(currentNoteIndex + 1);

      if (currentNoteIndex + 1 < melody.notes.length) {
        setHighlightedKeys([melody.notes[currentNoteIndex + 1]]);
      } else {
        // Lesson complete!
        setHighlightedKeys([]);
        setPlayerTurn(false);
        
        const accuracy = newCorrect / melody.notes.length;
        const stars = accuracy >= 1 ? 3 : accuracy >= 0.8 ? 2 : 1;
        setEarnedStars(stars);
        
        completeLesson(selectedLesson.id, stars);
        playSuccessSound();
        setTimeout(() => playStarSound(), 500);
        setShowComplete(true);
      }
    } else {
      // Wrong note - gentle feedback, don't penalize
      // Just keep the highlight on expected note
      setHighlightedKeys([expectedNote]);
    }
  };

  const resetLesson = () => {
    if (selectedLesson) {
      startLesson(selectedLesson);
    }
  };

  if (showComplete && selectedLesson) {
    return (
      <div className="min-h-screen bg-gradient-sky flex flex-col items-center justify-center p-4 safe-top safe-bottom">
        <motion.div
          className="bg-card rounded-3xl p-8 shadow-card text-center max-w-sm w-full"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
          >
            <Mascot emotion="excited" size="lg" />
          </motion.div>
          
          <motion.h2 
            className="text-2xl font-black mt-4 text-primary"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            Great Job! 🎉
          </motion.h2>
          
          <motion.div 
            className="mt-4 flex justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <StarRating rating={earnedStars} size="lg" />
          </motion.div>

          <motion.div 
            className="mt-6 space-y-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <BigButton variant="primary" icon={<RotateCcw />} onClick={resetLesson}>
              Try Again
            </BigButton>
            <BigButton variant="secondary" onClick={() => setSelectedLesson(null)}>
              More Lessons
            </BigButton>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  if (selectedLesson) {
    const melody = MELODIES[selectedLesson.melody];
    const progressPercent = playerTurn ? (currentNoteIndex / melody.notes.length) * 100 : 0;

    return (
      <div className="min-h-screen bg-gradient-sky flex flex-col safe-top safe-bottom">
        {/* Header */}
        <motion.div 
          className="flex items-center justify-between p-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <motion.button
            className="p-3 bg-card rounded-full shadow-soft"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedLesson(null)}
          >
            <ArrowLeft className="w-6 h-6" />
          </motion.button>

          <h1 className="text-xl font-bold">{selectedLesson.title}</h1>

          <div className="w-12" />
        </motion.div>

        {/* Progress */}
        <div className="px-4 mb-4">
          <ProgressBar value={progressPercent} color="success" />
        </div>

        {/* Main content */}
        <div className="flex-1 flex flex-col items-center justify-center px-4">
          <Mascot emotion={playerTurn ? 'thinking' : 'happy'} size="md" />
          
          <motion.div 
            className="mt-4 bg-card rounded-2xl px-6 py-4 shadow-card text-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            {!isPlaying && !playerTurn && (
              <>
                <p className="text-muted-foreground mb-3">Watch and listen!</p>
                <BigButton variant="accent" icon={<Play />} onClick={playDemo}>
                  Play Demo
                </BigButton>
              </>
            )}
            {isPlaying && (
              <p className="text-lg font-bold text-primary animate-pulse">
                🎵 Listen carefully...
              </p>
            )}
            {playerTurn && (
              <p className="text-lg font-bold text-success">
                ✨ Your turn! Follow the glowing keys
              </p>
            )}
          </motion.div>
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
  }

  // Lesson selection screen
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

          <h1 className="text-2xl font-bold">Learn Piano</h1>
        </motion.div>

        {/* Lesson Cards */}
        <motion.div 
          className="space-y-4"
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
          {LESSONS.map((lesson, index) => {
            const isCompleted = progress.completedLessons.includes(lesson.id);
            const isLocked = lesson.requiredLevel > progress.currentLevel;

            return (
              <motion.div
                key={lesson.id}
                variants={{
                  hidden: { opacity: 0, x: -20 },
                  visible: { opacity: 1, x: 0 },
                }}
              >
                <motion.button
                  className={`w-full bg-card rounded-3xl p-5 shadow-card text-left ${
                    isLocked ? 'opacity-60' : ''
                  }`}
                  whileHover={!isLocked ? { scale: 1.02 } : undefined}
                  whileTap={!isLocked ? { scale: 0.98 } : undefined}
                  onClick={() => !isLocked && startLesson(lesson)}
                  disabled={isLocked}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl ${
                      isCompleted ? 'bg-success/20' : 'bg-primary/20'
                    }`}>
                      {isLocked ? '🔒' : isCompleted ? '✅' : '🎹'}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg">{lesson.title}</h3>
                      <p className="text-sm text-muted-foreground">{lesson.description}</p>
                    </div>
                    {isCompleted && (
                      <StarRating rating={3} size="sm" animated={false} />
                    )}
                  </div>
                </motion.button>
              </motion.div>
            );
          })}
        </motion.div>

        <motion.div 
          className="mt-8 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <Mascot emotion="happy" size="sm" />
          <p className="text-muted-foreground mt-2">More lessons coming soon!</p>
        </motion.div>
      </div>
    </div>
  );
};

export default Learn;
