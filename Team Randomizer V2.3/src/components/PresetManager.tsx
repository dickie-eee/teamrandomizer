import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Save, FolderOpen, Trash2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { usePresets, Preset } from '@/hooks/usePresets';
import { toast } from 'sonner';

interface PresetManagerProps {
  currentNames: string;
  onLoadPreset: (names: string) => void;
}

const PresetManager = ({ currentNames, onLoadPreset }: PresetManagerProps) => {
  const { presets, addPreset, deletePreset } = usePresets();
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [loadDialogOpen, setLoadDialogOpen] = useState(false);
  const [presetName, setPresetName] = useState('');

  const handleSave = () => {
    if (!presetName.trim()) {
      toast.error('Masukkan nama preset!');
      return;
    }
    if (!currentNames.trim()) {
      toast.error('Tidak ada nama untuk disimpan!');
      return;
    }
    addPreset(presetName.trim(), currentNames);
    toast.success('Preset berhasil disimpan!');
    setPresetName('');
    setSaveDialogOpen(false);
  };

  const handleLoad = (preset: Preset) => {
    onLoadPreset(preset.names);
    toast.success(`Preset "${preset.name}" dimuat!`);
    setLoadDialogOpen(false);
  };

  const handleDelete = (preset: Preset) => {
    deletePreset(preset.id);
    toast.success('Preset dihapus!');
  };

  return (
    <div className="flex gap-2">
      {/* Save Preset Dialog */}
      <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="rounded-lg border-2 border-green-300 hover:bg-green-50 dark:hover:bg-green-900/20"
          >
            <Save className="w-4 h-4 mr-1" />
            Simpan
          </Button>
        </DialogTrigger>
        <DialogContent className="bg-card">
          <DialogHeader>
            <DialogTitle>Simpan Preset Nama</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <Input
              placeholder="Nama preset (misal: Kelas 10A)"
              value={presetName}
              onChange={(e) => setPresetName(e.target.value)}
              className="border-2"
            />
            <Button onClick={handleSave} className="w-full bg-green-500 hover:bg-green-600">
              <Save className="w-4 h-4 mr-2" />
              Simpan Preset
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Load Preset Dialog */}
      <Dialog open={loadDialogOpen} onOpenChange={setLoadDialogOpen}>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="rounded-lg border-2 border-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20"
          >
            <FolderOpen className="w-4 h-4 mr-1" />
            Muat
          </Button>
        </DialogTrigger>
        <DialogContent className="bg-card max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Muat Preset Nama</DialogTitle>
          </DialogHeader>
          <div className="space-y-2 mt-4">
            {presets.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                Belum ada preset tersimpan
              </p>
            ) : (
              <AnimatePresence>
                {presets.map((preset) => (
                  <motion.div
                    key={preset.id}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    className="flex items-center justify-between p-3 bg-muted rounded-lg hover:bg-accent transition-colors"
                  >
                    <button
                      onClick={() => handleLoad(preset)}
                      className="flex-1 text-left"
                    >
                      <p className="font-medium text-foreground">{preset.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {preset.names.split(/[\n,]+/).filter((n) => n.trim()).length} nama
                      </p>
                    </button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(preset)}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PresetManager;
