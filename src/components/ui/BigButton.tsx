import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface BigButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'accent' | 'success' | 'fun';
  icon?: ReactNode;
  disabled?: boolean;
  className?: string;
}

const BigButton = ({ 
  children, 
  onClick, 
  variant = 'primary', 
  icon,
  disabled = false,
  className = '',
}: BigButtonProps) => {
  const variants = {
    primary: 'bg-gradient-primary text-primary-foreground',
    secondary: 'bg-gradient-secondary text-secondary-foreground',
    accent: 'bg-gradient-accent text-accent-foreground',
    success: 'bg-success text-success-foreground',
    fun: 'bg-gradient-fun text-primary-foreground',
  };

  return (
    <motion.button
      className={`
        w-full rounded-3xl px-6 py-5 text-lg font-bold shadow-button
        flex items-center justify-center gap-3
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variants[variant]}
        ${className}
      `}
      whileHover={!disabled ? { scale: 1.02, y: -2 } : undefined}
      whileTap={!disabled ? { scale: 0.98 } : undefined}
      onClick={onClick}
      disabled={disabled}
    >
      {icon && (
        <motion.span
          animate={{ rotate: [0, -10, 10, 0] }}
          transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
        >
          {icon}
        </motion.span>
      )}
      {children}
    </motion.button>
  );
};

export default BigButton;
