# 🗺️ Roadmap — Israel Culinary Trail

## Phase 1: MVP ✅
- [x] Next.js App Router scaffold with TypeScript + Tailwind
- [x] Hebrew RTL layout
- [x] Data layer (JSON fallback + Google Sheets integration)
- [x] Region selector (grouped N/C/S)
- [x] Days slider (1–7)
- [x] Type filter (8 culinary categories)
- [x] Route builder algorithm (nearest-neighbor + type diversity)
- [x] Interactive Leaflet map with numbered markers + day polylines
- [x] Day cards with stop details
- [x] PDF export
- [x] WhatsApp sharing
- [x] Build passes

## Phase 1.5: Design System ✅
- [x] Stitch design system (Material palette, editorial aesthetic)
- [x] Alef font throughout
- [x] Material Symbols Outlined icons (replacing emoji)
- [x] Pill chips for regions, tappable circles for days, bento grid for types
- [x] Map view + cards view toggle
- [x] Editorial stop cards with gradient overlays
- [x] Bottom navigation bar (explore, map, saved, menu)
- [x] Sticky header
- [x] PDF export redesigned to match reference (cover page, golden dotted underlines, year badges, amber separators)
- [x] Bottom nav wired up (explore → /, map → /route)

## Phase 2: Enhanced UX ✅
- [x] OG image extraction from article URLs for stop cards
- [x] Animated route building (progressive reveal)
- [x] Drag-and-drop stop reordering
- [x] Mobile bottom sheet for map interaction
- [x] Skeleton loading states

## Phase 3: Smart Routing
- [ ] Google Directions API for real driving times
- [ ] Time-of-day optimization (morning vs. lunch vs. evening stops)
- [ ] "On the way" bonus stops suggestions
- [ ] South→North route option
- [ ] Custom starting point

## Phase 4: Social & Sharing
- [ ] Shareable route URLs with encoded state
- [ ] Route saving to localStorage ("שמורים" tab)
- [ ] Instagram-ready route summary card
- [ ] Telegram sharing
- [ ] Print-optimized CSS

## Phase 5: Content Enrichment
- [ ] Place detail page (dedicated page per place)
- [ ] Opening hours data
- [ ] User ratings/favorites
- [ ] "Similar places" suggestions
- [ ] Seasonal recommendations (what's good now)
- [ ] Search/filter within route results

## Phase 6: Infrastructure
- [ ] Vercel deployment with ISR + custom domain
- [ ] Google Analytics / Plausible
- [ ] SEO optimization (structured data, og:image per route)
- [ ] PWA support (offline access)
- [ ] Performance monitoring
- [ ] Error tracking (Sentry)

## Phase 7: Polish & Launch
- [ ] Dark mode
- [ ] Accessibility audit (WCAG AA)
- [ ] Onboarding flow / empty states
- [ ] "תפריט" (menu) page — about, credits, contact
- [ ] Responsive desktop layout (split map + cards)
- [ ] Landing page / marketing copy
- [ ] Soft launch + feedback collection
