import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Play, Square, Home } from 'lucide-react';
import SongCard from '@/components/ui/SongCard';
import Piano from '@/components/piano/Piano';
import { MELODIES, MelodyId, playNote } from '@/lib/audio';
import { getProgress } from '@/lib/storage';

const SONGS = [
  // Beginner
  { id: 'twinkle-twinkle' as MelodyId, title: 'Twinkle Twinkle', color: 'blue' as const, premium: false, difficulty: 'Easy' },
  { id: 'mary-lamb' as MelodyId, title: 'Mary Had A Lamb', color: 'pink' as const, premium: false, difficulty: 'Easy' },
  { id: 'happy-birthday' as MelodyId, title: 'Happy Birthday', color: 'yellow' as const, premium: false, difficulty: 'Easy' },
  { id: 'hot-cross-buns' as MelodyId, title: 'Hot Cross Buns', color: 'orange' as const, premium: false, difficulty: 'Easy' },
  { id: 'london-bridge' as MelodyId, title: 'London Bridge', color: 'green' as const, premium: false, difficulty: 'Easy' },
  { id: 'row-your-boat' as MelodyId, title: 'Row Your Boat', color: 'blue' as const, premium: false, difficulty: 'Easy' },
  { id: 'baa-baa-sheep' as MelodyId, title: 'Baa Baa Black Sheep', color: 'purple' as const, premium: false, difficulty: 'Easy' },
  { id: 'rain-rain' as MelodyId, title: 'Rain Rain Go Away', color: 'blue' as const, premium: false, difficulty: 'Easy' },
  // Intermediate
  { id: 'ode-to-joy' as MelodyId, title: 'Ode to Joy', color: 'purple' as const, premium: false, difficulty: 'Medium' },
  { id: 'jingle-bells' as MelodyId, title: 'Jingle Bells', color: 'red' as const, premium: false, difficulty: 'Medium' },
  { id: 'old-macdonald' as MelodyId, title: 'Old MacDonald', color: 'green' as const, premium: false, difficulty: 'Medium' },
  { id: 'itsy-bitsy-spider' as MelodyId, title: 'Itsy Bitsy Spider', color: 'pink' as const, premium: false, difficulty: 'Medium' },
  { id: 'abc-song' as MelodyId, title: 'ABC Song', color: 'yellow' as const, premium: false, difficulty: 'Easy' },
  { id: 'wheels-on-bus' as MelodyId, title: 'Wheels on the Bus', color: 'orange' as const, premium: false, difficulty: 'Medium' },
  { id: 'if-youre-happy' as MelodyId, title: "If You're Happy", color: 'green' as const, premium: false, difficulty: 'Medium' },
  { id: 'head-shoulders' as MelodyId, title: 'Head Shoulders Knees', color: 'red' as const, premium: false, difficulty: 'Medium' },
];

