import { motion } from 'framer-motion';
import { Lock, Star } from 'lucide-react';
import StarRating from './StarRating';

interface SongCardProps {
  title: string;
  stars: number;
  isLocked?: boolean;
  onPlay?: () => void;
  color?: 'red' | 'orange' | 'yellow' | 'green' | 'blue' | 'purple' | 'pink';
}

const colorClasses = {
  red: 'bg-game-red',
  orange: 'bg-game-orange',
  yellow: 'bg-game-yellow',
  green: 'bg-game-green',
  blue: 'bg-game-blue',
  purple: 'bg-game-purple',
  pink: 'bg-game-pink',
};

const SongCard = ({ 
  title, 
  stars, 
  isLocked = false, 
  onPlay,
  color = 'blue',
}: SongCardProps) => {
  return (
    <motion.button
      className={`
        relative w-full rounded-3xl p-5 shadow-card
        flex flex-col items-center gap-3
        ${colorClasses[color]}
        ${isLocked ? 'opacity-70' : ''}
      `}
      whileHover={!isLocked ? { scale: 1.03, y: -3 } : undefined}
      whileTap={!isLocked ? { scale: 0.98 } : undefined}
      onClick={!isLocked ? onPlay : undefined}
      disabled={isLocked}
    >
      {isLocked && (
        <motion.div 
          className="absolute inset-0 bg-foreground/20 rounded-3xl flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <Lock className="w-10 h-10 text-foreground/60" />
        </motion.div>
      )}
      
      <div className="text-3xl">🎵</div>
      <h3 className="font-bold text-foreground/80 text-center">{title}</h3>
      <StarRating rating={stars} size="sm" animated={false} />
    </motion.button>
  );
};

export default SongCard;
