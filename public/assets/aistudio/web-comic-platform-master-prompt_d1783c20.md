# MASTER PROMPT — ORIGINAL WEB COMIC PLATFORM
## Next.js + TypeScript + Komikcast Scraper Integration

> **Instruction:** Treat this document as the product specification and implementation prompt. Do not merely create a visual prototype. Build a functional, polished web comic platform with real data flow through the supplied scraper architecture.

---

# 0. ROLE

You are an expert:

- Product designer
- UI/UX designer
- Frontend engineer
- Full-stack Next.js engineer
- TypeScript engineer
- Performance engineer
- Accessibility engineer

Your job is to design and implement a **serious, production-quality web comic platform** using Next.js.

The platform should feel like a real established comic-reading product.

It should **NOT** look like:

- an AI-generated landing page
- a generic SaaS dashboard
- a template with random gradients
- a collection of identical cards
- an unfinished student project
- an over-designed Dribbble concept that is difficult to use

The interface must have:

- clear information hierarchy
- intentional spacing
- realistic content density
- strong typography
- consistent components
- responsive behavior
- polished states
- practical interactions
- excellent reading UX

Create an **original visual identity**. You may take inspiration from common patterns used by successful manga/webtoon/comic platforms, but do not copy another site's branding, logo, proprietary artwork, or exact layout.

---

# 1. PRODUCT VISION

Build a web comic platform where users can:

1. Discover comics
2. Search comics
3. Browse latest updates
4. Browse popular comics
5. Browse by genre
6. Open comic details
7. Read chapters
8. Navigate between chapters
9. Bookmark comics
10. Continue reading
11. View reading history
12. Customize reader settings
13. Use the site comfortably on mobile and desktop
14. Switch between light/dark themes

The most important parts of the product are:

### Priority 1
**Chapter reading experience**

### Priority 2
**Comic discovery**

### Priority 3
**Comic detail pages**

### Priority 4
**Library and history**

The reader must feel like the center of the product, not an afterthought.

---

# 2. LANGUAGE

Default UI language:

**Bahasa Indonesia**

Use natural Indonesian, not machine-translated sounding language.

Examples:

- Beranda
- Komik Terbaru
- Terpopuler
- Genre
- Cari komik...
- Tambah ke Library
- Hapus dari Library
- Lanjutkan Membaca
- Chapter Terbaru
- Daftar Chapter
- Sebelumnya
- Berikutnya
- Baca Sekarang
- Detail Komik
- Riwayat Baca
- Tidak ada hasil
- Komik tidak ditemukan
- Coba lagi

Do not use excessive English terminology if a natural Indonesian equivalent exists.

Technical code identifiers may remain English.

---

# 3. TECHNOLOGY

Use:

- Next.js
- App Router
- TypeScript
- React
- Tailwind CSS
- Server Components by default
- Client Components only where interactivity requires them

Recommended structure:

```text
app/
components/
lib/
services/
types/
hooks/
public/
```

Do not add libraries unless they provide real value.

Keep dependencies minimal.

---

# 4. CORE ARCHITECTURE

Use this architecture:

```text
                         ┌─────────────────────┐
                         │      Browser        │
                         └──────────┬──────────┘
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │    Next.js App      │
                         │   Server / Routes   │
                         └──────────┬──────────┘
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │ Typed Comic Adapter │
                         └──────────┬──────────┘
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │ KomikcastScraper    │
                         └──────────┬──────────┘
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │  Komikcast source   │
                         └─────────────────────┘
```

The browser must NOT directly execute scraping logic.

Scraping must remain server-side.

---

# 5. SUPPLIED SCRAPER

Use the supplied scraper as the primary upstream data source.

The scraper exposes:

```js
search(query, page)
latest(page)
popular(page)
detail(slugOrUrl)
chapter(slugOrUrl, chapterNumber)
```

The existing scraper behavior should be preserved.

Important capabilities:

## Search

```js
scraper.search(query, page)
```

Returns:

- id
- title
- slug
- url
- poster
- type
- status
- rating
- release_year
- author
- artist
- genres
- last_chapter
- pagination

## Latest

```js
scraper.latest(page)
```

Returns:

- manga list
- poster
- title
- status
- rating
- genres
- latest chapter
- pagination

## Popular

```js
scraper.popular(page)
```

Returns popular manga data and pagination.

## Detail

```js
scraper.detail(slug)
```

Returns:

- manga information
- synopsis
- author
- artist
- rating
- release year
- views
- genres
- chapter count
- first chapter
- complete chapter list

## Chapter

```js
scraper.chapter(slug, chapterNumber)
```

Returns:

- manga title
- manga slug
- chapter title
- chapter number
- image count
- image URLs
- previous chapter
- next chapter

---

# 6. DO NOT USE FAKE DATA

This is extremely important.

Do not fabricate:

- chapter numbers
- ratings
- authors
- artists
- views
- synopsis
- publication dates
- image URLs
- popularity numbers

