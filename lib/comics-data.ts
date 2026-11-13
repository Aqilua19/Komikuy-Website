export interface Episode {
  id: string | number;
  chapter_number: number;
  title: string;
  release_date: string;
  views: string;
  likes: string;
  images: { order: number; url: string; fallback_url?: string; alt?: string }[];
}

export interface WebtoonSeries {
  id: string;
  slug: string;
  title: string;
  author: string;
  artist?: string;
  poster: string;
  banner?: string;
  day: 'SEN' | 'SEL' | 'RAB' | 'KAM' | 'JUM' | 'SAB' | 'MIN' | 'TAMAT';
  genres: string[];
  status: 'Ongoing' | 'Tamat' | 'Hiatus';
  rating: number;
  likes: string;
  subscribers: string;
  views: string;
  synopsis: string;
  rankToday: number;
  rankWeek: number;
  rankMonth: number;
  rankDelta: number;
  isUpToday: boolean;
  isNew?: boolean;
  episodes: Episode[];
}

// Authentic direct Komikcast R2 CDN panel images
const SAMPLE_R2_PANELS = [
  'https://direct-stor.berkasdrive.com/komikcast_info/gambar_komik/solo-swordmaster/chapter-23/0001-17014589.jpg',
  'https://direct-stor.berkasdrive.com/komikcast_info/gambar_komik/solo-swordmaster/chapter-23/0002-17014590.jpg',
  'https://direct-stor.berkasdrive.com/komikcast_info/gambar_komik/solo-swordmaster/chapter-23/0003-17014591.jpg',
  'https://direct-stor.berkasdrive.com/komikcast_info/gambar_komik/solo-swordmaster/chapter-23/0004-17014592.jpg',
  'https://direct-stor.berkasdrive.com/komikcast_info/gambar_komik/solo-swordmaster/chapter-23/0005-17014593.jpg',
  'https://direct-stor.berkasdrive.com/komikcast_info/gambar_komik/solo-swordmaster/chapter-23/0006-17014594.jpg',
  'https://direct-stor.berkasdrive.com/komikcast_info/gambar_komik/solo-swordmaster/chapter-23/0007-17014595.jpg',
  'https://direct-stor.berkasdrive.com/komikcast_info/gambar_komik/solo-swordmaster/chapter-23/0008-17014596.jpg',
  'https://direct-stor.berkasdrive.com/komikcast_info/gambar_komik/solo-swordmaster/chapter-23/0009-17014597.jpg',
  'https://direct-stor.berkasdrive.com/komikcast_info/gambar_komik/solo-swordmaster/chapter-23/0010-17014598.jpg',
  'https://direct-stor.berkasdrive.com/komikcast_info/gambar_komik/solo-swordmaster/chapter-23/0011-17014599.jpg',
  'https://direct-stor.berkasdrive.com/komikcast_info/gambar_komik/solo-swordmaster/chapter-23/0012-17014600.jpg',
];

const createPanels = (seriesSlug: string, epNum: number, count = 10) => {
  return Array.from({ length: Math.min(count, SAMPLE_R2_PANELS.length) }, (_, i) => ({
    order: i + 1,
    url: SAMPLE_R2_PANELS[i % SAMPLE_R2_PANELS.length],
    alt: `Panel ${i + 1}`,
  }));
};

