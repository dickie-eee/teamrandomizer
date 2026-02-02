import { motion } from 'framer-motion';
import { Shuffle } from 'lucide-react';

const ShuffleAnimation = () => {
  const cards = Array.from({ length: 6 }, (_, i) => i);

  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="relative w-48 h-32">
        {cards.map((_, index) => (
          <motion.div
            key={index}
            className="absolute w-16 h-20 bg-gradient-to-br from-pink-400 to-purple-500 rounded-lg shadow-lg flex items-center justify-center"
            initial={{ 
              x: 64, 
              y: 0, 
              rotate: 0,
              opacity: 1 
            }}
            animate={{
              x: [64, -20, 100, 40, 80, 64],
              y: [0, -30, 20, -20, 10, 0],
              rotate: [0, -30, 45, -15, 20, 0],
              scale: [1, 1.1, 0.9, 1.05, 0.95, 1],
            }}
            transition={{
              duration: 1.5,
              delay: index * 0.1,
              repeat: Infinity,
              repeatType: "loop",
              ease: "easeInOut",
            }}
            style={{ zIndex: cards.length - index }}
          >
            <span className="text-white font-bold text-xl">?</span>
          </motion.div>
        ))}
      </div>
      <motion.div 
        className="mt-8 flex items-center gap-2 text-purple-600 font-semibold"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        <Shuffle className="w-5 h-5" />
        <span>Mengacak nama-nama...</span>
      </motion.div>
    </div>
  );
};

export default ShuffleAnimation;
