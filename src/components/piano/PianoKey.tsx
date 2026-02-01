import { motion } from 'framer-motion';
import { playNote, resumeAudioContext } from '@/lib/audio';

interface PianoKeyProps {
  note: string;
  isBlack?: boolean;
  isHighlighted?: boolean;
  isPressed?: boolean;
  onPress?: (note: string) => void;
  color?: string;
}

const WHITE_KEY_COLORS = [
  'bg-game-red',
  'bg-game-orange', 
  'bg-game-yellow',
  'bg-game-green',
  'bg-game-blue',
  'bg-game-purple',
  'bg-game-pink',
];

const PianoKey = ({ 
  note, 
  isBlack = false, 
  isHighlighted = false, 
  isPressed = false,
  onPress,
  color,
}: PianoKeyProps) => {
  const handlePress = async () => {
    await resumeAudioContext();
    playNote(note, isBlack ? 0.6 : 0.8);
    onPress?.(note);
  };

  if (isBlack) {
    return (
      <motion.button
        className={`piano-key-black w-8 h-24 -mx-4 z-20 ${
          isHighlighted ? 'key-glow bg-accent' : ''
        } ${isPressed ? 'pressed' : ''}`}
        whileTap={{ scale: 0.95, y: 3 }}
        onTouchStart={(e) => {
          e.preventDefault();
          handlePress();
        }}
        onMouseDown={handlePress}
        aria-label={`Piano key ${note}`}
      >
        {isHighlighted && (
          <motion.div
            className="absolute inset-0 rounded-b-lg bg-accent/50"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 0.8, repeat: Infinity }}
          />
        )}
      </motion.button>
    );
  }

  return (
    <motion.button
      className={`piano-key-white flex-1 h-40 flex items-end justify-center pb-3 ${
        isHighlighted ? 'key-glow' : ''
      } ${isPressed ? 'pressed' : ''} ${color || ''}`}
      style={isHighlighted ? { 
        background: 'linear-gradient(180deg, hsl(45 95% 80%), hsl(45 95% 70%))'
      } : undefined}
      whileTap={{ scale: 0.98, y: 3 }}
      onTouchStart={(e) => {
        e.preventDefault();
        handlePress();
      }}
      onMouseDown={handlePress}
      aria-label={`Piano key ${note}`}
    >
      <span className="text-xs font-bold text-foreground/40">
        {note.replace('4', '').replace('5', '')}
      </span>
    </motion.button>
  );
};

export default PianoKey;
export { WHITE_KEY_COLORS };
