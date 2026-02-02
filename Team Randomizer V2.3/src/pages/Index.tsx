import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shuffle, Copy, FileDown, Users, Sparkles, Check, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import DraggableTeamCard from '@/components/DraggableTeamCard';
import ShuffleAnimation from '@/components/ShuffleAnimation';
import ThemeToggle from '@/components/ThemeToggle';
import PresetManager from '@/components/PresetManager';
import DuplicateWarning from '@/components/DuplicateWarning';
import CustomGroupNames from '@/components/CustomGroupNames';
import ConfettiEffect from '@/components/ConfettiEffect';
import { divideIntoGroups } from '@/lib/fisherYatesShuffle';
import { exportToWord } from '@/lib/exportToWord';

const Index = () => {
  const [names, setNames] = useState('');
  const [numGroups, setNumGroups] = useState(2);
  const [groups, setGroups] = useState<string[][]>([]);
  const [isShuffling, setIsShuffling] = useState(false);
  const [copied, setCopied] = useState(false);
  const [groupNames, setGroupNames] = useState<string[]>([]);
  const [showCustomNames, setShowCustomNames] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const parseNames = (input: string): string[] => {
    return input
      .split(/[\n,]+/)
      .map((name) => name.trim())
      .filter((name) => name.length > 0);
  };

  // Detect duplicates
  const { nameList, duplicates } = useMemo(() => {
    const parsed = parseNames(names);
    const seen = new Map<string, number>();
    const dups: string[] = [];
    
    parsed.forEach((name) => {
      const lower = name.toLowerCase();
      const count = seen.get(lower) || 0;
      seen.set(lower, count + 1);
      if (count === 1) {
        dups.push(name);
      }
    });
    
    return { nameList: parsed, duplicates: dups };
  }, [names]);

  const handleGroupNameChange = (index: number, name: string) => {
    const newNames = [...groupNames];
    newNames[index] = name;
    setGroupNames(newNames);
  };

  const handleRandomize = () => {
    if (nameList.length < 2) {
      toast.error('Masukkan minimal 2 nama!');
      return;
    }
    
    if (numGroups < 1) {
      toast.error('Jumlah kelompok minimal 1!');
      return;
    }
    
    if (numGroups > nameList.length) {
      toast.error('Jumlah kelompok tidak boleh lebih dari jumlah nama!');
      return;
    }

    setIsShuffling(true);
    setGroups([]);
    setShowConfetti(false);

    setTimeout(() => {
      const result = divideIntoGroups(nameList, numGroups);
      setGroups(result);
      setIsShuffling(false);
      setShowConfetti(true);
      toast.success('Pembagian kelompok berhasil!');
    }, 2000);
  };

  const handleDrop = (memberName: string, fromGroup: number, toGroup: number) => {
    setGroups((prevGroups) => {
      const newGroups = prevGroups.map((g) => [...g]);
      
      // Remove from source group
      const memberIndex = newGroups[fromGroup].indexOf(memberName);
      if (memberIndex > -1) {
        newGroups[fromGroup].splice(memberIndex, 1);
      }
      
      // Add to target group
      newGroups[toGroup].push(memberName);
      
      return newGroups;
    });
    
    toast.success(`${memberName} dipindahkan ke ${groupNames[toGroup]?.trim() || `Kelompok ${toGroup + 1}`}`);
  };

  const getGroupDisplayName = (index: number) => {
    return groupNames[index]?.trim() || `Kelompok ${index + 1}`;
  };

  const handleCopy = async () => {
    const text = groups
      .map((group, idx) => 
        `${getGroupDisplayName(idx)}:\n${group.map((name, i) => `${i + 1}. ${name}`).join('\n')}`
      )
      .join('\n\n');
    
    await navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success('Hasil disalin ke clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExport = async () => {
    try {
      const customNames = groups.map((_, idx) => getGroupDisplayName(idx));
      await exportToWord(groups, customNames);
      toast.success('File Word berhasil diunduh!');
    } catch {
      toast.error('Gagal mengunduh file');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100 dark:from-gray-900 dark:via-purple-950 dark:to-blue-950 transition-colors duration-300">
      <ConfettiEffect trigger={showConfetti} />
      
      {/* Top Bar */}
      <div className="fixed top-4 right-4 z-50 flex items-center gap-2">
        <ThemeToggle />
      </div>
      
      {/* Header */}
      <header className="pt-8 pb-4 px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="inline-flex items-center gap-3 mb-2">
            <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-3 rounded-2xl shadow-lg">
              <Users className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
              Team Randomizer
            </h1>
            <Sparkles className="w-6 h-6 text-yellow-500" />
          </div>
          <p className="text-muted-foreground text-lg">
            Bagi tim secara acak dengan mudah! 🎲
          </p>
        </motion.div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 pb-12">
        {/* Input Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card/80 backdrop-blur-sm rounded-3xl shadow-xl p-6 md:p-8 mb-8 border border-border"
        >
          <div className="grid md:grid-cols-2 gap-6">
            {/* Names Input */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-lg font-semibold text-foreground">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-lg flex items-center justify-center">
                    <span className="text-white text-sm">📝</span>
                  </div>
                  Daftar Nama
                </label>
                <PresetManager 
                  currentNames={names} 
                  onLoadPreset={(loadedNames) => setNames(loadedNames)} 
                />
              </div>
              <Textarea
                placeholder="Masukkan nama-nama di sini...&#10;Contoh:&#10;Deni&#10;Budi&#10;Siti&#10;Dewi"
                value={names}
                onChange={(e) => setNames(e.target.value)}
                className="min-h-[200px] text-base border-2 border-border focus:border-primary rounded-xl resize-none bg-background"
              />
              <p className="text-sm text-muted-foreground">
                {nameList.length > 0 ? (
                  <span className="text-primary font-medium">
                    ✓ {nameList.length} nama terdeteksi
                  </span>
                ) : (
                  'Pisahkan nama dengan baris baru atau koma'
                )}
              </p>
              <AnimatePresence>
                <DuplicateWarning duplicates={duplicates} />
              </AnimatePresence>
            </div>

            {/* Settings */}
            <div className="space-y-6">
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-lg font-semibold text-foreground">
                  <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-emerald-500 rounded-lg flex items-center justify-center">
                    <span className="text-white text-sm">👥</span>
                  </div>
                  Jumlah Kelompok
                </label>
                <Input
                  type="number"
                  min={1}
                  max={50}
                  value={numGroups}
                  onChange={(e) => setNumGroups(Math.max(1, parseInt(e.target.value) || 1))}
                  className="text-2xl font-bold text-center h-14 border-2 border-border focus:border-primary rounded-xl bg-background"
                />
              </div>

              {/* Custom Group Names Toggle */}
              <Button
                variant="ghost"
                onClick={() => setShowCustomNames(!showCustomNames)}
                className="w-full justify-between text-muted-foreground hover:text-foreground"
              >
                <span>Nama kelompok custom</span>
                {showCustomNames ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </Button>

              <AnimatePresence>
                {showCustomNames && (
                  <CustomGroupNames
                    numGroups={numGroups}
                    groupNames={groupNames}
                    onGroupNameChange={handleGroupNameChange}
                  />
                )}
              </AnimatePresence>

              {nameList.length > 0 && numGroups > 0 && numGroups <= nameList.length && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/30 dark:to-pink-900/30 rounded-xl p-4 border-2 border-purple-200 dark:border-purple-700"
                >
                  <p className="text-foreground">
                    <span className="font-semibold text-purple-600 dark:text-purple-400">{nameList.length} nama</span>
                    {' '}akan dibagi ke{' '}
                    <span className="font-semibold text-pink-600 dark:text-pink-400">{numGroups} kelompok</span>
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    ≈ {Math.floor(nameList.length / numGroups)}-{Math.ceil(nameList.length / numGroups)} orang per kelompok
                  </p>
                </motion.div>
              )}

              <Button
                onClick={handleRandomize}
                disabled={isShuffling || nameList.length < 2}
                className="w-full h-14 text-lg font-bold bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 hover:from-purple-600 hover:via-pink-600 hover:to-blue-600 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
              >
                <Shuffle className="w-5 h-5 mr-2" />
                {isShuffling ? 'Mengacak...' : 'Randomize! 🎲'}
              </Button>
            </div>
          </div>
        </motion.section>

        {/* Shuffle Animation */}
        <AnimatePresence>
          {isShuffling && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="bg-card/80 backdrop-blur-sm rounded-3xl shadow-xl mb-8 border border-border"
            >
              <ShuffleAnimation />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results Section */}
        <AnimatePresence>
          {groups.length > 0 && !isShuffling && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              {/* Drag & Drop Hint */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center text-sm text-muted-foreground mb-4"
              >
                💡 Tip: Drag & drop anggota untuk memindahkan antar kelompok
              </motion.p>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 mb-6 justify-center">
                <Button
                  onClick={handleRandomize}
                  variant="outline"
                  className="rounded-xl border-2 border-purple-300 hover:bg-purple-50 dark:hover:bg-purple-900/30"
                >
                  <Shuffle className="w-4 h-4 mr-2" />
                  Acak Ulang
                </Button>
                <Button
                  onClick={handleCopy}
                  variant="outline"
                  className="rounded-xl border-2 border-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/30"
                >
                  {copied ? (
                    <Check className="w-4 h-4 mr-2 text-green-500" />
                  ) : (
                    <Copy className="w-4 h-4 mr-2" />
                  )}
                  {copied ? 'Tersalin!' : 'Copy'}
                </Button>
                <Button
                  onClick={handleExport}
                  variant="outline"
                  className="rounded-xl border-2 border-green-300 hover:bg-green-50 dark:hover:bg-green-900/30"
                >
                  <FileDown className="w-4 h-4 mr-2" />
                  Download Word
                </Button>
              </div>

              {/* Team Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {groups.map((group, index) => (
                  <DraggableTeamCard
                    key={index}
                    groupIndex={index}
                    members={group}
                    delay={index * 0.1}
                    customName={groupNames[index]}
                    onDrop={handleDrop}
                    totalGroups={groups.length}
                  />
                ))}
              </div>
            </motion.section>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="text-center py-6 text-muted-foreground text-sm">
        Made by Rezz <br /> @2026 Team Randomizer. All rights rezerved.
      </footer>
    </div>
  );
};

export default Index;