If upstream data is missing:

Either:

1. hide the field, or
2. show a neutral fallback such as "Tidak tersedia"

Never invent data merely to make the UI look full.

---

# 7. SCRAPER SERVER-SIDE IMPLEMENTATION

Create a server-only implementation.

Example:

```text
lib/
  komikcast/
    scraper.ts
    adapter.ts
    types.ts
```

If the supplied scraper is JavaScript:

Option A:

Convert it to TypeScript carefully.

Option B:

Keep it as JavaScript but wrap it with a strongly typed TypeScript adapter.

Prefer TypeScript when practical.

Add a server-only guard where useful.

Never import scraper code into a client component.

---

# 8. REQUEST HANDLING

The scraper currently:

- uses Node `https`
- uses Node `http`
- handles redirects
- sets a browser User-Agent
- requests HTML
- extracts `data-page`
- decodes HTML entities
- parses JSON

Preserve this functionality.

Improve robustness where appropriate.

Handle:

- timeout
- HTTP 4xx
- HTTP 5xx
- redirects
- invalid JSON
- missing data-page
- malformed HTML
- empty props
- missing manga
- missing chapter
- empty image list

Never expose raw internal errors to users.

---

# 9. DATA-PAGE PARSING

The upstream response contains:

```html
data-page="..."
```

The scraper extracts it and decodes:

```text
&quot;
&amp;
&lt;
&gt;
&#039;
```

Preserve this mechanism.

However, make parsing robust enough that an upstream formatting change produces a controlled application error rather than a crash.

---

# 10. INTERNAL API

Create an internal server-side API layer.

Recommended routes:

```text
/api/manga/search?q=solo&page=1
/api/manga/latest?page=1
/api/manga/popular?page=1
/api/manga/[slug]
/api/manga/[slug]/chapter/[chapter]
```

Optional:

```text
/api/genres
/api/health
```

Only implement additional endpoints if genuinely useful.

---

# 11. API RESPONSE FORMAT

Use a consistent structure.

Success:

```ts
{
  status: true,
  data: ...
}
```

Error:

```ts
{
  status: false,
  error: "Pesan error yang aman untuk pengguna"
}
```

Do not expose:

- stack traces
- internal file paths
- raw upstream response
- request headers
- implementation secrets

---

# 12. SECURITY

Never create an unrestricted proxy like:

```text
/api/proxy?url=https://anything.com
```

Do not allow users to make arbitrary server-side HTTP requests.

Only request known application endpoints.

Validate:

- query
- page
- slug
- chapter number

Prevent obviously malformed values from reaching the scraper.

---

# 13. CACHING

Because upstream scraping can be expensive, use reasonable server-side caching where compatible with Next.js.

Examples:

- Latest: short cache
- Popular: short cache
- Search: short cache
- Manga detail: moderate cache
- Chapter: cache cautiously

Do not cache user-specific data globally.

The reader's local history/library must remain user-specific.

---

# 14. ROUTING

Use this route structure:

```text
/
 /search
 /latest
 /popular
 /genres
 /genres/[slug]
 /library
 /history
 /manga/[slug]
 /manga/[slug]/chapter/[chapterNumber]
```

---

# 15. GLOBAL DESIGN SYSTEM

Create a coherent design system.

Use CSS variables for:

```text
background
foreground
surface
surface-elevated
muted
muted-foreground
border
accent
accent-hover
success
warning
danger
reader-background
```

Do not scatter arbitrary colors throughout components.

---

# 16. VISUAL STYLE

The visual language should be:

- premium
- editorial
- modern
- restrained
- readable
- slightly cinematic
- comic-focused

Use:

- strong typography
- neutral backgrounds
- one main accent
- subtle borders
- subtle shadows
- modest radius
- consistent spacing

Avoid:

- rainbow gradients
- neon overload
- excessive glassmorphism
- giant floating blobs
- excessive pills
- excessive rounded rectangles
- huge shadows
- too many badges
- random icons
- fake charts
- unnecessary metrics

---

# 17. BRANDING

Create an original fictional product name/wordmark placeholder.

Do NOT imitate:

- Webtoon logo
- MangaDex branding
- MangaToon branding
- other proprietary branding

The logo should be simple enough to implement as text/SVG.

---

# 18. HEADER

Desktop header:

```text
[Logo] [Beranda] [Terbaru] [Terpopuler] [Genre]      [Search] [Library] [Theme]
```

Do not cram everything into the header.

Header should remain readable at common laptop widths.

Use sticky behavior if it improves usability.

Do not make the header unnecessarily tall.

---

# 19. MOBILE HEADER

Mobile:

```text
[Menu/Logo]                [Search] [Library]
```

Optionally use a bottom navigation:

```text
Beranda
Terbaru
Cari
Library
```

The mobile layout must be designed independently from desktop.

Do not simply shrink the desktop header.

---

# 20. HOMEPAGE

Create a polished homepage.

Sections:

