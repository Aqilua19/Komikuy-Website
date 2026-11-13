'use client';

import { useState, useEffect } from 'react';
import {
  WebtoonSeries,
  DayKey,
  getTodayKey,
  getSeriesByDay,
} from '@/lib/comics-data';
import { Comic } from '@/types/comic';
import { HeroCarousel } from './HeroCarousel';
import { DayTabs } from './DayTabs';
import { ComicCard } from '@/components/comic/ComicCard';
import { RankingsSection } from './RankingsSection';
import { GenreHorizontalShelf } from './GenreHorizontalShelf';
import { ContinueReadingShelf } from './ContinueReadingShelf';
import { SectionTitle } from '@/components/common/SectionTitle';

interface HomeClientProps {
  initialSeries: WebtoonSeries[];
  popularComics?: Comic[];
  latestComics?: Comic[];
  serverToday?: DayKey;
}

export function HomeClient({
  initialSeries,
  popularComics = [],
  latestComics = [],
  serverToday = 'JUM',
}: HomeClientProps) {
  const [dayState, setDayState] = useState<{ today: DayKey; selected: DayKey }>({
    today: serverToday,
    selected: serverToday,
  });

  useEffect(() => {
    const clientDay = getTodayKey();
    if (clientDay !== serverToday) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setDayState({ today: clientDay, selected: clientDay });
    }
  }, [serverToday]);

  const todayKey = dayState.today;
  const selectedDay = dayState.selected;
  const setSelectedDay = (day: DayKey) => setDayState((prev) => ({ ...prev, selected: day }));

  const filteredSeries = getSeriesByDay(selectedDay);

  const actionSeries = initialSeries.filter((s) => s.genres.includes('Aksi'));
  const romanceSeries = initialSeries.filter(
    (s) => s.genres.includes('Romansa') || s.genres.includes('Drama')
  );

  return (
    <div className="w-full space-y-12">
      {/* 1. Editorial Comic Spotlight */}
      <HeroCarousel series={initialSeries} />

      {/* 2. Lanjut Baca */}
      <ContinueReadingShelf />

      {/* 3. Komik Populer Live */}
      {popularComics.length > 0 && (
        <section className="w-full" aria-label="Komik Populer">
          <SectionTitle
            title="Komik Terpopuler"
            subtitle="Judul paling banyak dibaca minggu ini"
            seeAllHref="/popular"
          />

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {popularComics.slice(0, 6).map((item, idx) => (
              <ComicCard
                key={item.slug || item.id}
                comic={item}
                rank={idx + 1}
              />
            ))}
          </div>
        </section>
      )}

      {/* 4. Jadwal Rilis Mingguan */}
      <section className="w-full" aria-label={`Jadwal Komik Hari ${selectedDay}`}>
        <SectionTitle
          title="Jadwal Rilis Mingguan"
          subtitle={`${filteredSeries.length} judul tersedia pada hari pilihan`}
        />

        <DayTabs
          selectedDay={selectedDay}
          onSelectDay={setSelectedDay}
          todayKey={todayKey}
        />

        {filteredSeries.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {filteredSeries.map((item) => (
              <ComicCard
                key={item.id}
                series={item}
                showUpBadge={selectedDay === todayKey}
              />
            ))}
          </div>
        ) : (
          <div className="py-12 text-center text-sm text-[var(--muted-foreground)] bg-[var(--card)] rounded-lg border border-[var(--border)]">
            <p>Belum ada pembaruan komik untuk hari {selectedDay}.</p>
          </div>
        )}
      </section>

      {/* 5. Rilis Chapter Terbaru */}
      {latestComics.length > 0 && (
        <section className="w-full" aria-label="Update Terbaru">
          <SectionTitle
            title="Rilis Chapter Terbaru"
            subtitle="Pembaruan bab terbaru hari ini"
            seeAllHref="/latest"
          />

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {latestComics.slice(0, 6).map((item) => (
              <ComicCard
                key={item.slug || item.id}
                comic={item}
                showUpBadge={true}
              />
            ))}
          </div>
        </section>
      )}

      {/* 6. Tangga Peringkat */}
      <RankingsSection />

      {/* 7. Pilihan Genre */}
      <GenreHorizontalShelf
        title="Aksi & Fantasi Pilihan"
        genreSlug="Aksi"
        series={actionSeries}
      />

      <GenreHorizontalShelf
        title="Romansa & Drama Populer"
        genreSlug="Romansa"
        series={romanceSeries}
      />
    </div>
  );
}
