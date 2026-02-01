import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Play, Square } from 'lucide-react';
import SongCard from '@/components/ui/SongCard';
import Piano from '@/components/piano/Piano';
import BigButton from '@/components/ui/BigButton';
import { MELODIES, MelodyId, playNote } from '@/lib/audio';
import { getProgress } from '@/lib/storage';

const SONGS = [
  // Beginner - Free
  { id: 'twinkle-twinkle' as MelodyId, title: 'Twinkle Twinkle', color: 'blue' as const, premium: false, difficulty: 'Easy' },
  { id: 'mary-lamb' as MelodyId, title: 'Mary Had A Lamb', color: 'pink' as const, premium: false, difficulty: 'Easy' },
  { id: 'happy-birthday' as MelodyId, title: 'Happy Birthday', color: 'yellow' as const, premium: false, difficulty: 'Easy' },
  // Beginner - More
  { id: 'hot-cross-buns' as MelodyId, title: 'Hot Cross Buns', color: 'orange' as const, premium: false, difficulty: 'Easy' },
  { id: 'london-bridge' as MelodyId, title: 'London Bridge', color: 'green' as const, premium: false, difficulty: 'Easy' },
  // Intermediate
  { id: 'ode-to-joy' as MelodyId, title: 'Ode to Joy', color: 'purple' as const, premium: false, difficulty: 'Medium' },
  { id: 'jingle-bells' as MelodyId, title: 'Jingle Bells', color: 'red' as const, premium: false, difficulty: 'Medium' },
  { id: 'row-your-boat' as MelodyId, title: 'Row Your Boat', color: 'blue' as const, premium: false, difficulty: 'Easy' },
  { id: 'old-macdonald' as MelodyId, title: 'Old MacDonald', color: 'green' as const, premium: false, difficulty: 'Medium' },
  { id: 'baa-baa-sheep' as MelodyId, title: 'Baa Baa Black Sheep', color: 'purple' as const, premium: false, difficulty: 'Easy' },
];

const Songs = () => {
  const navigate = useNavigate();
  const progress = getProgress();
  const [selectedSong, setSelectedSong] = useState<MelodyId | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentNoteIndex, setCurrentNoteIndex] = useState(0);
  const [highlightedKeys, setHighlightedKeys] = useState<string[]>([]);
  const isPlayingRef = useRef(false);

  // Sync ref with state
  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  const playSong = async () => {
    if (!selectedSong) return;
    
    const melody = MELODIES[selectedSong];
    if (!melody) return;
    
    setIsPlaying(true);
    isPlayingRef.current = true;
    setCurrentNoteIndex(0);

    for (let i = 0; i < melody.notes.length; i++) {
      // Check ref instead of state to get current value
      if (!isPlayingRef.current) break;
      
      const note = melody.notes[i];
      setCurrentNoteIndex(i);
      setHighlightedKeys([note]);
      playNote(note, 0.5);
      await new Promise(resolve => setTimeout(resolve, melody.tempo));
      
      if (!isPlayingRef.current) break;
      
      setHighlightedKeys([]);
      await new Promise(resolve => setTimeout(resolve, 50));
    }

    setIsPlaying(false);
    isPlayingRef.current = false;
    setCurrentNoteIndex(0);
    setHighlightedKeys([]);
  };

  const stopSong = () => {
    setIsPlaying(false);
    isPlayingRef.current = false;
    setHighlightedKeys([]);
    setCurrentNoteIndex(0);
  };

  const handleKeyPress = (note: string) => {
    // Allow user to play along
    playNote(note, 0.5);
  };

  if (selectedSong) {
    const melody = MELODIES[selectedSong];
    const song = SONGS.find(s => s.id === selectedSong);

    if (!melody) {
      return (
        <div className="min-h-screen bg-gradient-sky flex items-center justify-center">
          <p>Song not found</p>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-gradient-sky flex flex-col safe-top safe-bottom">
        {/* Header */}
        <motion.div 
          className="flex items-center gap-4 p-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <motion.button
            className="p-3 bg-card rounded-full shadow-soft"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              stopSong();
              setSelectedSong(null);
            }}
          >
            <ArrowLeft className="w-6 h-6" />
          </motion.button>

          <div>
            <h1 className="text-xl font-bold">{song?.title}</h1>
            <p className="text-sm text-muted-foreground">{song?.difficulty}</p>
          </div>
        </motion.div>

        {/* Main content */}
        <div className="flex-1 flex flex-col items-center justify-center px-4">
          <motion.div 
            className="bg-card rounded-3xl p-6 shadow-card text-center mb-6 w-full max-w-sm"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <motion.div
              className="text-6xl mb-4"
              animate={isPlaying ? { rotate: [0, 10, -10, 0] } : {}}
              transition={{ duration: 0.5, repeat: isPlaying ? Infinity : 0 }}
            >
              🎵
            </motion.div>

            {isPlaying ? (
              <>
                <p className="text-lg font-bold text-primary animate-pulse">
                  Now Playing...
                </p>
                <p className="text-muted-foreground mb-4">
                  Note {currentNoteIndex + 1} of {melody.notes.length}
                </p>
                <motion.button
                  className="bg-destructive text-destructive-foreground px-8 py-4 rounded-2xl font-bold shadow-button flex items-center justify-center gap-2 mx-auto"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={stopSong}
                >
                  <Square className="w-5 h-5" />
                  Stop
                </motion.button>
              </>
            ) : (
              <>
                <p className="text-muted-foreground mb-4">
                  {melody.notes.length} notes • Tap Play to hear the song!
                </p>
                <motion.button
                  className="bg-gradient-primary text-primary-foreground px-8 py-4 rounded-2xl font-bold shadow-button flex items-center justify-center gap-2 mx-auto"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={playSong}
                >
                  <Play className="w-5 h-5" />
                  Play Song
                </motion.button>
              </>
            )}
          </motion.div>

          {/* Note visualization */}
          <div className="flex flex-wrap justify-center gap-2 max-w-sm px-4">
            {melody.notes.map((note, index) => (
              <motion.div
                key={index}
                className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold text-xs transition-all ${
                  index === currentNoteIndex && isPlaying
                    ? 'bg-accent text-accent-foreground scale-125 shadow-lg'
                    : index < currentNoteIndex && isPlaying
                    ? 'bg-success/40 text-success-foreground'
                    : 'bg-muted text-muted-foreground'
                }`}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: index * 0.03 }}
              >
                {note.replace('4', '').replace('5', '')}
              </motion.div>
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
  }

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

          <h1 className="text-2xl font-bold">Song Library</h1>
        </motion.div>

        {/* Song Grid */}
        <motion.div 
          className="grid grid-cols-2 gap-3"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.08 },
            },
          }}
        >
          {SONGS.map((song) => {
            const isUnlocked = progress.unlockedSongs.includes(song.id) || !song.premium;
            
            return (
              <motion.div
                key={song.id}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 },
                }}
              >
                <SongCard
                  title={song.title}
                  stars={0}
                  isLocked={!isUnlocked}
                  onPlay={() => setSelectedSong(song.id)}
                  color={song.color}
                />
              </motion.div>
            );
          })}
        </motion.div>

        {/* Fun message */}
        <motion.div 
          className="mt-6 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <motion.div
            className="text-4xl mb-2"
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            🎹
          </motion.div>
          <p className="text-muted-foreground font-semibold">
            Tap a song to play it!
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Songs;