1. Featured comic
2. Continue reading
3. Latest updates
4. Popular
5. Genre discovery
6. Editorial/discovery section

---

# 21. FEATURED HERO

Hero should include:

- background artwork
- cover
- title
- synopsis
- genres
- status
- rating if available
- latest chapter
- CTA

Primary:

```text
Baca Sekarang
```

Secondary:

```text
Lihat Detail
```

Hero must not become an enormous full-screen advertisement.

On mobile:

- simplify
- reduce text
- prioritize cover/title/CTA
- avoid unreadable background text

---

# 22. CONTINUE READING

Only show if history exists.

Each item:

- cover
- title
- last chapter
- progress if calculable
- continue button

Example:

```text
Solo Swordmaster
Chapter 23

[ Lanjutkan ]
```

Do not show fake history.

If empty:

Do not show this section.

---

# 23. LATEST SECTION

Use:

```js
scraper.latest(page)
```

Display a visually strong catalog.

Cards:

- poster
- title
- latest chapter
- status
- rating if available

Use a responsive grid.

Desktop example:

```text
6 columns
```

Tablet:

```text
4 columns
```

Mobile:

```text
2 columns
```

Adjust according to actual viewport and card readability.

---

# 24. POPULAR SECTION

Use:

```js
scraper.popular(page)
```

Make the section visually distinct from Latest.

Possible treatment:

- horizontal ranked list
- larger first items
- compact cards

Do not make every section identical.

---

# 25. GENRES

Create genre discovery.

Use compact links/chips.

Examples:

- Action
- Adventure
- Comedy
- Drama
- Fantasy
- Romance
- School
- Martial Arts
- Mystery
- Horror
- Sci-Fi

Only show genres that are actually available from the application data source where possible.

---

# 26. SEARCH PAGE

Route:

```text
/search?q=solo&page=1
```

Features:

- large search field
- query
- result count
- sorting/filter area where supported
- results grid
- pagination

Search page must look like a real catalog.

---

# 27. SEARCH UX

Search states:

### Initial

Show:

```text
Cari komik yang ingin kamu baca.
```

### Loading

Use skeleton cards.

### Results

Show:

```text
Hasil pencarian untuk "solo"
```

### Empty

Show:

```text
Komik tidak ditemukan.
```

Offer:

```text
Coba kata kunci lain
```

### Error

Show:

```text
Pencarian tidak dapat dimuat.
```

with retry.

---

# 28. SEARCH INPUT

Search input:

- keyboard accessible
- clear button
- submit button
- sensible debounce only if autocomplete is implemented

Do not call upstream on every keystroke unless explicitly building autocomplete.

---

# 29. PAGINATION

Create reusable:

```text
Pagination
```

Show:

- previous
- current page
- nearby pages
- next

Do not display hundreds of page buttons.

Use ellipsis when necessary.

Disable previous on first page.

Disable next on last page.

---

# 30. MANGA DETAIL PAGE

Route:

```text
/manga/[slug]
```

Use:

```js
scraper.detail(slug)
```

This page should be visually rich but readable.

Desktop:

```text
[Cover] [Title / Metadata / CTA]
                  |
                  ▼
             Synopsis
                  |
                  ▼
             Chapters
```

---

# 31. DETAIL HERO

Show:

- cover
- title
- status
- type
- rating
- author
- artist
- release year
- genres
- synopsis

Primary actions:

```text
Baca Chapter Pertama
```

and:

```text
+ Library
```

---

# 32. DETAIL INFORMATION HIERARCHY

Priority:

1. Title
2. Cover
3. Reading CTA
4. Synopsis
5. Chapter list
6. Metadata

Do not make metadata visually louder than the chapter list.

---

# 33. GENRE DISPLAY

Genre items should be clickable where routes exist.

Example:

```text
Action
Fantasy
Martial Arts
```

Keep them visually subtle.

---

# 34. CHAPTER LIST

Create:

```text
ChapterList
ChapterRow
```

Each row:

```text
Chapter 23
Judul chapter
Tanggal
Views
```

Only show available fields.

---

# 35. CHAPTER LIST UX

Latest chapter should be easy to identify.

Potential indicators:

- New
- Latest

Do not overuse badges.

Allow:

- chapter search/filter if chapter count is large
- reverse order
- compact rows

If chapter list is huge, consider virtualization/pagination only if actually necessary.

---

# 36. FIRST CHAPTER

Use:

```js
props.firstChapter
```

if available.

CTA:

```text
Baca Chapter Pertama
```

Do not invent a first chapter if upstream does not provide one.

---

# 37. READER PAGE

Route:

```text
/manga/[slug]/chapter/[chapterNumber]
```

This is the most important page.

Design principle:

> UI should disappear and the comic should become the focus.

---

# 38. READER BACKGROUND

Default:

very dark neutral background.

Avoid pure black if it reduces perceived image separation.

Comic image column:

```text
max-width
```

should be comfortable on desktop.

On mobile:

```text
width: 100%
```

