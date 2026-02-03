import { useEffect } from 'react';
import confetti from 'canvas-confetti';

interface ConfettiEffectProps {
  trigger: boolean;
}

const ConfettiEffect = ({ trigger }: ConfettiEffectProps) => {
  useEffect(() => {
    if (trigger) {
      // Multiple bursts for a more celebratory effect
      const duration = 2000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 1000 };

      const randomInRange = (min: number, max: number) => {
        return Math.random() * (max - min) + min;
      };

      const interval = setInterval(() => {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          clearInterval(interval);
          return;
        }

        const particleCount = 50 * (timeLeft / duration);

        // Left side burst
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
          colors: ['#a855f7', '#ec4899', '#3b82f6', '#10b981', '#f59e0b'],
        });

        // Right side burst
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
          colors: ['#a855f7', '#ec4899', '#3b82f6', '#10b981', '#f59e0b'],
        });
      }, 250);

      return () => clearInterval(interval);
    }
  }, [trigger]);

  return null;
};

export default ConfettiEffect;
