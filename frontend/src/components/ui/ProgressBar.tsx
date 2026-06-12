import { motion } from 'framer-motion';

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
  showLabel?: boolean;
}

export default function ProgressBar({
  currentStep,
  totalSteps,
  showLabel = true,
}: ProgressBarProps) {
  const percentage = (currentStep / totalSteps) * 100;

  return (
    <div>
      {showLabel && (
        <p className="text-xs text-text-secondary text-right mb-2">
          Step {currentStep} of {totalSteps}
        </p>
      )}
      <div className="w-full bg-app-border rounded-full h-1">
        <motion.div
          className="bg-brand-primary h-1 rounded-full"
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
}
  