with minimal horizontal padding.

---

# 39. READER IMAGES

Data:

```js
ch.images
```

Each:

```ts
{
  order,
  url,
  bytes
}
```

Sort by:

```ts
order
```

before rendering.

Do not trust incoming order blindly.

---

# 40. IMAGE LOADING

Images should:

- preserve aspect ratio
- avoid unnecessary cropping
- lazy-load below the fold
- use appropriate decoding
- minimize layout shift
- display loading placeholders where useful

Do not load every chapter image at once if it creates excessive memory/network usage.

---

# 41. READER WIDTH MODES

Implement:

```text
Compact
Normal
Wide
Full
```

Example:

```text
Compact: 720px
Normal: 900px
Wide: 1100px
Full: viewport width
```

Adjust actual values based on design testing.

---

# 42. READER GAP

Settings:

```text
No gap
Small
Medium
Large
```

Persist locally.

---

# 43. READER CONTROLS

Desktop toolbar:

```text
← Back
Comic Title
Chapter selector
Previous
Next
Settings
```

Toolbar must be compact.

Do not cover comic artwork.

---

# 44. MOBILE READER CONTROLS

Controls should:

- be thumb-friendly
- avoid covering important content
- hide when scrolling if appropriate
- return when user taps/scrolls upward

Do not permanently consume a large portion of the screen.

---

# 45. CHAPTER NAVIGATION

Use:

```js
data.navigation.prev
data.navigation.next
```

Show navigation:

- near reader top
- at reader bottom

If `prev` is null:

disable/hide previous.

If `next` is null:

disable/hide next.

Do not calculate fake chapter numbers.

---

# 46. CHAPTER SELECTOR

Reader should allow selecting another chapter.

Options:

- dropdown
- compact popover
- chapter drawer

Do not force the user to return to detail just to change chapter.

---

# 47. KEYBOARD CONTROLS

Desktop:

```text
Arrow Left  = Previous chapter
Arrow Right = Next chapter
Escape      = Close settings
```

Only activate shortcuts when they will not interfere with normal input fields.

---

# 48. READER SETTINGS

Create:

```text
ReaderSettings
```

Options:

- background
- image width
- page gap
- controls auto-hide

Persist using localStorage.

Example key:

```text
comic-reader-settings
```

Validate stored values.

---

# 49. READER ERROR STATES

If chapter cannot load:

```text
Chapter tidak dapat dimuat.
```

Buttons:

```text
Coba Lagi
Kembali ke Komik
```

If image fails:

Show an inline retry/failure state.

Do not display broken image icons without context.

---

# 50. LIBRARY

Route:

```text
/library
```

Initial version can use localStorage.

Store:

```ts
{
  slug,
  title,
  poster,
  lastReadChapter,
  addedAt,
  updatedAt
}
```

---

# 51. LIBRARY FEATURES

Users can:

- add comic
- remove comic
- continue reading
- see latest local reading position

Library empty state:

```text
Library kamu masih kosong.
Tambahkan komik yang ingin kamu baca nanti.
```

---

# 52. READING HISTORY

Route:

```text
/history
```

Store:

- slug
- title
- poster
- chapter number
- chapter title
- timestamp

Limit history size.

Example:

```text
max 100 items
```

Remove oldest entries.

---

# 53. HISTORY UX

Group or sort:

```text
Terbaru dibaca
```

Each:

```text
Cover
Title
Chapter
Time
Lanjutkan
```

Provide:

```text
Hapus semua riwayat
```

with confirmation.

---

# 54. LOCAL STORAGE ARCHITECTURE

Create a small client-side abstraction.

Example:

```text
lib/client/
  library.ts
  history.ts
  reader-settings.ts
```

Do not scatter raw `localStorage.setItem()` throughout components.

Handle:

- SSR
- unavailable localStorage
- malformed JSON
- version migration if useful

---

# 55. FUTURE DATABASE SUPPORT

Structure local state so it can later become:

```text
Authentication
      ↓
API
      ↓
Database
```

Do not tightly couple every component to localStorage.

---

# 56. GENRE PAGE

Route:

```text
/genres
```

Show genre directory.

Genre detail:

```text
/genres/[slug]
```

Display comics associated with that genre.

If upstream scraper does not have a dedicated genre endpoint:

Do not fake one.

Instead:

- architect a clean filtering abstraction
- document the limitation
- implement only what the upstream data genuinely supports

---

# 57. FOOTER

Footer should be understated.

Include:

- brand
- short description
- navigation
- genres
- contact placeholder
- privacy
- terms
- source/attribution information where appropriate

Do not create an enormous marketing footer.

---

# 58. ERROR PAGE

Create polished global error states.

For:

- 404
- server error
- upstream error

Use friendly Indonesian copy.

Example:

```text
Halaman tidak ditemukan.
Mungkin halaman yang kamu cari sudah tidak tersedia.
```

Buttons:

```text
Kembali ke Beranda
Cari Komik
```

---