export const WEBTOON_SERIES: WebtoonSeries[] = [
  {
    id: '915',
    slug: 'solo-leveling',
    title: 'Solo Leveling',
    author: 'Chugong',
    artist: 'DUBU (REDICE Studio)',
    poster: 'https://direct-stor.berkasdrive.com/komikcast_info/cover_komik/915.webp?v=e21de6c4cd376353b6a597ca19cd1abde276a69351add8dcfbdd90cbd105490a',
    banner: 'https://direct-stor.berkasdrive.com/komikcast_info/cover_komik/915.webp?v=e21de6c4cd376353b6a597ca19cd1abde276a69351add8dcfbdd90cbd105490a',
    day: 'SEN',
    genres: ['Aksi', 'Fantasi', 'Supranatural', 'Adventure'],
    status: 'Tamat',
    rating: 9.92,
    likes: '4,8 jt',
    subscribers: '1,9 jt',
    views: '45,2 jt',
    synopsis: '10 tahun yang lalu, setelah "Gerbang" yang menghubungkan dunia nyata dengan dunia monster terbuka, beberapa orang biasa menerima kekuatan untuk berburu monster. Mereka dikenal sebagai "Hunter". Sung Jin-Woo adalah seorang Hunter tingkat E terlemah yang mempertaruhkan nyawanya di Dungeon level rendah.',
    rankToday: 1,
    rankWeek: 1,
    rankMonth: 1,
    rankDelta: 0,
    isUpToday: true,
    episodes: Array.from({ length: 20 }, (_, i) => {
      const num = 180 - i;
      return {
        id: `sl-${num}`,
        chapter_number: num,
        title: `Chapter ${num}: Shadow Monarch`,
        release_date: `${20 - i} Okt 2026`,
        views: '350 rb',
        likes: '95 rb',
        images: createPanels('solo-leveling', num, 12),
      };
    }),
  },
  {
    id: '7758',
    slug: 'solo-swordmaster',
    title: 'Solo Swordmaster',
    author: 'Vamz Studio',
    artist: 'Spectre Art',
    poster: 'https://direct-stor.berkasdrive.com/komikcast_info/cover_komik/7758.webp?v=5449213967ff64f3b69dd59ccea617622912c44960a2e544887f7c9b9fd38105',
    banner: 'https://direct-stor.berkasdrive.com/komikcast_info/cover_komik/7758.webp?v=5449213967ff64f3b69dd59ccea617622912c44960a2e544887f7c9b9fd38105',
    day: 'SEL',
    genres: ['Aksi', 'Petualangan', 'Fantasi', 'Shounen'],
    status: 'Ongoing',
    rating: 9.85,
    likes: '1,5 jt',
    subscribers: '540 rb',
    views: '12,8 jt',
    synopsis: 'Seorang petarung yang memilih menempuh jalan seorang diri bertekad menguasai ilmu pedang hingga mencapai puncak mutlak, menembus batasan dunia fana demi menaklukkan takdir.',
    rankToday: 2,
    rankWeek: 2,
    rankMonth: 2,
    rankDelta: 1,
    isUpToday: true,
    episodes: Array.from({ length: 23 }, (_, i) => {
      const num = 23 - i;
      return {
        id: `ssm-${num}`,
        chapter_number: num,
        title: `Chapter ${num}`,
        release_date: `${23 - i} Okt 2026`,
        views: '140 rb',
        likes: '48 rb',
        images: createPanels('solo-swordmaster', num, 12),
      };
    }),
  },
  {
    id: '739',
    slug: 'overgeared',
    title: 'Overgeared',
    author: 'Park Saenal',
    artist: 'Silverbin',
    poster: 'https://direct-stor.berkasdrive.com/komikcast_info/cover_komik/739.webp?v=09e95b6ad15364fb2f0d68560587f3236e00ff824d25dadc9d5562042689a6a1',
    banner: 'https://direct-stor.berkasdrive.com/komikcast_info/cover_komik/739.webp?v=09e95b6ad15364fb2f0d68560587f3236e00ff824d25dadc9d5562042689a6a1',
    day: 'RAB',
    genres: ['Aksi', 'Komedi', 'Game', 'Fantasi'],
    status: 'Ongoing',
    rating: 9.78,
    likes: '2,9 jt',
    subscribers: '1,2 jt',
    views: '28,4 jt',
    synopsis: 'Shin Youngwoo menjalani kehidupan miskin dan tidak beruntung, bekerja keras di lokasi konstruksi dan bermain game VR "Satisfy". Suatu hari ia menemukan buku kuno Pagma dan berevolusi menjadi pandai besi legendaris.',
    rankToday: 3,
    rankWeek: 3,
    rankMonth: 3,
    rankDelta: 0,
    isUpToday: true,
    episodes: Array.from({ length: 15 }, (_, i) => {
      const num = 344 - i;
      return {
        id: `og-${num}`,
        chapter_number: num,
        title: `Chapter ${num}: Kekuatan Item Legendaris`,
        release_date: `${18 - i} Okt 2026`,
        views: '210 rb',
        likes: '72 rb',
        images: createPanels('overgeared', num, 10),
      };
    }),
  },
  {
    id: '2300',
    slug: 'magic-emperormagic-emperor',
    title: 'Magic Emperor',
    author: 'Nightingale',
    artist: 'Wuer Manhua',
    poster: 'https://direct-stor.berkasdrive.com/komikcast_info/cover_komik/2300.webp?v=50a736aeac989bb904ea285e5ea271ab7d63837bfd7fe15b3b6703e78e58e805',
    banner: 'https://direct-stor.berkasdrive.com/komikcast_info/cover_komik/2300.webp?v=50a736aeac989bb904ea285e5ea271ab7d63837bfd7fe15b3b6703e78e58e805',
    day: 'KAM',
    genres: ['Aksi', 'Fantasi', 'Martial Arts', 'Reinkarnasi'],
    status: 'Ongoing',
    rating: 9.86,
    likes: '3,8 jt',
    subscribers: '1,4 jt',
    views: '41,0 jt',
    synopsis: 'Zhuo Yifan, Kaisar Iblis terkuat, dikhianati dan dibunuh oleh murid kepercayaannya. Rohnya bereinkarnasi ke tubuh pelayan lemah bernama Zhuo Fan dari klan Luo yang terpuruk.',
    rankToday: 4,
    rankWeek: 4,
    rankMonth: 4,
    rankDelta: -1,
    isUpToday: true,
    episodes: Array.from({ length: 15 }, (_, i) => {
      const num = 925 - i;
      return {
        id: `me-${num}`,
        chapter_number: num,
        title: `Chapter ${num}`,
        release_date: `${22 - i} Okt 2026`,
        views: '280 rb',
        likes: '88 rb',
        images: createPanels('magic-emperor', num, 10),
      };
    }),
  },
  {
    id: '239',
    slug: 'one-piecee',
    title: 'One Piece',
    author: 'Eiichiro Oda',
    artist: 'Eiichiro Oda',
    poster: 'https://direct-stor.berkasdrive.com/komikcast_info/cover_komik/239.webp?v=9ce245d1cb0dbe872ceb774658792e4351090d1cd48befa5888d3af781cf8c1a',
    banner: 'https://direct-stor.berkasdrive.com/komikcast_info/cover_komik/239.webp?v=9ce245d1cb0dbe872ceb774658792e4351090d1cd48befa5888d3af781cf8c1a',
    day: 'MIN',
    genres: ['Aksi', 'Petualangan', 'Komedi', 'Shounen'],
    status: 'Ongoing',
    rating: 9.95,
    likes: '5,5 jt',
    subscribers: '2,3 jt',
    views: '65,0 jt',
    synopsis: 'Monkey D. Luffy menolak membiarkan siapapun menghalangi mimpinya menjadi Raja Bajak Laut. Menjelajahi lautan berbahaya Grand Line bersama kru Topi Jerami untuk menemukan harta karun legendaris One Piece.',
    rankToday: 5,
    rankWeek: 5,
    rankMonth: 5,
    rankDelta: 2,
    isUpToday: true,
    episodes: Array.from({ length: 15 }, (_, i) => {
      const num = 1196 - i;
      return {
        id: `op-${num}`,
        chapter_number: num,
        title: `Chapter ${num}`,
        release_date: `${21 - i} Okt 2026`,
        views: '420 rb',
        likes: '130 rb',
        images: createPanels('one-piecee', num, 10),
      };
    }),
  },
  {
    id: '7773',
    slug: 'the-return-of-the-scorned-genius',
    title: 'The Return of the Scorned Genius',
    author: 'Redice Group',
    artist: 'K-Studio',
    poster: 'https://direct-stor.berkasdrive.com/komikcast_info/cover_komik/7773.webp?v=e0fa36d002b7ab3e6baf4e42ec663b78e44671f3d2bdde7465025f23e7cb7116',
    banner: 'https://direct-stor.berkasdrive.com/komikcast_info/cover_komik/7773.webp?v=e0fa36d002b7ab3e6baf4e42ec663b78e44671f3d2bdde7465025f23e7cb7116',
    day: 'JUM',
    genres: ['Aksi', 'Fantasi', 'Reinkarnasi', 'Manhwa'],
    status: 'Ongoing',
    rating: 9.81,
    likes: '1,4 jt',
    subscribers: '480 rb',
    views: '11,2 jt',
    synopsis: 'Dihina dan dibuang oleh keluarganya sendiri karena dianggap tidak berbakat, sang jenius sejati kembali dengan kekuatan melampaui para dewa untuk menuntut keadilan.',
    rankToday: 6,
    rankWeek: 6,
    rankMonth: 6,
    rankDelta: 0,
    isUpToday: true,
    episodes: Array.from({ length: 15 }, (_, i) => {
      const num = 26 - i;
      return {
        id: `rsg-${num}`,
        chapter_number: num,
        title: `Chapter ${num}`,
        release_date: `${19 - i} Okt 2026`,
        views: '160 rb',
        likes: '55 rb',
        images: createPanels('the-return-of-the-scorned-genius', num, 10),
      };
    }),
  },
  {
    id: '1078',
    slug: 'the-god-of-high-school',
    title: 'The God of High School',
    author: 'Yongje Park',
    artist: 'Yongje Park',
    poster: 'https://direct-stor.berkasdrive.com/komikcast_info/cover_komik/1078.webp?v=9787224b9da6df7508281fec7ea5e28df38bd1111a1b7c831762b5ea0d8fd3a4',
    banner: 'https://direct-stor.berkasdrive.com/komikcast_info/cover_komik/1078.webp?v=9787224b9da6df7508281fec7ea5e28df38bd1111a1b7c831762b5ea0d8fd3a4',
    day: 'SAB',
    genres: ['Aksi', 'Bela Diri', 'Supranatural', 'Shounen'],
    status: 'Tamat',
    rating: 9.94,
    likes: '3,2 jt',
    subscribers: '1,3 jt',
    views: '38,7 jt',
    synopsis: 'Mori Jin, seorang praktisi Taekwondo Re-Taekwondo, diundang ke turnamen pertarungan bela diri antarpelajar SMA paling bergengsi "The God of High School" yang menjanjikan pengabulan satu permintaan pemenang.',
    rankToday: 7,
    rankWeek: 7,
    rankMonth: 7,
    rankDelta: 1,
    isUpToday: true,
    episodes: Array.from({ length: 15 }, (_, i) => {
      const num = 526 - i;
      return {
        id: `goh-${num}`,
        chapter_number: num,
        title: `Chapter ${num}: Puncak Dewa`,
        release_date: `${17 - i} Okt 2026`,
        views: '240 rb',
        likes: '80 rb',
        images: createPanels('the-god-of-high-school', num, 10),
      };
    }),
  },
  {
    id: '2029',
    slug: 'i-randomly-have-a-new-career-every-week',
    title: 'I Randomly Have A New Career Every Week',
    author: 'Baozou Manga',
    artist: 'Studio 9',
    poster: 'https://direct-stor.berkasdrive.com/komikcast_info/cover_komik/2029.webp?v=8669c22dee4115bcc96235461779a0ada6c57e94ff878d6c3e4afaf50ff5b93f',
    banner: 'https://direct-stor.berkasdrive.com/komikcast_info/cover_komik/2029.webp?v=8669c22dee4115bcc96235461779a0ada6c57e94ff878d6c3e4afaf50ff5b93f',
    day: 'SEN',
    genres: ['Komedi', 'Urban', 'Sistem', 'Manhua'],
    status: 'Ongoing',
    rating: 9.72,
    likes: '1,8 jt',
    subscribers: '650 rb',
    views: '19,5 jt',
    synopsis: 'Lin Yi mendapatkan sistem misterius yang memberikannya karier dan profesi baru setiap minggu: kurir, satpam, dokter, hingga bos taipan konglomerat.',
    rankToday: 8,
    rankWeek: 8,
    rankMonth: 8,
    rankDelta: -1,
    isUpToday: true,
    episodes: Array.from({ length: 12 }, (_, i) => {
      const num = 935 - i;
      return {
        id: `career-${num}`,
        chapter_number: num,
        title: `Chapter ${num}`,
        release_date: `${20 - i} Okt 2026`,
        views: '150 rb',
        likes: '50 rb',
        images: createPanels('i-randomly-have-a-new-career-every-week', num, 10),
      };
    }),
  },
  {
    id: '2165',
    slug: 'batsu-harembatsu-harem',
    title: 'Batsu Harem',
    author: 'Tatsuki',
    artist: 'Manga Club',
    poster: 'https://direct-stor.berkasdrive.com/komikcast_info/cover_komik/2165.webp?v=9b352b26192eddf9079f757e1b70d98b5368f8f6b44c8bb6e649eb1924843a5a',
    banner: 'https://direct-stor.berkasdrive.com/komikcast_info/cover_komik/2165.webp?v=9b352b26192eddf9079f757e1b70d98b5368f8f6b44c8bb6e649eb1924843a5a',
    day: 'SEL',
    genres: ['Romansa', 'Komedi', 'Drama', 'Harem'],
    status: 'Ongoing',
    rating: 9.75,
    likes: '1,7 jt',
    subscribers: '610 rb',
    views: '16,8 jt',
    synopsis: 'Kisah romansa komedi penuh kejutan dengan berbagai pilihan takdir dan interaksi kocak penuh teka-teki cinta.',
    rankToday: 9,
    rankWeek: 9,
    rankMonth: 9,
    rankDelta: 0,
    isUpToday: true,
    episodes: Array.from({ length: 12 }, (_, i) => {
      const num = 211 - i;
      return {
        id: `bh-${num}`,
        chapter_number: num,
        title: `Chapter ${num}`,
        release_date: `${19 - i} Okt 2026`,
        views: '135 rb',
        likes: '44 rb',
        images: createPanels('batsu-harembatsu-harem', num, 10),
      };
    }),
  },
  {
    id: '7739',
    slug: 'i-live-with-my-villain-uncle',
    title: 'I Live With My Villain Uncle',
    author: 'Novel Creator',
    artist: 'Manhua Studio',
    poster: 'https://direct-stor.berkasdrive.com/komikcast_info/cover_komik/7739.webp?v=ce60284f97ac38a16b7ac575da1fa71ad52485cd35fb9c4dfb02b9d2307f0aa6',
    banner: 'https://direct-stor.berkasdrive.com/komikcast_info/cover_komik/7739.webp?v=ce60284f97ac38a16b7ac575da1fa71ad52485cd35fb9c4dfb02b9d2307f0aa6',
    day: 'RAB',
    genres: ['Drama', 'Romansa', 'Fantasi', 'Shoujo'],
    status: 'Ongoing',
    rating: 9.82,
    likes: '1,3 jt',
    subscribers: '470 rb',
    views: '9,8 jt',
    synopsis: 'Seorang gadis mendapati dirinya hidup di dalam dunia novel sebagai keponakan dari seorang paman yang dikenal sebagai penjahat paling berbahaya dalam cerita. Ia berusaha mendekatinya demi mengubah akhir tragis sang paman.',
    rankToday: 10,
    rankWeek: 10,
    rankMonth: 10,
    rankDelta: 2,
    isUpToday: true,
    episodes: Array.from({ length: 12 }, (_, i) => {
      const num = 62 - i;
      return {
        id: `uncle-${num}`,
        chapter_number: num,
        title: `Chapter ${num}`,
        release_date: `${23 - i} Okt 2026`,
        views: '110 rb',
        likes: '39 rb',
        images: createPanels('i-live-with-my-villain-uncle', num, 10),
      };
    }),
  },
  {
    id: '7800',
    slug: 'black-clover',
    title: 'Black Clover',
    author: 'Yūki Tabata',
    artist: 'Yūki Tabata',
    poster: 'https://direct-stor.berkasdrive.com/komikcast_info/cover_komik/7800.webp?v=e6f34b1f87f633d07800a681091073263e66d24849de20bd473deaeb8f79c267',
    banner: 'https://direct-stor.berkasdrive.com/komikcast_info/cover_komik/7800.webp?v=e6f34b1f87f633d07800a681091073263e66d24849de20bd473deaeb8f79c267',
    day: 'KAM',
    genres: ['Aksi', 'Sihir', 'Fantasi', 'Shounen'],
    status: 'Ongoing',
    rating: 9.76,
    likes: '3,4 jt',
    subscribers: '1,3 jt',
    views: '36,0 jt',
    synopsis: 'Asta terlahir tanpa kekuatan sihir di dunia di mana sihir adalah segalanya. Namun dengan tekad pantang menyerah dan pedang anti-sihir misterius dari Grimoire bersemanggi lima, ia bertekad menjadi Kaisar Sihir berikutnya.',
    rankToday: 11,
    rankWeek: 11,
    rankMonth: 11,
    rankDelta: 0,
    isUpToday: true,
    episodes: Array.from({ length: 12 }, (_, i) => {
      const num = 393 - i;
      return {
        id: `bc-${num}`,
        chapter_number: num,
        title: `Chapter ${num}`,
        release_date: `${16 - i} Okt 2026`,
        views: '290 rb',
        likes: '92 rb',
        images: createPanels('black-clover', num, 10),
      };
    }),
  },
  {
    id: '5001',
    slug: 'martial-peak-part-1martial-peak-part-1',
    title: 'Martial Peak',
    author: 'Momo',
    artist: 'Pikapi',
    poster: 'https://thumbnail.komiku.org/uploads/manga/martial-peak/manga_thumbnail-Manhua-Martial-Peak.jpg?w=500',
    banner: 'https://thumbnail.komiku.org/uploads/manga/martial-peak/manga_thumbnail-Manhua-Martial-Peak.jpg?w=500',
    day: 'JUM',
    genres: ['Aksi', 'Martial Arts', 'Kultivasi', 'Petualangan'],
    status: 'Tamat',
    rating: 9.68,
    likes: '4,1 jt',
    subscribers: '1,6 jt',
    views: '58,0 jt',
    synopsis: 'Perjalanan menuju puncak bela diri adalah jalan yang sunyi dan panjang. Yang Kai memulai perjalanannya dari seorang murid penyapu di Paviliun Lingxiao hingga menjadi eksistensi tak tertandingi di alam semesta.',
    rankToday: 12,
    rankWeek: 12,
    rankMonth: 12,
    rankDelta: 1,
    isUpToday: false,
    episodes: Array.from({ length: 12 }, (_, i) => {
      const num = 2000 - i;
      return {
        id: `mp-${num}`,
        chapter_number: num,
        title: `Chapter ${num}`,
        release_date: `${10 - i} Okt 2026`,
        views: '180 rb',
        likes: '60 rb',
        images: createPanels('martial-peak', num, 10),
      };
    }),
  },
];

