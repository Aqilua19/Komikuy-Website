'use client';

import { X } from 'lucide-react';
import { ReaderSettingsType } from '@/types/comic';

export function ReaderSettings({ settings, onUpdate, onClose }: {
  settings: ReaderSettingsType;
  onUpdate: (updated: Partial<ReaderSettingsType>) => void;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-surface border border-border rounded-2xl w-full max-w-md p-6 shadow-2xl flex flex-col gap-6">
        <div className="flex items-center justify-between border-b border-border pb-4">
          <h3 className="text-lg font-bold text-foreground">Pengaturan Pembaca</h3>
          <button
            onClick={onClose}
            className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-surface-elevated rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Background mode */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-foreground">Warna Latar Belakang</label>
          <div className="grid grid-cols-4 gap-2">
            {[
              { id: 'dark', label: 'Gelap', bg: 'bg-[#121214]' },
              { id: 'black', label: 'Hitam', bg: 'bg-black' },
              { id: 'sepia', label: 'Sepia', bg: 'bg-[#f4ecd8] text-black' },
              { id: 'light', label: 'Terang', bg: 'bg-white text-black' },
            ].map((m) => (
              <button
                key={m.id}
                onClick={() => onUpdate({ background: m.id as any })}
                className={`py-2 px-3 rounded-lg border text-xs font-medium transition-all ${m.bg} ${
                  settings.background === m.id ? 'border-accent ring-2 ring-accent/20' : 'border-border'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>

        {/* Width mode */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-foreground">Lebar Halaman</label>
          <div className="grid grid-cols-4 gap-2">
            {[
              { id: 'compact', label: 'Kecil' },
              { id: 'normal', label: 'Normal' },
              { id: 'wide', label: 'Lebar' },
              { id: 'full', label: 'Penuh' },
            ].map((w) => (
              <button
                key={w.id}
                onClick={() => onUpdate({ imageWidth: w.id as any })}
                className={`py-2 px-2 rounded-lg border text-xs font-medium transition-all ${
                  settings.imageWidth === w.id
                    ? 'bg-accent text-white border-accent'
                    : 'bg-surface-elevated text-foreground border-border hover:bg-border'
                }`}
              >
                {w.label}
              </button>
            ))}
          </div>
        </div>

        {/* Page gap */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-foreground">Jarak Antar Gambar</label>
          <div className="grid grid-cols-4 gap-2">
            {[
              { id: 'none', label: '0px' },
              { id: 'small', label: 'Kecil' },
              { id: 'medium', label: 'Sedang' },
              { id: 'large', label: 'Besar' },
            ].map((g) => (
              <button
                key={g.id}
                onClick={() => onUpdate({ pageGap: g.id as any })}
                className={`py-2 px-2 rounded-lg border text-xs font-medium transition-all ${
                  settings.pageGap === g.id
                    ? 'bg-accent text-white border-accent'
                    : 'bg-surface-elevated text-foreground border-border hover:bg-border'
                }`}
              >
                {g.label}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 bg-foreground text-background font-medium rounded-xl hover:opacity-90 transition-opacity mt-2"
        >
          Selesai
        </button>
      </div>
    </div>
  );
}
