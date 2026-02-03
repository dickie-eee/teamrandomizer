import { motion } from 'framer-motion';
import { Users } from 'lucide-react';

const teamColors = [
  'from-pink-400 to-rose-500',
  'from-blue-400 to-indigo-500',
  'from-green-400 to-emerald-500',
  'from-yellow-400 to-orange-500',
  'from-purple-400 to-violet-500',
  'from-cyan-400 to-teal-500',
  'from-red-400 to-pink-500',
  'from-lime-400 to-green-500',
  'from-amber-400 to-yellow-500',
  'from-fuchsia-400 to-purple-500',
];

interface TeamCardProps {
  groupIndex: number;
  members: string[];
  delay: number;
  customName?: string;
}

const TeamCard = ({ groupIndex, members, delay, customName }: TeamCardProps) => {
  const colorClass = teamColors[groupIndex % teamColors.length];
  const displayName = customName?.trim() || `Kelompok ${groupIndex + 1}`;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, rotateY: 180 }}
      animate={{ opacity: 1, scale: 1, rotateY: 0 }}
      transition={{ 
        duration: 0.6, 
        delay,
        type: "spring",
        stiffness: 100 
      }}
      className="group"
    >
      <div className={`bg-gradient-to-br ${colorClass} rounded-2xl p-1 shadow-lg hover:shadow-xl transition-shadow duration-300`}>
        <div className="bg-card/90 backdrop-blur rounded-xl p-4 h-full">
          <div className="flex items-center gap-2 mb-3">
            <div className={`bg-gradient-to-br ${colorClass} p-2 rounded-lg`}>
              <Users className="w-4 h-4 text-white" />
            </div>
            <h3 className="font-bold text-lg text-foreground">
              {displayName}
            </h3>
            <span className="ml-auto text-sm text-muted-foreground bg-muted px-2 py-1 rounded-full">
              {members.length} orang
            </span>
          </div>
          <ul className="space-y-1.5">
            {members.map((member, idx) => (
              <motion.li
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: delay + 0.1 + idx * 0.05 }}
                className="flex items-center gap-2 text-foreground"
              >
                <span className={`w-6 h-6 bg-gradient-to-br ${colorClass} rounded-full flex items-center justify-center text-white text-xs font-medium`}>
                  {idx + 1}
                </span>
                {member}
              </motion.li>
            ))}
          </ul>
        </div>
      </div>
    </motion.div>
  );
};

export default TeamCard;