# 59. LOADING STATES

Create reusable skeletons:

```text
ComicCardSkeleton
ComicGridSkeleton
DetailSkeleton
ChapterListSkeleton
ReaderSkeleton
```

Avoid generic full-screen loading spinners everywhere.

---

# 60. SKELETON DESIGN

Skeletons should match the real layout.

For example:

```text
poster rectangle
title lines
metadata line
```

Do not animate every element aggressively.

Respect:

```css
prefers-reduced-motion
```

---

# 61. EMPTY STATES

Every major page needs an intentional empty state.

Examples:

### Search

```text
Tidak ada komik yang cocok.
```

### Library

```text
Library kamu masih kosong.
```

### History

```text
Belum ada riwayat bacaan.
```

### Genre

```text
Belum ada komik untuk genre ini.
```

Avoid blank white screens.

---

# 62. ACCESSIBILITY

Use:

- semantic HTML
- proper headings
- accessible buttons
- keyboard focus
- visible focus state
- alt text
- aria-label where necessary
- sufficient contrast

Do not use clickable `<div>` when a button/link is appropriate.

---

# 63. IMAGE ALT

Comic poster:

```text
Poster [title]
```

Reader image:

```text
[title] - Chapter [chapter] - Halaman [number]
```

Do not duplicate massive descriptions.

---

# 64. SEO

Implement dynamic metadata.

Manga:

```text
[Title] — Baca Komik Online
```

Chapter:

```text
[Title] Chapter [number] — Baca Komik
```

Add:

- title
- description
- OpenGraph
- Twitter/X metadata if useful
- canonical URL

Do not keyword stuff.

---

# 65. STRUCTURED DATA

Where appropriate, add structured data for comic/manga content.

Only include facts actually available from upstream data.

Do not invent:

- author
- rating
- dates

---

# 66. PERFORMANCE

Prioritize:

- Server Components
- streaming where useful
- image optimization
- lazy image loading
- minimal client JS
- caching
- avoiding unnecessary API calls

Do not turn the entire application into a Client Component.

---

# 67. COMPONENT ARCHITECTURE

Recommended:

```text
components/
  layout/
    Header.tsx
    Footer.tsx
    MobileNav.tsx

  comic/
    ComicCard.tsx
    ComicGrid.tsx
    ComicMeta.tsx
    GenreBadge.tsx
    ChapterList.tsx
    ChapterRow.tsx

  home/
    FeaturedComic.tsx
    ContinueReading.tsx
    LatestSection.tsx
    PopularSection.tsx
    GenreSection.tsx

  reader/
    Reader.tsx
    ReaderToolbar.tsx
    ReaderSettings.tsx
    ReaderNavigation.tsx
    ReaderImage.tsx
    ChapterSelector.tsx

  common/
    SearchBar.tsx
    Pagination.tsx
    EmptyState.tsx
    ErrorState.tsx
    Skeleton.tsx
```

Adjust structure if a better organization is justified.

---

# 68. TYPES

Create strict types.

Example:

```ts
export type ChapterSummary = {
  id: number;
  title: string;
  chapter_number: number | string;
  url: string;
};

export type Comic = {
  id: number;
  title: string;
  slug: string;
  url: string;
  poster: string | null;
  type: string | null;
  status: string | null;
  rating: number | null;
  release_year: number | null;
  author: string | null;
  artist: string | null;
  genres: string[];
  last_chapter: ChapterSummary | null;
};
```

Create appropriate types for:

- MangaDetail
- Chapter
- ChapterImage
- Navigation
- SearchResponse
- PaginatedResponse
- API errors

Avoid `any`.

---

# 69. DATA MAPPING

Use mapper functions.

Example:

```text
lib/komikcast/mappers.ts
```

Possible functions:

```ts
mapComic()
mapMangaDetail()
mapChapter()
mapChapterImage()
```

This prevents upstream structure from leaking everywhere.

---

# 70. PAGE ARCHITECTURE

Example:

```text
app/
  page.tsx

  search/
    page.tsx

  latest/
    page.tsx

  popular/
    page.tsx

  genres/
    page.tsx
    [slug]/
      page.tsx

  library/
    page.tsx

  history/
    page.tsx

  manga/
    [slug]/
      page.tsx
      chapter/
        [chapterNumber]/
          page.tsx
```

---

# 71. HOME SERVER DATA

Where possible, fetch:

- featured/latest/popular

on the server.

Do not fetch everything in `useEffect()` on page load if Server Components can handle it.

---

# 72. CLIENT COMPONENT RULE

Use `"use client"` only for:

- localStorage
- reader settings
- interactive search UI
- bookmark state
- history
- responsive interactive controls
- keyboard shortcuts
- chapter selector

Do not use it unnecessarily.

---

# 73. RESPONSIVE DESIGN

Design intentionally for:

## Mobile

~320–480px

## Tablet

~768–1024px

## Desktop

~1280px+

## Large desktop

~1536px+

Do not rely solely on scaling.

