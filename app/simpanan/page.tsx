'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Bookmark, Clock, Download, Compass, Trash2 } from 'lucide-react';
import { WEBTOON_SERIES, WebtoonSeries } from '@/lib/comics-data';
import { ComicCard } from '@/components/comic/ComicCard';
import { sanitizePosterUrl } from '@/lib/ui-formatters';

export default function SimpananPage() {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<'subs' | 'history' | 'downloads'>('subs');
  const [subscribedSeries, setSubscribedSeries] = useState<WebtoonSeries[]>([]);
  const [historyList, setHistoryList] = useState<any[]>([]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    try {
      const subs = JSON.parse(localStorage.getItem('komakatsu_subs') || '[]');
      if (subs.length > 0) {
        setSubscribedSeries(WEBTOON_SERIES.filter((s) => subs.includes(s.slug)));
      } else {
        setSubscribedSeries([WEBTOON_SERIES[0], WEBTOON_SERIES[1]]);
      }
    } catch {
      setSubscribedSeries([WEBTOON_SERIES[0], WEBTOON_SERIES[1]]);
    }

    try {
      const hist = JSON.parse(localStorage.getItem('komakatsu_reading_history') || '[]');
      if (hist.length > 0) {
        setHistoryList(hist);
      } else {
        setHistoryList([
          {
            slug: 'solo-leveling-ragnarok',
            title: 'Solo Leveling: Ragnarok',
            poster: WEBTOON_SERIES[0].poster,
            chapter_number: 14,
            chapter_title: 'Episode 14: Pertemuan Bayangan',
            timestamp: 1729700000000,
          },
        ]);
      }
    } catch {
      setHistoryList([]);
    }
  }, []);

  const clearHistory = () => {
    localStorage.removeItem('komakatsu_reading_history');
    setHistoryList([]);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg)] text-[var(--text)] transition-colors">
      <Header />

      <main className="flex-1 w-full max-w-[1200px] mx-auto px-4 md:px-6 py-4 md:py-6">
        <div className="mb-6">
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-[var(--text)]">
            Simpanan Saya
          </h1>
          <p className="text-[13px] text-[var(--text-muted)] mt-1">
            Kelola komik favorit, riwayat baca, dan episode tersimpan.
          </p>
        </div>

        {/* Tabs: Langganan · Riwayat · Unduhan */}
        <div className="flex items-center gap-6 border-b border-[var(--border)] mb-6">
          <button
            onClick={() => setActiveTab('subs')}
            className={`pb-3 text-[14px] font-semibold transition-colors flex items-center gap-2 relative ${
              activeTab === 'subs'
                ? 'text-[var(--text)]'
                : 'text-[var(--text-muted)] hover:text-[var(--text)]'
            }`}
          >
            <Bookmark className="w-4 h-4" />
            <span>Langganan ({subscribedSeries.length})</span>
            {activeTab === 'subs' && (
              <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[var(--primary)]" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`pb-3 text-[14px] font-semibold transition-colors flex items-center gap-2 relative ${
              activeTab === 'history'
                ? 'text-[var(--text)]'
                : 'text-[var(--text-muted)] hover:text-[var(--text)]'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Riwayat Baca ({historyList.length})</span>
            {activeTab === 'history' && (
              <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[var(--primary)]" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('downloads')}
            className={`pb-3 text-[14px] font-semibold transition-colors flex items-center gap-2 relative ${
              activeTab === 'downloads'
                ? 'text-[var(--text)]'
                : 'text-[var(--text-muted)] hover:text-[var(--text)]'
            }`}
          >
            <Download className="w-4 h-4" />
            <span>Unduhan Offline</span>
            {activeTab === 'downloads' && (
              <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[var(--primary)]" />
            )}
          </button>
        </div>

        {/* Tab 1: Subscriptions Grid */}
        {activeTab === 'subs' && (
          <div>
            {subscribedSeries.length > 0 ? (
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3 sm:gap-4">
                {subscribedSeries.map((s) => (
                  <ComicCard key={s.id} series={s} showUpBadge={s.isUpToday} />
                ))}
              </div>
            ) : (
              <div className="py-16 text-center text-[var(--text-muted)] bg-[var(--bg-subtle)] rounded-[6px] border border-[var(--border)] p-6">
                <Bookmark className="w-10 h-10 mx-auto text-[var(--text-muted)] mb-3" />
                <h3 className="text-[15px] font-bold text-[var(--text)] mb-1">
                  Belum ada komik yang dilanggan
                </h3>
                <p className="text-[13px] text-[var(--text-muted)] mb-4 max-w-sm mx-auto">
                  Tekan tombol Langganan pada halaman komik agar kamu tidak ketinggalan episode baru.
                </p>
                <Link
                  href="/genre"
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-[var(--primary)] hover:opacity-90 text-white text-[13px] font-semibold rounded-lg transition-opacity"
                >
                  <Compass className="w-4 h-4" />
                  <span>Jelajahi Komik</span>
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Reading History */}
        {activeTab === 'history' && (
          <div>
            {historyList.length > 0 && (
              <div className="flex justify-end mb-3">
                <button
                  onClick={clearHistory}
                  className="flex items-center gap-1 text-[12px] font-semibold text-[var(--danger)] hover:underline"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Hapus Riwayat</span>
                </button>
              </div>
            )}

            {historyList.length > 0 ? (
              <div className="divide-y divide-[var(--border)] border-t border-b border-[var(--border)]">
                {historyList.map((item, idx) => (
                  <Link
                    key={`${item.slug}-${idx}`}
                    href={`/series/${item.slug}/episode/${item.chapter_number}`}
                    className="flex items-center justify-between py-3 px-2 rounded-[4px] hover:bg-[var(--bg-subtle)] transition-colors group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="relative w-12 h-16 rounded-[3px] overflow-hidden bg-[var(--bg-subtle)] flex-shrink-0 border border-[var(--border)]">
                        <Image
                          src={sanitizePosterUrl(item.poster)}
                          alt={item.title}
                          fill
                          unoptimized
                          sizes="48px"
                          className="object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-[14px] font-semibold text-[var(--text)] truncate group-hover:text-[var(--primary)]">
                          {item.title}
                        </h4>
                        <p className="text-[12px] text-[var(--text-muted)] mt-0.5">
                          {item.chapter_title}
                        </p>
                      </div>
                    </div>
                    <span className="px-3 py-1.5 bg-[var(--primary)] text-white text-[12px] font-semibold rounded-md">
                      Lanjutkan
                    </span>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="py-16 text-center text-[var(--text-muted)] bg-[var(--bg-subtle)] rounded-lg border border-[var(--border)] p-6">
                <Clock className="w-10 h-10 mx-auto text-[var(--text-muted)] mb-3" />
                <h3 className="text-[15px] font-bold text-[var(--text)] mb-1">
                  Riwayat baca kosong
                </h3>
                <p className="text-[13px] text-[var(--text-muted)] mb-4">
                  Episode yang kamu baca akan otomatis tersimpan di sini.
                </p>
                <Link
                  href="/"
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-[var(--primary)] hover:opacity-90 text-white text-[13px] font-semibold rounded-lg"
                >
                  Mulai Membaca
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Downloads */}
        {activeTab === 'downloads' && (
          <div className="py-16 text-center text-[var(--text-muted)] bg-[var(--bg-subtle)] rounded-[6px] border border-[var(--border)] p-6">
            <Download className="w-10 h-10 mx-auto text-[var(--text-muted)] mb-3" />
            <h3 className="text-[15px] font-bold text-[var(--text)] mb-1">
              Belum ada episode diunduh
            </h3>
            <p className="text-[13px] text-[var(--text-muted)] max-w-sm mx-auto">
              Fitur unduhan offline memungkinkan membaca chapter tanpa sambungan internet.
            </p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
