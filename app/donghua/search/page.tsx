'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { DonghuaCard } from '@/components/donghua/DonghuaCard';
import type { SearchResponse } from '@/lib/donghua';

function SearchContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQ = searchParams.get('q') || '';
  const [query, setQuery] = useState(initialQ);
  const [results, setResults] = useState<SearchResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError(null);
    try {
      router.push(`/donghua/search?q=${encodeURIComponent(query.trim())}`);
      const res = await fetch(`/api/donghua/search?q=${encodeURIComponent(query.trim())}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Pencarian gagal.');
      setResults(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2 border-b border-[var(--border)] pb-4">
        <h1 className="font-display text-2xl font-extrabold tracking-tight flex items-center gap-2">
          <i className="fa-solid fa-magnifying-glass text-[var(--primary)]" />
          Pencarian Donghua
        </h1>
        <p className="text-xs text-[var(--muted-foreground)]">
          Cari judul serial donghua favoritmu berdasarkan kata kunci.
        </p>
      </div>

      <form onSubmit={handleSearch} className="flex gap-2 max-w-xl">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Contoh: Battle Through The Heavens, Soul Land..."
          className="flex-1 rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 py-2.5 text-xs text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] outline-none focus:border-[var(--primary)]"
        />
        <button
          type="submit"
          disabled={loading}
          className="press-soft rounded-xl bg-[var(--primary)] text-[var(--primary-foreground)] px-5 py-2.5 text-xs font-bold shadow-sm hover:opacity-95 transition-opacity disabled:opacity-60"
        >
          {loading ? 'Mencari...' : 'Cari'}
        </button>
      </form>

      {error && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-xs text-red-500 text-center">
          {error}
        </div>
      )}

      {results && (
        <div className="space-y-4 pt-4">
          <p className="text-xs text-[var(--muted-foreground)]">
            Ditemukan {results.results.length} hasil untuk &quot;{results.query}&quot;
          </p>

          {results.results.length === 0 ? (
            <div className="py-16 text-center text-xs text-[var(--muted-foreground)]">
              Tidak ada donghua yang ditemukan.
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {results.results.map((card, idx) => (
                <DonghuaCard key={`${card.slug}-${idx}`} card={card} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function DonghuaSearchPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)] text-[var(--foreground)] transition-colors">
      <Header />
      <main className="flex-1 mx-auto max-w-7xl w-full px-4 py-6">
        <Suspense fallback={<div className="py-12 text-center text-xs text-[var(--muted-foreground)]">Memuat pencarian...</div>}>
          <SearchContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
