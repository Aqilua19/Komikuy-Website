'use client';

import { useAuth } from '@/components/providers/AuthProvider';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ThemeToggle } from '@/components/common/ThemeToggle';
import { User, Bookmark, Clock, LogOut, CheckCircle2, Moon } from 'lucide-react';
import Link from 'next/link';

export default function ProfilPage() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)] text-[var(--foreground)] transition-colors">
      <Header />

      <main className="flex-1 w-full max-w-2xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        {/* Profile Identity */}
        <section className="flex flex-col sm:flex-row items-center sm:items-start gap-5 pb-6 border-b border-[var(--border)]">
          <div className="w-20 h-20 rounded-xl overflow-hidden border border-[var(--border)] bg-[var(--card)] flex items-center justify-center shrink-0">
            {user?.photoURL ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={user.photoURL}
                alt={user.displayName || 'Profil Pengguna'}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            ) : (
              <User className="w-8 h-8 text-[var(--muted-foreground)]" />
            )}
          </div>

          <div className="text-center sm:text-left space-y-1">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <h1 className="font-display text-xl sm:text-2xl font-bold tracking-tight text-[var(--foreground)]">
                {user?.displayName || 'Pembaca Komakuy'}
              </h1>
              <CheckCircle2 className="w-4 h-4 text-[var(--primary)] shrink-0" />
            </div>
            <p className="text-sm text-[var(--muted-foreground)]">
              {user?.email || 'Akun Google Terverifikasi'}
            </p>
            <p className="text-xs text-[var(--muted-foreground)]">
              Akun Komakuy · Sinkronisasi aktif
            </p>
          </div>
        </section>

        {/* Quick Shortcuts */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Link
            href="/simpanan"
            className="press-soft flex items-center gap-3.5 p-4 rounded-xl border border-[var(--border)] bg-[var(--card)] hover:bg-[var(--accent)] transition-colors"
          >
            <Bookmark className="w-5 h-5 text-[var(--primary)] shrink-0" />
            <div>
              <div className="text-sm font-bold text-[var(--foreground)]">Simpanan &amp; Riwayat</div>
              <div className="text-xs text-[var(--muted-foreground)]">Koleksi komik tersimpan</div>
            </div>
          </Link>

          <Link
            href="/anime/history"
            className="press-soft flex items-center gap-3.5 p-4 rounded-xl border border-[var(--border)] bg-[var(--card)] hover:bg-[var(--accent)] transition-colors"
          >
            <Clock className="w-5 h-5 text-[var(--primary)] shrink-0" />
            <div>
              <div className="text-sm font-bold text-[var(--foreground)]">Riwayat Tontonan</div>
              <div className="text-xs text-[var(--muted-foreground)]">Lanjutkan anime &amp; donghua</div>
            </div>
          </Link>
        </div>

        {/* Account Info */}
        <section className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-5 space-y-4">
          <h2 className="text-xs font-bold text-[var(--muted-foreground)] uppercase tracking-wider">
            Informasi Akun
          </h2>

          <div className="space-y-3 text-xs divide-y divide-[var(--border)]">
            <div className="flex items-center justify-between pt-1">
              <span className="text-[var(--muted-foreground)]">Nama</span>
              <span className="font-semibold text-[var(--foreground)]">{user?.displayName || '-'}</span>
            </div>

            <div className="flex items-center justify-between pt-3">
              <span className="text-[var(--muted-foreground)]">Email</span>
              <span className="font-semibold text-[var(--foreground)]">{user?.email || '-'}</span>
            </div>

            <div className="flex items-center justify-between pt-3">
              <span className="text-[var(--muted-foreground)]">ID Pengguna</span>
              <span className="font-mono text-[11px] text-[var(--muted-foreground)] truncate max-w-[200px]">
                {user?.uid || '-'}
              </span>
            </div>

            <div className="flex items-center justify-between pt-3">
              <span className="text-[var(--muted-foreground)]">Metode Masuk</span>
              <span className="font-semibold text-[var(--foreground)]">Google Authentication</span>
            </div>
          </div>
        </section>

        {/* Display Settings */}
        <section className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-5 space-y-3">
          <h2 className="text-xs font-bold text-[var(--muted-foreground)] uppercase tracking-wider">
            Tampilan
          </h2>

          <div className="flex items-center justify-between py-1">
            <div className="flex items-center gap-2.5">
              <Moon className="w-4 h-4 text-[var(--muted-foreground)]" />
              <span className="text-sm text-[var(--foreground)] font-medium">Mode Gelap / Terang</span>
            </div>
            <ThemeToggle />
          </div>
        </section>

        {/* Logout */}
        <button
          type="button"
          onClick={logout}
          className="press-soft w-full flex items-center justify-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 hover:bg-red-500/15 text-red-500 py-3 text-sm font-semibold transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>Keluar dari Akun</span>
        </button>
      </main>

      <Footer />
    </div>
  );
}
