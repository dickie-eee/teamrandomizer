import { motion } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';

interface DuplicateWarningProps {
  duplicates: string[];
}

const DuplicateWarning = ({ duplicates }: DuplicateWarningProps) => {
  if (duplicates.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className="bg-yellow-50 dark:bg-yellow-900/30 border-2 border-yellow-300 dark:border-yellow-600 rounded-xl p-3 mt-2"
    >
      <div className="flex items-start gap-2">
        <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
            Ditemukan nama duplikat!
          </p>
          <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
            {duplicates.slice(0, 5).map((name, i) => (
              <span key={i} className="inline-block bg-yellow-200 dark:bg-yellow-800 px-2 py-0.5 rounded mr-1 mb-1">
                {name}
              </span>
            ))}
            {duplicates.length > 5 && (
              <span className="text-yellow-600 dark:text-yellow-400">
                +{duplicates.length - 5} lainnya
              </span>
            )}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default DuplicateWarning;
