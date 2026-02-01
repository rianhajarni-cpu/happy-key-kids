import { motion } from 'framer-motion';
import { Lock } from 'lucide-react';
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
        relative w-full rounded-2xl p-4 shadow-card
        flex flex-col items-center gap-2
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
          className="absolute inset-0 bg-foreground/20 rounded-2xl flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <Lock className="w-8 h-8 text-foreground/60" />
        </motion.div>
      )}
      
      <div className="text-2xl">🎵</div>
      <h3 className="font-bold text-sm text-foreground/80 text-center leading-tight">{title}</h3>
      {stars > 0 && <StarRating rating={stars} size="sm" animated={false} />}
    </motion.button>
  );
};

export default SongCard;
