'use client';

import { DAYS_OF_WEEK, DayKey } from '@/lib/comics-data';

interface DayTabsProps {
  selectedDay: DayKey;
  onSelectDay: (day: DayKey) => void;
  todayKey: DayKey;
}

export function DayTabs({ selectedDay, onSelectDay, todayKey }: DayTabsProps) {
  return (
    <div className="w-full mb-5 border-b border-[var(--border)]">
      <div
        role="tablist"
        aria-label="Jadwal rilis harian"
        className="flex items-center gap-1 sm:gap-2 overflow-x-auto no-scrollbar"
      >
        {DAYS_OF_WEEK.map((day) => {
          const isSelected = selectedDay === day.key;
          const isToday = todayKey === day.key && day.key !== 'TAMAT';

          return (
            <button
              key={day.key}
              type="button"
              role="tab"
              aria-selected={isSelected}
              aria-label={`Jadwal komik hari ${day.full}`}
              onClick={() => onSelectDay(day.key)}
              className={`relative px-3.5 py-2.5 text-xs sm:text-sm font-semibold whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                isSelected
                  ? 'text-[var(--foreground)]'
                  : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
              }`}
            >
              <span>{day.label}</span>
              {isToday && (
                <span className="ml-1.5 text-[10px] font-bold text-[var(--primary)]">
                  Hari Ini
                </span>
              )}
              {isSelected && (
                <span
                  aria-hidden="true"
                  className="absolute bottom-0 inset-x-0 h-[2px] bg-[var(--primary)]"
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