Adapt:

- navigation
- grid
- typography
- spacing
- reader width
- controls

---

# 74. COMIC GRID

Cards should have consistent poster ratios.

Use:

```text
aspect-ratio
object-fit: cover
```

for posters.

Do not stretch images.

Titles should have controlled line counts.

---

# 75. CARD INTERACTION

Desktop:

- subtle image scale on hover
- title/accent change
- chapter interaction

Mobile:

- no hover-dependent information

Everything important must remain accessible without hover.

---

# 76. BUTTON SYSTEM

Define:

- primary
- secondary
- ghost
- danger
- icon

Buttons must have:

- hover
- active
- disabled
- focus

Do not use a different button style on every page.

---

# 77. ICON SYSTEM

Use one consistent icon set if a library is needed.

Do not mix:

- random Unicode symbols
- unrelated icon styles
- emoji as interface icons

Icons should support text rather than replace important labels.

---

# 78. DARK MODE

Support:

```text
System
Light
Dark
```

Persist manual preference.

Use CSS variables.

Reader dark mode can remain independent.

---

# 79. THEME SWITCH

Make it compact.

Avoid a giant toggle.

Accessible label:

```text
Ganti tema
```

---

# 80. READER THEME

Reader should prioritize artwork.

Suggested modes:

```text
Gelap
Terang
```

Optional:

```text
Sepia
```

only if it genuinely improves reading.

---

# 81. SOURCE ATTRIBUTION

Where appropriate, identify the upstream source clearly.

Do not pretend upstream content is owned by this application.

The implementation should respect applicable copyright and site terms.

Do not implement:

- DRM bypass
- authentication bypass
- paywall bypass
- access-control circumvention

The scraper should only consume publicly accessible pages that the application is permitted to access.

---

# 82. ENVIRONMENT VARIABLES

Create:

```text
.env.example
```

Only put variables there if actually needed.

Do not invent secret API keys.

If no environment variables are required, still document that clearly.

---

# 83. README

Create a comprehensive README.

Include:

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```

## Build

```bash
npm run build
```

## Start

```bash
npm run start
```

Also document:

- project structure
- scraper integration
- API routes
- caching
- localStorage
- reader architecture
- limitations
- upstream dependency
- legal/copyright considerations

---

# 84. TESTING

Create tests for:

### Scraper

- successful response
- HTTP error
- timeout
- malformed data-page
- missing manga
- missing chapter

### Mapper

- search result mapping
- detail mapping
- chapter mapping
- image ordering
- navigation mapping

### Client state

- library add/remove
- history add/remove
- malformed localStorage

---

# 85. E2E FLOWS

Test:

```text
Home
 ↓
Search
 ↓
Search result
 ↓
Manga detail
 ↓
Chapter reader
 ↓
Next chapter
```

Also:

```text
Manga detail
 ↓
Add Library
 ↓
Library
 ↓
Continue Reading
```

And:

```text
Reader
 ↓
History
```

---

# 86. NO AI-SLOP RULE

This is one of the most important requirements.

Before finishing, inspect the UI and remove anything that looks AI-generated.

Avoid:

- excessive rounded cards
- random gradients
- too many floating elements
- generic "Welcome back!" sections
- fake statistics
- unnecessary dashboard widgets
- repetitive section patterns
- oversized headings
- meaningless decorative shapes
- excessive glass effects
- excessive shadows
- excessive badges
- too much empty space
- too many CTA buttons

The design should feel like a product with an actual design system.

---

# 87. REALISTIC CONTENT DENSITY

A comic website should feel like a catalog.

Do not make every section contain only 2–3 huge cards.

Use:

- grids
- compact rows
- editorial sections
- horizontal carousels where useful
- dense chapter lists

Balance density with readability.

---

# 88. NO GENERIC LANDING PAGE

Do NOT structure the homepage like:

```text
Huge headline
Huge gradient
Three feature cards
Testimonials
Pricing
FAQ
```

This is a comic platform, not a SaaS landing page.

The homepage should immediately expose comic content.

---

# 89. READER-FIRST DESIGN

When entering a chapter:

The user should immediately see the comic.

Do not force:

- login
- popups
- newsletters
- giant banners
- unrelated promotional overlays

before reading.

---

# 90. NO ANNOYING POPUPS

Do not implement:

- fake notification prompts
- fake download prompts
- newsletter popup
- forced signup popup
- excessive ads
- intrusive modal

unless explicitly requested later.

---

# 91. MOBILE-FIRST READING

On mobile:

- comic image should use available width
- controls should be minimal
- no horizontal overflow
- no tiny text
- no desktop sidebar
- chapter navigation should remain accessible

Test at narrow viewport widths.

---

# 92. DESKTOP READING

Desktop reader:

```text
             ┌─────────────────────┐
             │                     │
             │      COMIC PAGE     │
             │                     │
             └─────────────────────┘
