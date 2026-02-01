import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Play } from 'lucide-react';
import SongCard from '@/components/ui/SongCard';
import Piano from '@/components/piano/Piano';
import BigButton from '@/components/ui/BigButton';
import { MELODIES, MelodyId, playNote } from '@/lib/audio';
import { getProgress } from '@/lib/storage';

const SONGS = [
  { id: 'twinkle-twinkle' as MelodyId, title: 'Twinkle Twinkle', color: 'blue' as const, premium: false },
  { id: 'mary-lamb' as MelodyId, title: 'Mary Had A Little Lamb', color: 'pink' as const, premium: false },
  { id: 'happy-birthday' as MelodyId, title: 'Happy Birthday', color: 'yellow' as const, premium: false },
  { id: 'ode-to-joy' as MelodyId, title: 'Ode to Joy', color: 'purple' as const, premium: true },
  { id: 'jingle-bells' as MelodyId, title: 'Jingle Bells', color: 'green' as const, premium: true },
];

const Songs = () => {
  const navigate = useNavigate();
  const progress = getProgress();
  const [selectedSong, setSelectedSong] = useState<MelodyId | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentNoteIndex, setCurrentNoteIndex] = useState(0);
  const [highlightedKeys, setHighlightedKeys] = useState<string[]>([]);

  const playSong = async () => {
    if (!selectedSong) return;
    
    const melody = MELODIES[selectedSong];
    setIsPlaying(true);
    setCurrentNoteIndex(0);

    for (let i = 0; i < melody.notes.length; i++) {
      if (!isPlaying) break;
      
      const note = melody.notes[i];
      setCurrentNoteIndex(i);
      setHighlightedKeys([note]);
      playNote(note, 0.5);
      await new Promise(resolve => setTimeout(resolve, melody.tempo));
      setHighlightedKeys([]);
      await new Promise(resolve => setTimeout(resolve, 50));
    }

    setIsPlaying(false);
    setCurrentNoteIndex(0);
  };

  const stopSong = () => {
    setIsPlaying(false);
    setHighlightedKeys([]);
  };

  if (selectedSong) {
    const melody = MELODIES[selectedSong];
    const song = SONGS.find(s => s.id === selectedSong);

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

          <h1 className="text-xl font-bold">{song?.title}</h1>
        </motion.div>

        {/* Main content */}
        <div className="flex-1 flex flex-col items-center justify-center px-4">
          <motion.div 
            className="bg-card rounded-3xl p-6 shadow-card text-center mb-6"
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
                <p className="text-muted-foreground">
                  Note {currentNoteIndex + 1} of {melody.notes.length}
                </p>
                <BigButton 
                  variant="secondary" 
                  onClick={stopSong}
                  className="mt-4"
                >
                  Stop
                </BigButton>
              </>
            ) : (
              <BigButton 
                variant="primary" 
                icon={<Play />} 
                onClick={playSong}
              >
                Play Song
              </BigButton>
            )}
          </motion.div>

          {/* Note visualization */}
          <div className="flex flex-wrap justify-center gap-2 max-w-sm">
            {melody.notes.map((note, index) => (
              <motion.div
                key={index}
                className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm ${
                  index === currentNoteIndex && isPlaying
                    ? 'bg-accent text-accent-foreground scale-110'
                    : index < currentNoteIndex
                    ? 'bg-success/30 text-success-foreground'
                    : 'bg-muted text-muted-foreground'
                }`}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: index * 0.05 }}
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
          className="grid grid-cols-2 gap-4"
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

        {/* Premium info */}
        <motion.div 
          className="mt-8 bg-gradient-fun rounded-3xl p-6 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <p className="text-lg font-bold text-primary-foreground">🎹 More Songs Coming!</p>
          <p className="text-sm text-primary-foreground/80 mt-1">
            Practice to unlock new songs
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Songs;
