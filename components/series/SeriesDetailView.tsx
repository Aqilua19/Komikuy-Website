'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Star,
  Users,
  Eye,
  Bookmark,
  Share2,
  ArrowUpDown,
  MessageSquare,
  Info,
  List,
  Check,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { WebtoonSeries, WEBTOON_SERIES } from '@/lib/comics-data';
import { ComicCard } from '@/components/comic/ComicCard';

interface SeriesDetailViewProps {
  series: WebtoonSeries;
}

export function SeriesDetailView({ series }: SeriesDetailViewProps) {
  const [activeTab, setActiveTab] = useState<'episodes' | 'info' | 'comments'>('episodes');
  const [sortAscending, setSortAscending] = useState(false);
  const [userState, setUserState] = useState({
    isSubscribed: false,
    readEpisodeIds: [] as number[],
    lastReadEp: null as number | null,
  });
  const [copied, setCopied] = useState(false);
  const [synopsisExpanded, setSynopsisExpanded] = useState(false);

  useEffect(() => {
    try {
      const subs = JSON.parse(localStorage.getItem('komakatsu_subs') || '[]');
      const history = JSON.parse(localStorage.getItem('komakatsu_reading_history') || '[]');
      const readEps: number[] = [];
      let latest: number | null = null;
      for (const item of history) {
        if (item.slug === series.slug) {
          readEps.push(item.chapter_number);
          if (latest === null || item.chapter_number > latest) {
            latest = item.chapter_number;
          }
        }
      }
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setUserState({
        isSubscribed: subs.includes(series.slug),
        readEpisodeIds: readEps,
        lastReadEp: latest,
      });
    } catch {
      // ignore
    }
  }, [series.slug]);

  const { isSubscribed, readEpisodeIds, lastReadEp } = userState;
  const [comments, setComments] = useState<{ id: string; author: string; text: string; date: string; likes: number }[]>([
    {
      id: 'c1',
      author: 'Arya Pratama',
      text: 'Art style chapter ini makin gila! Detail bayangannya benar-benar memanjakan mata.',
      date: '2 jam lalu',
      likes: 142,
    },
    {
      id: 'c2',
      author: 'Siti Nurhaliza',
      text: 'Plot twist di akhir episode bikin merinding, gak sabar nunggu rilis minggu depan!',
      date: '5 jam lalu',
      likes: 98,
    },
    {
      id: 'c3',
      author: 'Budi Santoso',
      text: 'Karakter utama berkembang banget dari episode pertama sampai sekarang.',
      date: '1 hari lalu',
      likes: 67,
    },
  ]);
  const [newComment, setNewComment] = useState('');

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    const c = {
      id: Date.now().toString(),
      author: 'Pembaca Setia',
      text: newComment.trim(),
      date: 'Baru saja',
      likes: 1,
    };
    setComments([c, ...comments]);
    setNewComment('');
  };

  const toggleSubscription = () => {
    try {
      const subs = JSON.parse(localStorage.getItem('komakatsu_subs') || '[]');
      let updated: string[];
      if (isSubscribed) {
        updated = subs.filter((s: string) => s !== series.slug);
      } else {
        updated = [...subs, series.slug];
      }
      localStorage.setItem('komakatsu_subs', JSON.stringify(updated));
      setUserState((prev) => ({ ...prev, isSubscribed: !prev.isSubscribed }));
    } catch {
      setUserState((prev) => ({ ...prev, isSubscribed: !prev.isSubscribed }));
    }
  };

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };



  // Sort episodes
  const sortedEpisodes = [...series.episodes].sort((a, b) => {
    return sortAscending
      ? a.chapter_number - b.chapter_number
      : b.chapter_number - a.chapter_number;
  });

  const firstEpisode = series.episodes[series.episodes.length - 1] || series.episodes[0];
  const targetReadEpisode = lastReadEp ? lastReadEp : firstEpisode.chapter_number;

  const relatedSeries = WEBTOON_SERIES.filter(
    (s) => s.slug !== series.slug && s.genres.some((g) => series.genres.includes(g))
  ).slice(0, 6);

  return (
    <div className="w-full">
      {/* 5.3 Series Header with Cover Blur Backdrop (Only place blur is allowed) */}
      <section className="relative w-full rounded-[6px] overflow-hidden bg-black text-white p-6 sm:p-8 md:p-10 mb-8 border border-[var(--border)]">
        {/* Backdrop Image with strong blur and 50% dark overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src={series.banner || series.poster}
            alt={series.title}
            fill
            priority
            sizes="100vw"
            className="object-cover blur-2xl scale-110 opacity-35"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-black/55" />
        </div>

        {/* Header Content */}
        <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-8">
          {/* 3:4 Cover (Radius 4px) */}
          <div className="relative w-40 sm:w-48 md:w-52 aspect-[3/4] rounded-[4px] overflow-hidden shadow-md flex-shrink-0 border border-white/10 bg-neutral-900">
            <Image
              src={series.poster}
              alt={series.title}
              fill
              priority
              sizes="(max-width: 768px) 192px, 208px"
              className="object-cover"
              referrerPolicy="no-referrer"
            />
          </div>

          {/* Details & Actions */}
          <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[12px] font-semibold text-[var(--primary)] tracking-wide uppercase">
                {series.genres.join(' · ')}
              </span>
              <span className="text-white/40">·</span>
              <span className="text-[12px] text-white/80">
                {series.day === 'TAMAT' ? 'Tamat' : `Update tiap ${series.day}`}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-white leading-tight mb-2">
              {series.title}
            </h1>

            <p className="text-[14px] text-white/80 mb-4">
              Karya <strong className="text-white">{series.author}</strong>
              {series.artist && ` · Gambar oleh ${series.artist}`}
            </p>

            {/* Stats row with uniform Lucide SVG icons */}
            <div className="flex items-center gap-4 text-[13px] text-white/80 mb-6 tabular-nums">
              <div className="flex items-center gap-1.5">
                <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                <span className="font-semibold text-white">{series.rating.toFixed(2)}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Eye className="w-4 h-4 text-white/70" />
                <span>{series.views}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Users className="w-4 h-4 text-white/70" />
                <span>{series.subscribers}</span>
              </div>
            </div>

            {/* Action Row */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 w-full">
              {/* Primary CTA */}
              <Link
                href={`/series/${series.slug}/episode/${targetReadEpisode}`}
                className="h-[44px] px-6 bg-[var(--primary)] hover:opacity-90 text-white text-[14px] font-semibold rounded-lg flex items-center justify-center gap-2 transition-opacity focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
              >
                <span>{lastReadEp ? `Lanjutkan Ep. ${lastReadEp}` : 'Baca Episode 1'}</span>
              </Link>

              {/* Secondary CTA: Langganan */}
              <button
                onClick={toggleSubscription}
                aria-label="Langganan komik"
                className={`h-[44px] px-4 rounded-[6px] border text-[13px] font-semibold flex items-center gap-2 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--accent)] ${
                  isSubscribed
                    ? 'bg-white text-black border-white'
                    : 'bg-transparent text-white border-white/30 hover:bg-white/10'
                }`}
              >
                <Bookmark className={`w-4 h-4 ${isSubscribed ? 'fill-black' : ''}`} />
                <span>{isSubscribed ? 'Berlangganan' : 'Langganan'}</span>
              </button>

              {/* Share button */}
              <button
                onClick={handleShare}
                aria-label="Bagikan komik"
                className="h-[44px] w-[44px] rounded-[6px] border border-white/30 bg-transparent text-white hover:bg-white/10 flex items-center justify-center transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--accent)]"
              >
                {copied ? <Check className="w-4 h-4 text-[var(--accent)]" /> : <Share2 className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Synopsis Section */}
      <section className="bg-[var(--bg-subtle)] border border-[var(--border)] rounded-[6px] p-5 mb-8">
        <h2 className="text-[14px] font-bold text-[var(--text)] mb-2">Sinopsis</h2>
        <p
          className={`text-[13px] sm:text-[14px] text-[var(--text-muted)] leading-relaxed transition-all ${
            synopsisExpanded ? '' : 'line-clamp-3'
          }`}
        >
          {series.synopsis}
        </p>
        <button
          onClick={() => setSynopsisExpanded(!synopsisExpanded)}
          className="mt-2 text-[12px] font-semibold text-[var(--primary)] hover:underline flex items-center gap-1"
        >
          <span>{synopsisExpanded ? 'Tutup sinopsis' : 'Selengkapnya'}</span>
          {synopsisExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </section>

      {/* Tabs Below Header: Episode · Info · Komentar */}
      <div className="w-full border-b border-[var(--border)] mb-6">
        <div className="flex items-center gap-6">
          <button
            onClick={() => setActiveTab('episodes')}
            className={`pb-3 text-[14px] font-semibold transition-colors flex items-center gap-2 relative ${
              activeTab === 'episodes'
                ? 'text-[var(--text)]'
                : 'text-[var(--text-muted)] hover:text-[var(--text)]'
            }`}
          >
            <List className="w-4 h-4" />
            <span>Episode ({series.episodes.length})</span>
            {activeTab === 'episodes' && (
              <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[var(--primary)]" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('info')}
            className={`pb-3 text-[14px] font-semibold transition-colors flex items-center gap-2 relative ${
              activeTab === 'info'
                ? 'text-[var(--text)]'
                : 'text-[var(--text-muted)] hover:text-[var(--text)]'
            }`}
          >
            <Info className="w-4 h-4" />
            <span>Info Series</span>
            {activeTab === 'info' && (
              <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[var(--primary)]" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('comments')}
            className={`pb-3 text-[14px] font-semibold transition-colors flex items-center gap-2 relative ${
              activeTab === 'comments'
                ? 'text-[var(--text)]'
                : 'text-[var(--text-muted)] hover:text-[var(--text)]'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Komentar ({comments.length})</span>
            {activeTab === 'comments' && (
              <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[var(--primary)]" />
            )}
          </button>
        </div>
      </div>

      {/* Tab 1: Episodes List */}
      {activeTab === 'episodes' && (
        <section aria-label="Daftar Episode">
          {/* Controls: Total & Sort Toggle */}
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-[var(--border)]">
            <span className="text-[13px] text-[var(--text-muted)] font-medium">
              Total {series.episodes.length} Episode
            </span>
            <button
              onClick={() => setSortAscending(!sortAscending)}
              className="flex items-center gap-1.5 text-[12px] font-semibold text-[var(--text)] hover:text-[var(--accent)] transition-colors px-2.5 py-1 rounded-[4px] hover:bg-[var(--bg-subtle)]"
            >
              <ArrowUpDown className="w-3.5 h-3.5" />
              <span>{sortAscending ? 'Terlama → Terbaru' : 'Terbaru → Terlama'}</span>
            </button>
          </div>

          {/* Episode rows */}
          <div className="divide-y divide-[var(--border)]">
            {sortedEpisodes.map((ep) => {
              const isRead = readEpisodeIds.includes(ep.chapter_number);

              return (
                <Link
                  key={ep.id}
                  href={`/series/${series.slug}/episode/${ep.chapter_number}`}
                  className={`group flex items-center justify-between py-3 px-2 rounded-[4px] hover:bg-[var(--bg-subtle)] transition-all ${
                    isRead ? 'opacity-50' : 'opacity-100'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {/* Thumbnail */}
                    <div className="relative w-20 sm:w-24 aspect-[16/10] rounded-[3px] overflow-hidden bg-[var(--bg-subtle)] flex-shrink-0 border border-[var(--border)]">
                      <Image
                        src={ep.images[0]?.url || series.poster}
                        alt={ep.title}
                        fill
                        sizes="96px"
                        className="object-cover group-hover:scale-105 transition-transform duration-200"
                        referrerPolicy="no-referrer"
                      />
                    </div>

                    <div className="min-w-0">
                      <h3 className="text-[13px] sm:text-[14px] font-semibold text-[var(--text)] truncate group-hover:text-[var(--accent)] transition-colors">
                        {ep.title}
                      </h3>
                      <div className="flex items-center gap-2 mt-1 text-[11px] text-[var(--text-muted)]">
                        <span>{ep.release_date}</span>
                        <span>·</span>
                        <span>♥ {ep.likes}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-[12px] font-bold text-[var(--text-muted)] flex-shrink-0 ml-3">
                    #{ep.chapter_number}
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* Tab 2: Info Series */}
      {activeTab === 'info' && (
        <section className="bg-[var(--bg-subtle)] border border-[var(--border)] rounded-[6px] p-6 space-y-4">
          <div>
            <h4 className="text-[12px] font-semibold text-[var(--text-muted)] uppercase">Pengarang</h4>
            <p className="text-[14px] font-medium text-[var(--text)] mt-0.5">{series.author}</p>
          </div>
          {series.artist && (
            <div>
              <h4 className="text-[12px] font-semibold text-[var(--text-muted)] uppercase">Ilustrator</h4>
              <p className="text-[14px] font-medium text-[var(--text)] mt-0.5">{series.artist}</p>
            </div>
          )}
          <div>
            <h4 className="text-[12px] font-semibold text-[var(--text-muted)] uppercase">Jadwal Rilis</h4>
            <p className="text-[14px] font-medium text-[var(--text)] mt-0.5">
              Setiap hari {series.day === 'TAMAT' ? 'Telah Tamat' : series.day} jam 22.00 WIB
            </p>
          </div>
          <div>
            <h4 className="text-[12px] font-semibold text-[var(--text-muted)] uppercase">Status Publikasi</h4>
            <p className="text-[14px] font-medium text-[var(--text)] mt-0.5">{series.status}</p>
          </div>
          <div>
            <h4 className="text-[12px] font-semibold text-[var(--text-muted)] uppercase">Genre &amp; Tema</h4>
            <p className="text-[14px] font-medium text-[var(--text)] mt-1">
              {series.genres.join(' · ')}
            </p>
          </div>
        </section>
      )}

      {/* Tab 3: Comments */}
      {activeTab === 'comments' && (
        <section className="space-y-6">
          <form onSubmit={handleAddComment} className="flex flex-col gap-2">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Tulis ulasan atau komentar untuk series ini..."
              rows={3}
              className="w-full p-3 bg-[var(--bg-subtle)] border border-[var(--border)] rounded-lg text-[13px] text-[var(--text)] placeholder-[var(--text-faint)] focus:outline-none focus:border-[var(--primary)] resize-none"
            />
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={!newComment.trim()}
                className="px-4 py-2 bg-[var(--primary)] hover:opacity-90 text-white text-[13px] font-semibold rounded-lg transition-opacity disabled:opacity-50"
              >
                Kirim Komentar
              </button>
            </div>
          </form>

          <div className="divide-y divide-[var(--border)]">
            {comments.map((c) => (
              <div key={c.id} className="py-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[13px] font-bold text-[var(--text)]">{c.author}</span>
                  <span className="text-[11px] text-[var(--text-muted)]">{c.date}</span>
                </div>
                <p className="text-[13px] text-[var(--text)] leading-relaxed">{c.text}</p>
                <div className="mt-1 flex items-center gap-1 text-[11px] text-[var(--text-muted)]">
                  <span>♥ {c.likes} suka</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* "Mungkin kamu suka" Horizontal Shelf */}
      {relatedSeries.length > 0 && (
        <div className="mt-12 pt-8 border-t border-[var(--border)]">
          <h3 className="text-lg font-bold text-[var(--text)] mb-4">
            Mungkin Kamu Suka
          </h3>
          <div className="flex gap-3 sm:gap-4 overflow-x-auto no-scrollbar scroll-smooth snap-x snap-mandatory pb-2 -mx-4 px-4 sm:mx-0 sm:px-0">
            {relatedSeries.map((item) => (
              <div key={item.id} className="flex-shrink-0 w-[120px] sm:w-[150px] md:w-[170px] snap-start">
                <ComicCard series={item} showUpBadge={false} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