```

Keep the reading column centered.

Do not stretch artwork across a huge ultrawide screen by default.

---

# 93. CHAPTER TRANSITION

At the bottom of a chapter:

Show:

```text
Chapter selesai
```

Then:

```text
[Chapter Sebelumnya] [Kembali ke Komik] [Chapter Berikutnya]
```

If next exists, make it visually prominent.

If not, clearly indicate that the user reached the latest/end chapter.

---

# 94. IMAGE FAILURE

If an individual image fails:

Show:

```text
Gambar tidak dapat dimuat.
```

with:

```text
Muat ulang
```

Do not crash the entire reader.

---

# 95. NETWORK FAILURE

If upstream fails:

Provide:

```text
Sumber komik sedang tidak dapat diakses.
```

and:

```text
Coba lagi
```

Do not blame the user.

---

# 96. ERROR BOUNDARIES

Use Next.js error handling where appropriate.

Provide route-level error UI.

Reader failures should not destroy global navigation.

---

# 97. SOURCE URL HANDLING

The scraper supports both:

```text
slug
```

and:

```text
full URL
```

The web app should normally operate using:

```text
slug
```

and:

```text
chapter number
```

Do not allow users to turn the application into a general-purpose URL fetcher.

---

# 98. CHAPTER NUMBER HANDLING

Do not assume chapter numbers are always integers if the upstream data can contain values such as:

```text
10.5
10A
Special
```

Design parsing carefully.

Route parameter may be string.

Validate according to actual upstream format.

---

# 99. URL GENERATION

Generate URLs from known application identifiers.

Example:

```text
/manga/solo-swordmaster
/manga/solo-swordmaster/chapter/23
```

Do not depend on upstream URLs for internal navigation when a local route can be generated safely.

---

# 100. SEO URLS

Keep URLs:

- lowercase
- readable
- stable

Example:

```text
/manga/solo-swordmaster
```

---

# 101. METADATA FALLBACK

If synopsis is missing:

Use a short neutral description rather than inventing one.

If title is missing:

Treat as invalid data.

---

# 102. IMAGE DOMAIN CONFIGURATION

The reader may receive direct R2 CDN URLs.

Configure Next.js appropriately for known image hosts.

Do not create an unrestricted remote image proxy.

If image host behavior changes, make the configuration easy to update.

---

# 103. IMAGE PERFORMANCE

Use:

- lazy loading
- decoding async where appropriate
- stable dimensions if known
- appropriate image component/configuration

For very tall comic images, avoid a design that causes the browser to eagerly decode dozens of massive images at once.

---

# 104. SCROLL PERFORMANCE

The reader can contain many tall images.

Avoid:

- expensive scroll listeners
- re-rendering every image on scroll
- unnecessary React state updates

If auto-hiding toolbar is implemented, use efficient browser APIs.

---

# 105. ACCESSIBLE READER

Reader controls must be keyboard accessible.

Buttons need clear labels.

Example:

```text
Chapter sebelumnya
Chapter berikutnya
Pengaturan pembaca
Kembali ke detail komik
```

---

# 106. FOCUS MANAGEMENT

When opening reader settings:

- focus the panel appropriately
- Escape closes it
- focus should not become trapped incorrectly

Keep implementation lightweight.

---

# 107. REDUCED MOTION

If:

```css
prefers-reduced-motion: reduce
```

then:

- remove large transitions
- disable unnecessary image/card animation
- keep controls functional

---

# 108. DESIGN REVIEW CHECKLIST

Before finishing, inspect:

## Home

- Is content visible immediately?
- Does it look like a comic platform?
- Is hierarchy clear?

## Search

- Is searching easy?
- Are results readable?
- Does pagination work?

## Detail

- Is the title dominant?
- Is the reading CTA obvious?
- Is chapter navigation comfortable?

## Reader

- Is artwork the focus?
- Are images ordered correctly?
- Are controls unobtrusive?
- Does next/previous work?

## Mobile

- Does everything fit?
- Is text readable?
- Are buttons touch-friendly?

## Dark mode

- Is contrast good?
- Are surfaces consistent?

## Error states

- Are they useful?
- Do they offer recovery?

---

# 109. IMPLEMENTATION QUALITY BAR

Do not consider the project complete just because:

- the pages render
- cards appear
- routes exist

It must also:

- work with real scraper data
- handle errors
- handle missing fields
- work on mobile
- support reader navigation
- persist library/history
- have polished loading states
- have proper accessibility
- have SEO metadata
- avoid fake content
- maintain clean architecture

---

# 110. FINAL PROJECT STRUCTURE

A good final structure should approximately resemble:

```text
.
├── app
│   ├── api
│   │   └── manga
│   │       ├── search
│   │       ├── latest
│   │       ├── popular
│   │       └── [slug]
│   │           └── chapter
│   │               └── [chapter]
│   ├── genres
│   │   └── [slug]
│   ├── history
│   ├── latest
│   ├── library
│   ├── manga
│   │   └── [slug]
│   │       └── chapter
│   │           └── [chapterNumber]
│   ├── popular
│   ├── search
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
│
├── components
│   ├── common
│   ├── comic
│   ├── home
│   ├── layout
│   └── reader
│
├── lib
│   ├── client
│   │   ├── history.ts
│   │   ├── library.ts
│   │   └── reader-settings.ts
│   └── komikcast
│       ├── adapter.ts
│       ├── mappers.ts
│       ├── scraper.ts
│       └── types.ts
│
├── types
│   └── comic.ts
│
├── public
│
├── .env.example
├── README.md
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