export const DAYS_OF_WEEK = [
  { key: 'SEN', label: 'SEN', full: 'Senin' },
  { key: 'SEL', label: 'SEL', full: 'Selasa' },
  { key: 'RAB', label: 'RAB', full: 'Rabu' },
  { key: 'KAM', label: 'KAM', full: 'Kamis' },
  { key: 'JUM', label: 'JUM', full: 'Jumat' },
  { key: 'SAB', label: 'SAB', full: 'Sabtu' },
  { key: 'MIN', label: 'MIN', full: 'Minggu' },
  { key: 'TAMAT', label: 'TAMAT', full: 'Tamat' },
] as const;

export type DayKey = (typeof DAYS_OF_WEEK)[number]['key'];

export function getTodayKey(): DayKey {
  const day = new Date().getDay();
  const map: Record<number, DayKey> = {
    0: 'MIN',
    1: 'SEN',
    2: 'SEL',
    3: 'RAB',
    4: 'KAM',
    5: 'JUM',
    6: 'SAB',
  };
  return map[day] || 'SEN';
}

export function getSeriesByDay(day: DayKey): WebtoonSeries[] {
  return WEBTOON_SERIES.filter((s) => s.day === day);
}

export function getRankedSeries(period: 'today' | 'week' | 'month'): WebtoonSeries[] {
  const sorted = [...WEBTOON_SERIES];
  if (period === 'today') {
    return sorted.sort((a, b) => a.rankToday - b.rankToday);
  }
  if (period === 'week') {
    return sorted.sort((a, b) => a.rankWeek - b.rankWeek);
  }
  return sorted.sort((a, b) => a.rankMonth - b.rankMonth);
}

export function getSeriesByGenre(genre: string): WebtoonSeries[] {
  if (!genre || genre === 'Semua') return WEBTOON_SERIES;
  return WEBTOON_SERIES.filter((s) => s.genres.includes(genre));
}

export function getSeriesBySlug(slug: string): WebtoonSeries | undefined {
  return WEBTOON_SERIES.find((s) => s.slug === slug);
}
