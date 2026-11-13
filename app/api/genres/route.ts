import { NextResponse } from 'next/server';

export async function GET() {
  const genres = [
    { name: 'Action', slug: 'action' },
    { name: 'Adventure', slug: 'adventure' },
    { name: 'Comedy', slug: 'comedy' },
    { name: 'Drama', slug: 'drama' },
    { name: 'Fantasy', slug: 'fantasy' },
    { name: 'Romance', slug: 'romance' },
    { name: 'School Life', slug: 'school-life' },
    { name: 'Martial Arts', slug: 'martial-arts' },
    { name: 'Supernatural', slug: 'supernatural' },
    { name: 'Mystery', slug: 'mystery' },
    { name: 'Horror', slug: 'horror' },
    { name: 'Sci-Fi', slug: 'sci-fi' },
    { name: 'Shounen', slug: 'shounen' },
    { name: 'Seinen', slug: 'seinen' },
    { name: 'Slice of Life', slug: 'slice-of-life' },
  ];

  return NextResponse.json({ status: true, data: genres });
}
