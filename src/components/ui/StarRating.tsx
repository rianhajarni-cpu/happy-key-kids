import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  maxStars?: number;
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
}

const StarRating = ({ 
  rating, 
  maxStars = 3, 
  size = 'md',
  animated = true 
}: StarRatingProps) => {
  const sizeClasses = {
    sm: 'w-5 h-5',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div className="flex gap-1">
      {Array.from({ length: maxStars }).map((_, index) => {
        const isFilled = index < rating;
        return (
          <motion.div
            key={index}
            initial={animated && isFilled ? { scale: 0, rotate: -45 } : false}
            animate={animated && isFilled ? { scale: 1, rotate: 0 } : false}
            transition={{ 
              delay: index * 0.15, 
              type: 'spring', 
              stiffness: 300,
              damping: 15 
            }}
          >
            <Star
              className={`${sizeClasses[size]} ${
                isFilled ? 'star-filled fill-star' : 'star-empty'
              }`}
            />
          </motion.div>
        );
      })}
    </div>
  );
};

export default StarRating;
