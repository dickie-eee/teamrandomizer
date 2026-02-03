import { motion } from 'framer-motion';
import { Edit3 } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface CustomGroupNamesProps {
  numGroups: number;
  groupNames: string[];
  onGroupNameChange: (index: number, name: string) => void;
}

const CustomGroupNames = ({ numGroups, groupNames, onGroupNameChange }: CustomGroupNamesProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className="space-y-3 mt-4"
    >
      <div className="flex items-center gap-2 text-sm font-medium text-foreground">
        <Edit3 className="w-4 h-4" />
        Nama Kelompok (opsional)
      </div>
      <div className="grid grid-cols-2 gap-2 max-h-[200px] overflow-y-auto pr-2">
        {Array.from({ length: numGroups }).map((_, index) => (
          <Input
            key={index}
            placeholder={`Kelompok ${index + 1}`}
            value={groupNames[index] || ''}
            onChange={(e) => onGroupNameChange(index, e.target.value)}
            className="text-sm border-2 border-border focus:border-primary rounded-lg"
          />
        ))}
      </div>
    </motion.div>
  );
};

export default CustomGroupNames;
