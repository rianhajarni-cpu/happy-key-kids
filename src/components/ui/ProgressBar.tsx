import { motion } from 'framer-motion';

interface ProgressBarProps {
  value: number;
  max?: number;
  showLabel?: boolean;
  color?: 'primary' | 'secondary' | 'accent' | 'success';
  size?: 'sm' | 'md' | 'lg';
}

const ProgressBar = ({ 
  value, 
  max = 100, 
  showLabel = false,
  color = 'primary',
  size = 'md',
}: ProgressBarProps) => {
  const percentage = Math.min((value / max) * 100, 100);
  
  const colorClasses = {
    primary: 'bg-gradient-primary',
    secondary: 'bg-gradient-secondary',
    accent: 'bg-gradient-accent',
    success: 'bg-success',
  };

  const sizeClasses = {
    sm: 'h-2',
    md: 'h-4',
    lg: 'h-6',
  };

  return (
    <div className="w-full">
      <div className={`w-full bg-muted rounded-full overflow-hidden ${sizeClasses[size]}`}>
        <motion.div
          className={`h-full rounded-full ${colorClasses[color]}`}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>
      {showLabel && (
        <p className="text-center text-sm font-semibold text-muted-foreground mt-1">
          {value} / {max}
        </p>
      )}
    </div>
  );
};

export default ProgressBar;