The exact structure may be improved if the framework version recommends another convention.

---

# 111. DEVELOPMENT ORDER

Implement in this order:

## Phase 1 — Foundation

- Next.js
- TypeScript
- Tailwind
- global design system
- fonts
- theme
- layout

## Phase 2 — Data

- scraper
- adapter
- types
- mappers
- API

## Phase 3 — Discovery

- home
- latest
- popular
- search
- pagination

## Phase 4 — Detail

- manga detail
- chapter list
- genres
- bookmark

## Phase 5 — Reader

- chapter route
- image rendering
- navigation
- settings
- keyboard controls

## Phase 6 — Personalization

- library
- history
- continue reading
- reader preferences

## Phase 7 — Polish

- loading
- errors
- empty states
- SEO
- accessibility
- responsive refinement
- performance

## Phase 8 — Testing

- unit tests
- integration tests
- critical E2E flows

---

# 112. DO NOT STOP AT PHASE 1

If generating the project, continue until the functional application is complete.

Do not provide only:

- wireframes
- pseudo-code
- a single page
- static JSON
- fake API responses
- placeholder buttons

Build the actual architecture.

---

# 113. FINAL ACCEPTANCE CRITERIA

The application is considered successful only if:

### Data

- Search uses real scraper data
- Latest uses real scraper data
- Popular uses real scraper data
- Detail uses real scraper data
- Reader uses real chapter/image data

### Reader

- Images appear in correct order
- Previous works
- Next works
- Chapter selector works
- Settings work
- Mobile works
- Desktop works

### Library

- Add works
- Remove works
- Persistence works

### History

- Reading history is saved
- Continue reading works
- Clear history works

### UX

- Loading states exist
- Empty states exist
- Error states exist
- No fake data
- No broken navigation

### Design

- Original
- Professional
- Responsive
- Consistent
- Not AI-slop
- Not generic SaaS
- Comic-focused

---

# 114. IMPORTANT: IMPLEMENTATION INSTRUCTION

When translating this prompt into code:

1. First inspect the existing project structure.
2. Reuse existing infrastructure when sensible.
3. Do not overwrite working functionality unnecessarily.
4. Establish the design system before creating dozens of pages.
5. Establish the typed scraper adapter before building UI that depends on it.
6. Build reusable components.
7. Keep server/client boundaries clear.
8. Test real data paths.
9. Refine responsive layouts.
10. Perform a final UI quality pass.

If a requirement conflicts with the actual upstream scraper response, **the real scraper response wins**.

Do not fabricate fields to satisfy the visual design.

---

# 115. FINAL DESIGN DIRECTIVE

The final application should give the impression:

> "This is a real comic-reading platform that a professional product team could ship."

It should NOT give the impression:

> "An AI generated a dashboard with comic cards."

Prioritize:

**content → hierarchy → usability → reading experience → polish**

over decorative effects.

The reader is the product.

The comic catalog is the discovery engine.

The detail page is the bridge.

The library/history are retention features.

Build the entire system around that logic.

---

# 116. PROVIDED SCRAPER SOURCE

Use the user's supplied `KomikcastScraper` implementation as the starting point for the scraper layer.

Its important public methods are:

```js
class KomikcastScraper {
  async search(query, page = 1)
  async latest(page = 1)
  async popular(page = 1)
  async detail(slugOrUrl)
  async chapter(slugOrUrl, chapterNumber = null)
}
```

The implementation uses:

```text
https://komikcast.info
```

and parses the Inertia SSR:

```text
data-page
```

state.

Keep the scraper's functionality aligned with the supplied source.

Do not unnecessarily rewrite the scraping strategy.

---

# 117. EXPECTED OUTPUT FROM THE CODING AGENT

When implementing this prompt, produce:

1. Complete Next.js application
2. All necessary files
3. Functional server-side scraper integration
4. Functional API layer
5. Functional UI
6. Responsive layout
7. Reader
8. Library
9. History
10. Search
11. Latest
12. Popular
13. Detail
14. Genres
15. Error/loading/empty states
16. SEO
17. Accessibility
18. Tests
19. README
20. `.env.example`

Do not finish with a description of what could be implemented later.

Implement the core product now.

---

# 118. FINAL PRINCIPLE

**Make it look designed.  
Make it behave like a real product.  
Make the reader excellent.  
Use real scraper data.  
Do not fabricate content.  
Do not over-engineer.  
Do not make it look AI-generated.**
