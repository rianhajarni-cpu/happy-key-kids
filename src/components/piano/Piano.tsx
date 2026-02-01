import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import PianoKey, { WHITE_KEY_COLORS } from './PianoKey';

interface PianoProps {
  highlightedKeys?: string[];
  onKeyPress?: (note: string) => void;
  colorfulKeys?: boolean;
  size?: 'small' | 'medium' | 'large';
}

const WHITE_KEYS = ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4', 'C5'];
const BLACK_KEYS = [
  { note: 'C#4', position: 0 },
  { note: 'D#4', position: 1 },
  { note: 'F#4', position: 3 },
  { note: 'G#4', position: 4 },
  { note: 'A#4', position: 5 },
];

const Piano = ({ 
  highlightedKeys = [], 
  onKeyPress,
  colorfulKeys = true,
  size = 'large',
}: PianoProps) => {
  const [pressedKey, setPressedKey] = useState<string | null>(null);
  const [isLandscape, setIsLandscape] = useState(false);

  useEffect(() => {
    const checkOrientation = () => {
      setIsLandscape(window.innerWidth > window.innerHeight);
    };
    checkOrientation();
    window.addEventListener('resize', checkOrientation);
    return () => window.removeEventListener('resize', checkOrientation);
  }, []);

  const handleKeyPress = (note: string) => {
    setPressedKey(note);
    onKeyPress?.(note);
    setTimeout(() => setPressedKey(null), 150);
  };

  // Dynamically adjust height based on orientation and size
  const getHeightClass = () => {
    if (isLandscape) {
      // Taller keys in landscape for better playability
      return size === 'large' ? 'h-52' : size === 'medium' ? 'h-44' : 'h-36';
    }
    return size === 'large' ? 'h-44' : size === 'medium' ? 'h-36' : 'h-28';
  };

  return (
    <motion.div 
      className={`relative flex rounded-t-3xl overflow-hidden shadow-card bg-card/50 backdrop-blur-sm p-2 ${getHeightClass()}`}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      {/* White Keys */}
      <div className="flex flex-1 gap-1">
        {WHITE_KEYS.map((note, index) => (
          <PianoKey
            key={note}
            note={note}
            isHighlighted={highlightedKeys.includes(note)}
            isPressed={pressedKey === note}
            onPress={handleKeyPress}
            color={colorfulKeys ? WHITE_KEY_COLORS[index % WHITE_KEY_COLORS.length] : undefined}
          />
        ))}
      </div>

      {/* Black Keys - Positioned Absolutely */}
      <div className="absolute top-2 left-2 right-2 flex">
        {WHITE_KEYS.slice(0, -1).map((_, index) => {
          const blackKey = BLACK_KEYS.find(bk => bk.position === index);
          if (!blackKey) {
            return <div key={`spacer-${index}`} className="flex-1" />;
          }
          return (
            <div key={blackKey.note} className="flex-1 flex justify-end">
              <PianoKey
                note={blackKey.note}
                isBlack
                isHighlighted={highlightedKeys.includes(blackKey.note)}
                isPressed={pressedKey === blackKey.note}
                onPress={handleKeyPress}
              />
            </div>
          );
        })}
      </div>

      {/* Visual effect overlays */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-transparent to-white/10 rounded-t-3xl" />
    </motion.div>
  );
};

export default Piano;
