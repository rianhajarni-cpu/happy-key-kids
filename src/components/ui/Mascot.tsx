import { motion } from 'framer-motion';

interface MascotProps {
  emotion?: 'happy' | 'excited' | 'thinking' | 'sleeping';
  size?: 'sm' | 'md' | 'lg';
  animate?: boolean;
}

const Mascot = ({ emotion = 'happy', size = 'md', animate = true }: MascotProps) => {
  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32',
  };

  const getEyeExpression = () => {
    switch (emotion) {
      case 'excited':
        return (
          <>
            <motion.ellipse 
              cx="35" cy="40" rx="6" ry="8" 
              fill="#4A3728"
              animate={animate ? { scaleY: [1, 1.2, 1] } : undefined}
              transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
            />
            <motion.ellipse 
              cx="65" cy="40" rx="6" ry="8" 
              fill="#4A3728"
              animate={animate ? { scaleY: [1, 1.2, 1] } : undefined}
              transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
            />
            <circle cx="37" cy="38" r="2" fill="white" />
            <circle cx="67" cy="38" r="2" fill="white" />
          </>
        );
      case 'thinking':
        return (
          <>
            <ellipse cx="35" cy="42" rx="5" ry="6" fill="#4A3728" />
            <motion.ellipse 
              cx="65" cy="42" rx="5" ry="6" 
              fill="#4A3728"
              animate={animate ? { y: [-2, 2, -2] } : undefined}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </>
        );
      case 'sleeping':
        return (
          <>
            <path d="M30 42 Q35 38, 40 42" stroke="#4A3728" strokeWidth="2" fill="none" />
            <path d="M60 42 Q65 38, 70 42" stroke="#4A3728" strokeWidth="2" fill="none" />
          </>
        );
      default:
        return (
          <>
            <motion.ellipse 
              cx="35" cy="40" rx="5" ry="6" 
              fill="#4A3728"
              animate={animate ? { scaleY: [1, 0.1, 1] } : undefined}
              transition={{ duration: 0.15, repeat: Infinity, repeatDelay: 3 }}
            />
            <motion.ellipse 
              cx="65" cy="40" rx="5" ry="6" 
              fill="#4A3728"
              animate={animate ? { scaleY: [1, 0.1, 1] } : undefined}
              transition={{ duration: 0.15, repeat: Infinity, repeatDelay: 3 }}
            />
            <circle cx="37" cy="38" r="2" fill="white" />
            <circle cx="67" cy="38" r="2" fill="white" />
          </>
        );
    }
  };

  const getMouth = () => {
    switch (emotion) {
      case 'excited':
        return <ellipse cx="50" cy="60" rx="8" ry="6" fill="#4A3728" />;
      case 'thinking':
        return <circle cx="55" cy="58" r="4" fill="#4A3728" />;
      case 'sleeping':
        return <path d="M45 58 Q50 60, 55 58" stroke="#4A3728" strokeWidth="2" fill="none" />;
      default:
        return <path d="M42 55 Q50 65, 58 55" stroke="#4A3728" strokeWidth="2.5" fill="none" strokeLinecap="round" />;
    }
  };

  return (
    <motion.div
      className={`${sizeClasses[size]}`}
      animate={animate ? { y: [0, -5, 0] } : undefined}
      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
    >
      <svg viewBox="0 0 100 100" className="w-full h-full">
        {/* Ears */}
        <circle cx="20" cy="25" r="15" fill="#FFB6A3" />
        <circle cx="20" cy="25" r="8" fill="#FF9B85" />
        <circle cx="80" cy="25" r="15" fill="#FFB6A3" />
        <circle cx="80" cy="25" r="8" fill="#FF9B85" />
        
        {/* Face */}
        <circle cx="50" cy="55" r="38" fill="#FFB6A3" />
        
        {/* Cheeks */}
        <ellipse cx="25" cy="55" rx="8" ry="6" fill="#FF9B85" opacity="0.6" />
        <ellipse cx="75" cy="55" rx="8" ry="6" fill="#FF9B85" opacity="0.6" />
        
        {/* Nose */}
        <ellipse cx="50" cy="50" rx="6" ry="4" fill="#FF8C70" />
        
        {/* Eyes */}
        {getEyeExpression()}
        
        {/* Mouth */}
        {getMouth()}
        
        {/* Music note for excited */}
        {emotion === 'excited' && (
          <motion.g
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: [0, 1, 0], y: [-10, -25] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <text x="75" y="20" fontSize="12" fill="#9B87F5">♪</text>
          </motion.g>
        )}
      </svg>
    </motion.div>
  );
};

export default Mascot;
