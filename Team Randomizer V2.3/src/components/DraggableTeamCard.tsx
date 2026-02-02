import { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, GripVertical } from 'lucide-react';

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

interface DraggableTeamCardProps {
  groupIndex: number;
  members: string[];
  delay: number;
  customName?: string;
  onDrop: (memberName: string, fromGroup: number, toGroup: number) => void;
  totalGroups: number;
}

const DraggableTeamCard = ({ 
  groupIndex, 
  members, 
  delay, 
  customName,
  onDrop,
}: DraggableTeamCardProps) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const colorClass = teamColors[groupIndex % teamColors.length];
  const displayName = customName?.trim() || `Kelompok ${groupIndex + 1}`;

  const handleDragStart = (e: React.DragEvent, memberName: string) => {
    e.dataTransfer.setData('memberName', memberName);
    e.dataTransfer.setData('fromGroup', groupIndex.toString());
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const memberName = e.dataTransfer.getData('memberName');
    const fromGroup = parseInt(e.dataTransfer.getData('fromGroup'));
    
    if (fromGroup !== groupIndex) {
      onDrop(memberName, fromGroup, groupIndex);
    }
  };

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
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className={`bg-gradient-to-br ${colorClass} rounded-2xl p-1 shadow-lg hover:shadow-xl transition-all duration-300 ${isDragOver ? 'ring-4 ring-white/50 scale-105' : ''}`}>
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
              <li
                key={idx}
                draggable
                onDragStart={(e) => handleDragStart(e, member)}
                className="flex items-center gap-2 text-foreground cursor-grab active:cursor-grabbing hover:bg-muted/50 rounded-lg px-1 py-0.5 transition-colors"
              >
                <GripVertical className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className={`w-6 h-6 bg-gradient-to-br ${colorClass} rounded-full flex items-center justify-center text-white text-xs font-medium flex-shrink-0`}>
                  {idx + 1}
                </span>
                <span className="truncate">{member}</span>
              </li>
            ))}
          </ul>
          {isDragOver && (
            <div className="mt-2 border-2 border-dashed border-white/50 rounded-lg p-2 text-center text-sm text-muted-foreground">
              Drop di sini
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default DraggableTeamCard;