const Songs = () => {
  const navigate = useNavigate();
  const progress = getProgress();
  const [selectedSong, setSelectedSong] = useState<MelodyId | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentNoteIndex, setCurrentNoteIndex] = useState(0);
  const [highlightedKeys, setHighlightedKeys] = useState<string[]>([]);
  const [isLandscape, setIsLandscape] = useState(false);
  const isPlayingRef = useRef(false);

  useEffect(() => {
    const checkOrientation = () => {
      setIsLandscape(window.innerWidth > window.innerHeight);
    };
    checkOrientation();
    window.addEventListener('resize', checkOrientation);
    return () => window.removeEventListener('resize', checkOrientation);
  }, []);

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
        <div className="h-screen bg-gradient-sky flex items-center justify-center">
          <p>Song not found</p>
        </div>
      );
    }

    return (
      <div className="h-screen max-h-screen overflow-hidden bg-gradient-sky flex flex-col">
        {/* Compact Header */}
        <motion.div 
          className={`flex items-center gap-3 ${isLandscape ? 'px-4 py-2' : 'p-4'}`}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <motion.button
            className="p-2 bg-card rounded-full shadow-soft"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              stopSong();
              setSelectedSong(null);
            }}
          >
            <ArrowLeft className="w-5 h-5" />
          </motion.button>

          <div className="flex-1">
            <h1 className="text-lg font-bold">{song?.title}</h1>
            {!isLandscape && <p className="text-xs text-muted-foreground">{song?.difficulty}</p>}
          </div>

          {/* Play controls in header for landscape */}
          {isLandscape && (
            <motion.button
              className={`px-4 py-2 rounded-xl font-bold shadow-button flex items-center gap-2 ${
                isPlaying ? 'bg-destructive text-destructive-foreground' : 'bg-gradient-primary text-primary-foreground'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={isPlaying ? stopSong : playSong}
            >
              {isPlaying ? <Square className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              {isPlaying ? 'Stop' : 'Play'}
            </motion.button>
          )}
        </motion.div>

        {/* Main content - Vertical layout with notes above piano */}
        <div className="flex-1 flex flex-col items-center justify-end px-4 pb-4 overflow-hidden">
          
          {/* Controls & Notes - Always on top */}
          <motion.div 
            className="flex flex-col items-center w-full mb-3"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            {/* Play button */}
            <motion.button
              className={`px-5 py-2 rounded-xl font-bold shadow-button flex items-center gap-2 mb-3 ${
                isPlaying ? 'bg-destructive text-destructive-foreground' : 'bg-gradient-primary text-primary-foreground'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={isPlaying ? stopSong : playSong}
            >
              {isPlaying ? <Square className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              {isPlaying ? 'Stop' : 'Play Song'}
            </motion.button>

            {isPlaying && (
              <p className="text-xs text-muted-foreground mb-2">
                Note {currentNoteIndex + 1}/{melody.notes.length}
              </p>
            )}

            {/* Note visualization - Horizontal scroll */}
            <div className="flex flex-wrap justify-center gap-1 max-w-full px-2">
              {melody.notes.slice(0, isLandscape ? 30 : 16).map((note, index) => (
                <motion.div
                  key={index}
                  className={`w-6 h-6 rounded-md flex items-center justify-center font-bold text-xs transition-all ${
                    index === currentNoteIndex && isPlaying
                      ? 'bg-accent text-accent-foreground scale-110 shadow-md'
                      : index < currentNoteIndex && isPlaying
                      ? 'bg-success/40 text-success-foreground'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {note.replace('4', '').replace('5', '')}
                </motion.div>
              ))}
              {melody.notes.length > (isLandscape ? 30 : 16) && (
                <span className="text-muted-foreground text-xs self-center">+{melody.notes.length - (isLandscape ? 30 : 16)}</span>
              )}
            </div>
          </motion.div>

          {/* Piano - Full width at bottom */}
          <motion.div 
            className="w-full max-w-4xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Piano 
              highlightedKeys={highlightedKeys}
              onKeyPress={handleKeyPress}
              colorfulKeys={true}
              size={isLandscape ? 'large' : 'medium'}
            />
          </motion.div>
        </div>
      </div>
    );
  }

  // Song library view
  return (
    <div className="h-screen max-h-screen overflow-auto bg-gradient-sky">
      <div className={`container max-w-2xl mx-auto px-4 py-4 ${isLandscape ? 'py-2' : ''}`}>
        {/* Header */}
        <motion.div 
          className="flex items-center gap-4 mb-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <motion.button
            className="p-2 bg-card rounded-full shadow-soft"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/home')}
          >
            <Home className="w-5 h-5" />
          </motion.button>

          <h1 className="text-xl font-bold">Song Library</h1>
        </motion.div>

        {/* Song Grid - More columns in landscape */}
        <motion.div 
          className={`grid gap-3 ${isLandscape ? 'grid-cols-4 md:grid-cols-5' : 'grid-cols-2 sm:grid-cols-3'}`}
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.05 },
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
      </div>
    </div>
  );
};

export default Songs;
