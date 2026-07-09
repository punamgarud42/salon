# Vermé — Salon & Beauty Academy Platform

**All 10 phases complete** — Design System, Homepage, Salon Booking, the Academy, Gallery + Before/After, Testimonials + Offers, Contact + Multi-language, the Owner Admin Dashboard, Payments, and SEO & Performance Polish.

**Ready to put this live? See [`DEPLOYMENT.md`](./DEPLOYMENT.md)** for a
full step-by-step guide (MongoDB Atlas + Render + Vercel, all free-tier,
plus a VPS alternative).

## Phase 10 — SEO & Performance Polish (new in this delivery, final phase)

### The one thing worth reading before anything else

This is a client-side React SPA using **hash-based routing**
(`#/services`, `#/book`, etc.). Search engines treat everything after a
`#` as the same URL, not a separate indexable page — no amount of meta
tags changes that. So this phase does everything that's genuinely
achievable within that architecture, and is explicit about the one thing
that isn't (see `public/sitemap.xml`'s comment for the two real ways to
get every page separately indexed — path-based routing plus server
config, or migrating to server-side rendering/pre-rendering).

### What's real here

- **Meta tags, Open Graph, Twitter Cards, `robots.txt`, `sitemap.xml`,
  canonical URL** — all in `index.html` / `public/`. Replace
  `your-domain.example` with your real domain once you have one.
- **schema.org structured data** (`BeautySalon` JSON-LD) — a static
  snapshot in `index.html`, kept in sync at runtime with real business
  info once it loads from the backend (`lib/seo.js`'s
  `patchBusinessJsonLd`), so editing Business Info in the admin dashboard
  keeps this accurate without a rebuild.
- **Per-page document titles + meta descriptions**
  (`hooks/usePageMeta.js` + the `PAGE_META` table in `lib/seo.js`) — real
  value for the browser tab and any link-preview bot that executes JS,
  even though it doesn't create separately-indexed pages.
- **Faster font loading** — Google Fonts moved from a CSS `@import`
  (which the browser can't discover until it's already downloaded and
  parsed the stylesheet containing it) to a real `<link rel="stylesheet">`
  with `preconnect` hints in `index.html`, discovered immediately.
- **Code-split admin bundle** — `AdminApp` is now `React.lazy`-loaded
  (`App.jsx`). Public visitors' initial download no longer includes any
  of the admin dashboard's forms/tables/auth code — a real, measurable
  amount of JavaScript that a customer booking an appointment never
  needed in the first place.
- **Accessibility pass** — every placeholder-only form input across
  Booking, Enrollment, and Contact now has a proper `aria-label` (a
  placeholder alone is a known screen-reader gap: it's not a persistent
  accessible name, and disappears the moment someone starts typing).
- **SVG favicon** using the existing gold monogram, so the browser tab
  matches the brand instead of showing a generic icon.

### What's intentionally not here

- **`og:image` / social share image** — a real, on-brand 1200×630px image
  is a design-asset task, not a code task. Noted directly in `index.html`
  where it would go.
- **`apple-touch-icon` (PNG)** — same reasoning; needs a real multi-size
  design pass for iOS's rounded-mask safe area. The SVG favicon covers
  all modern browsers in the meantime.
- **Image optimization guidance** (the phase brief's third item) — this
  project has no photographic assets to optimize (every visual is an
  original SVG icon illustration or CSS gradient, by deliberate choice
  since Phase 3 — see the notes in `data/gallery.js` /
  `data/beforeAfter.js`). Once you add real studio photography, the
  standard guidance applies: serve `.webp` with a fallback, size images
  for their actual display dimensions, and add `loading="lazy"` to any
  below-the-fold `<img>` tags — there's just nothing to apply that to
  yet.

### Final QA pass

Reviewed across all 10 phases: every internal link/route resolves to a
real page (no leftover "coming soon" placeholders), every data file's
exports match what consuming components import (verified with a full
cross-reference sweep, not just spot checks), every JS/JSX file is
brace/paren/bracket-balanced and passes `node --check` where applicable,
no stray debug `console.log` statements (only intentional `console.warn`/
`console.error` for the fallback patterns and server startup logs),
responsive breakpoints exist on every page, and focus-visible outlines are
global. I don't have a browser in this environment to click through a
live render, so this was a thorough static/code review rather than
visual QA — genuinely test it in a real browser once you `npm install &&
npm run dev` both sides, and let me know if anything doesn't match what's
described here.

---

## Phase 9 — Payments (new in this delivery)

### The one thing worth reading before anything else

I did **not** build a custom credit-card entry form, even a fake one for
demo purposes. A form with card number/expiry/CVV fields that doesn't
actually process anything would look identical to one that does — that's
actively misleading, not just an incomplete feature. Instead:

- **With real Razorpay keys configured**, this integrates their actual
  hosted Checkout widget. Card data never touches this codebase at all —
  Razorpay's modal collects it directly and handles PCI compliance
  entirely on their end. This is the standard, correct way to integrate a
  payment gateway, not a simplification.
- **Without keys configured** (the default state), visitors see an
  honestly-labeled "demo payment" screen that says outright no real
  gateway is connected, with a "Simulate Successful Payment" button so you
  can test the rest of the flow — receipt generation, payment history —
  before going live.

### How it works

1. After a booking or enrollment is confirmed, a **"Pay ₹X Now"** button
   appears (only if the service/course has a price > 0) linking to
   `#/pay?type=booking|enrollment&ref=<reference number>`.
2. `pages/Payment.jsx` looks up the amount due from the **stored**
   booking/enrollment record — never from the client, and never
   re-derived from the service/course's *current* price. `amount` is now
   captured on the `Booking`/`Enrollment` documents at creation time (see
   the comment in `Booking.model.js`), so if you change a service's price
   later, customers who already booked at the old price still pay what
   they were quoted.
3. `POST /api/payments/create-order` re-derives the amount server-side
   again (never trusts the request body) and either creates a real
   Razorpay order or a demo `Payment` record.
4. Real mode: Razorpay's Checkout opens, and on success
   `POST /api/payments/verify` **recomputes the HMAC signature
   server-side** using the secret key and compares it to what the
   checkout callback returned. This is the actual fraud-prevention step —
   trusting the frontend's "it succeeded" callback alone would let anyone
   fake a paid receipt.
5. Either path ends in a receipt screen with a real, working **download**
   (plain-text, not a designed PDF — see the scope note in
   `lib/download.js`; same honest tradeoff as the Phase 4 brochure). Demo
   receipts say **"DEMO PAYMENT — NO REAL MONEY WAS CHARGED"** in capital
   letters, so one can never be mistaken for proof of a real transaction.

### Going live with real payments

```bash
# backend/.env
RAZORPAY_KEY_ID=rzp_test_...       # or rzp_live_... when ready
RAZORPAY_KEY_SECRET=...
```

Get these from the [Razorpay Dashboard](https://dashboard.razorpay.com/app/keys)
— test-mode keys work for trying the real checkout flow (with Razorpay's
test card numbers) before switching to live keys. No frontend changes are
needed either way; the backend tells the frontend which mode it's in.

**Backend additions:** `Payment` model; `/api/payments/lookup` (public),
`/api/payments/create-order` (public, amount always re-derived
server-side), `/api/payments/verify` (public, but the real security step),
`/api/payments/demo-confirm` (public, demo-mode only, refuses to touch a
real Razorpay payment), `/api/payments` (admin-only, full history). Admin
dashboard gained a read-only **Payment History** page and a count on the
overview.

### Scope notes

- Receipts are plain-text downloads, not designed PDF invoices with your
  letterhead/branding — a natural fit for Phase 10's polish pass if you
  want a real PDF template.
- Only Razorpay is wired up (matches the original plan's "Razorpay/Stripe"
  either-or). Adding Stripe alongside it would mean a second `method`
  value and a parallel `create-order`/`verify` path — the `Payment` model
  already has a `method` field anticipating this.
- No refund flow yet — cancelling a booking/enrollment in the admin
  dashboard (Phase 8) updates its status but doesn't touch any associated
  `Payment` record or trigger a Razorpay refund. Flag it if you'd like
  that added.

---

## Phase 8 — Owner Admin Dashboard (new in this delivery)

This phase changed the project's architecture, not just added a page —
worth reading before you dive into the dashboard itself.

### The architecture shift

Through Phase 7, content (services, courses, gallery, testimonials, offers)
lived in each visitor's own browser `localStorage`. That was fine for a
demo, but it meant an admin dashboard editing `localStorage` would only be
visible **on the admin's own browser** — not to real customers on other
devices. That would make "changes reflected live on the site" false for
anyone except the owner.

So this phase makes **the backend the real source of truth** for all
content. Every content type now has a real MongoDB model and REST API;
public pages fetch from the backend first and only fall back to local
defaults if it's unreachable (the same resilience pattern used everywhere
else in this project — newsletter, booking availability, batch seats).
Concretely:

- New models + full CRUD: `GalleryItem`, `Testimonial`, `Offer`,
  `AcademyHighlight` (services/courses/batches already had models since
  Phases 3–4; they just gained admin protection and consistent `id` fields
  this phase).
- New hooks: `useBackedList` / `useBackedObject` — the one mechanism every
  public page uses to read content, replacing the old synchronous
  `localStorage`-only getters.
- `BusinessInfo` (which already existed since Phase 1 but was never wired
  to the frontend) now actually powers the Footer, WhatsApp button, and
  Contact page.

### Real authentication

There's a single admin account, configured via environment variables
rather than a signup flow (this is a single-owner salon site, not a
multi-tenant SaaS):

```bash
cd backend
node scripts/generate-admin-hash.js "your-chosen-password"
# paste the output into .env as ADMIN_PASSWORD_HASH
# also set ADMIN_EMAIL and JWT_SECRET in .env — see .env.example
```

Login issues a JWT (`POST /api/auth/login`); every mutating endpoint
(`POST`/`PUT`/`DELETE` on services, courses, batches, gallery,
testimonials, offers, academy highlights, business info) and every
transactional list endpoint (bookings, enrollments, contact messages,
newsletter subscribers) requires it via `requireAdmin` middleware
(`backend/src/middleware/requireAdmin.js`). **This is the real security
boundary** — the frontend's login screen is only a UX nicety; a request
straight to the API without a valid token still gets a real 401.

### The dashboard itself

Visit `#/admin` on the running site (there's a small "Admin" link in the
footer). Sections, all built on two generic, reusable components rather
than N hand-built pages:

- **`AdminResourceManager`** (config-driven CRUD: table + add/edit modal)
  powers Services, Courses, Batches, Gallery, Testimonials, Offers, and
  Academy Highlights. Each of those admin pages is a ~20-line config
  object — see `pages/admin/AdminServices.jsx` for the shortest example.
- **`AdminListViewer`** (read-only table + optional status dropdown)
  powers Appointments, Applications, Contact Messages, and Newsletter
  Subscribers — this is real customer-generated data, so there's no
  add/edit/delete, only a status change where that makes sense (e.g.
  marking a booking completed or cancelled, which frees its slot back up
  automatically thanks to the database constraints built in Phases 3–4).
- **Business Info** is a dedicated single-document form (not a list).

### Scope notes (honest, same spirit as every other phase)

- The admin dashboard UI itself is **English-only**. Translating an
  internal owner-facing tool into Marathi/Hindi felt like the wrong thing
  to spend the multi-language effort on versus the customer-facing site
  (Phase 7) — flag it if you'd like that added.
- Before/after comparison content (Phase 5) has no admin management yet —
  it's a small, illustrative dataset without its own backend model. Adding
  one would follow the exact same pattern as Gallery if you want it.
- Seat-capacity checks (bookings, enrollments) are "check, then insert" —
  correct for real-world small-salon volume, but not wrapped in a database
  transaction, so there's a theoretical race window under very high
  concurrency. Documented in the relevant controllers.

---

## Phase 7 — Contact + Multi-language (new in this delivery)

- **Full Contact page** (`pages/Contact.jsx`) — a real, validated contact
  form (`components/contact/ContactForm.jsx`) that posts to the backend
  with the same localStorage-fallback pattern as every other form in this
  project, a map section, business details, and social links.
- **Honest map placeholder** (`components/contact/MapPlaceholder.jsx`): NOT
  a real Google Maps embed. The address used throughout this project
  ("Shop 12, MG Road, Nagpur…") is placeholder content, not a real verified
  location — embedding a real map pinned to a fake address would be more
  misleading than an honest placeholder. Swap it for a real Google Maps
  embed (Share → Embed a map on your real listing) once you have one; the
  comment in that file walks through exactly how.
- **Social links consolidated**: previously hard-coded inline in
  `Footer.jsx`; now one `data/socials.js` + `components/ui/SocialLinks.jsx`
  used by both the footer and the Contact page.
- **Multi-language, finished**: every page's headings, eyebrows, intro
  copy, form labels/placeholders, buttons, and confirmation screens are now
  translated (EN done since Phase 1; MR/HI filled in this phase) — not just
  nav/footer. Try the language switcher on any page, not just the
  homepage. See the scope note at the top of `i18n/dictionary.js`: business
  *content* (service/course descriptions, testimonial quotes, offer copy)
  stays in English intentionally — auto-generating professional Marathi/
  Hindi marketing copy isn't something to do without your review. A few
  deep, low-visibility labels (e.g. the `<dl>` field names on booking/
  enrollment confirmation screens, batch seat-status badge text) also
  remain English for now — flag it if you'd like those covered too.
- Marathi and Hindi translations are best-effort; the file recommends a
  native-speaker review pass before this goes live for real customers,
  same spirit as the Phase 1 placeholder notice.

**Backend addition:** `ContactMessage` model + `POST /api/contact` (create)
+ `GET /api/contact` (list, for Phase 8's dashboard, currently
unauthenticated like the rest).

**Routing:** every nav destination is now a real page. The `ComingSoon`
component is no longer used anywhere but is kept in the codebase in case a
future page needs a placeholder again.

---

## Phase 6 — Testimonials + Offers/Promotions (new in this delivery)

- **Full Testimonials page** (`pages/Testimonials.jsx`) — an average-rating
  summary (computed live from the list, with a count-up animation matching
  the homepage stats), all 8 testimonials, and 3 video-testimonial
  placeholder cards.
- **Video placeholder, honestly**: the phase brief explicitly calls for a
  "video placeholder," so `VideoTestimonialPlaceholder.jsx` is exactly
  that — a styled stand-in with a play button that, when clicked, tells the
  visitor plainly that real videos will go here once recorded. Swap its
  frame for a real `<video>` or embed whenever you have actual client
  recordings.
- **Full Offers page** (`pages/Offers.jsx`) — 5 concurrent offers across
  categories, each with a **live countdown timer** and a **real working
  "copy code" button** (`hooks/useCopyToClipboard.js` — actually writes to
  the clipboard, with a fallback for contexts where the modern Clipboard
  API isn't available). Category filter tabs, same shared `FilterTabs`
  component as Services/Academy/Gallery.
- **Refactors** (same instinct as Phase 5): the homepage's testimonial
  cards and offer banner were both hand-rolled inline in Phase 2; now
  they're shared components (`TestimonialCard`, `PromoBanner`) used by
  both the homepage previews and these new full pages — same visual, one
  place to edit.

No new backend endpoints this phase, same reasoning as Phase 5 — reviews
and promotions don't need the server-side conflict logic bookings/
enrollments do, so they follow the same owner-editable localStorage
pattern. (A "leave a review" submission form with real backend storage
would be a reasonable future addition, but wasn't part of this phase's
brief — flag it if you want it added.)

**Routing:** `/testimonials` and `/offers` are now real pages (previously
"coming soon" placeholders).

---

## Phase 5 — Gallery + Before/After (new in this delivery)

- **Full Gallery page** (`pages/Gallery.jsx`) — a filterable masonry grid
  (`components/gallery/GalleryGrid.jsx`) of 12 items across every category,
  with `tall`/`wide` size variants for visual rhythm, and a **lightbox**
  (`GalleryLightbox.jsx`) with click/keyboard (Esc, ←/→) navigation between
  items.
- **Interactive before/after slider** (`components/gallery/BeforeAfterSlider.jsx`)
  — a real, working drag comparison: mouse, touch, and keyboard (arrow keys
  on the focused handle) all work through the same Pointer Events code
  path. One pair per category (Hair, Skin, Makeup, Mehendi), switchable via
  tabs.
- **Honest note on before/after content**: the panels shown are
  illustrative (muted vs vibrant versions of the same icon), not real
  client photos — see the important comment in `data/beforeAfter.js` for
  why (no real photography exists yet, and publishing a fake "result"
  photo would misrepresent real outcomes even as a placeholder). The
  slider mechanism itself is fully real and works identically once you
  swap in real `<img>` content with client consent.
- **Refactor**: Services, Academy, and now Gallery all needed the same
  category-filter tabs, so that markup/CSS is now one shared
  `components/ui/FilterTabs.jsx`, and the category-to-gradient color map
  (previously duplicated in `ServiceCard` and `CourseCard`) is now one
  `lib/categoryTheme.js`. Both existing pages were updated to use them —
  no visual change, just one less place to edit when a category's look
  needs to change.

No new backend endpoints this phase — gallery/before-after content doesn't
need server-side conflict logic the way bookings/enrollments do, so it
follows the same owner-editable localStorage pattern as services/courses.

**Routing:** `/gallery` is now a real page (previously a "coming soon"
placeholder).

---

## Phase 4 — Beauty Academy + Courses + Enrollment (new in this delivery)

- **Academy page** (`pages/Academy.jsx`) — 6 real courses across
  Hair/Makeup/Skin/Mehendi/Bridal with category filter tabs, built on a new
  `CourseCard` component (mirrors `ServiceCard`'s layout for visual
  consistency).
- **Working brochure download** — "Download Brochure" on every course card
  generates and downloads a real text file client-side (`lib/download.js`),
  no backend needed. It's a plain-text summary, not a designed PDF — a
  branded PDF brochure is a design-asset task, natural to slot into
  Phase 10's polish pass if you want one.
- **Batch calendar** (`components/academy/BatchCalendar.jsx`) — every
  upcoming batch with **live seat-status badges** (Open / Filling Fast /
  Full) computed from real enrollment counts, not a hand-maintained number.
- **Enrollment form** (`pages/Enrollment.jsx`) — course → batch (full
  batches are shown but disabled) → applicant details (name, phone, email,
  age, qualification, address), full validation, confirmation screen with a
  reference number and a one-tap WhatsApp message.
- **Real seat-capacity enforcement**: the frontend fetches live availability
  from `GET /api/batches` (falls back to counting localStorage enrollments
  if the backend's offline — same fallback pattern as Phase 3's booking
  slots); the backend **re-checks capacity at write time** in
  `POST /api/enrollments` so two applicants can't both grab the last seat
  in the small race window between page load and submit.

**Backend additions:** `Course`, `Batch`, `Enrollment` models;
`/api/courses` (full CRUD), `/api/batches` (list with live seat counts
joined from real enrollment data, create/update), `/api/enrollments`
(create with capacity re-check + server-generated reference number, list
for Phase 8's dashboard). All write routes are unauthenticated for now,
marked `TODO Phase 8`.

**Routing:** `/academy` and `/enroll` are now real pages (previously
"coming soon" placeholders from Phase 3).

---

## Phase 3 — Salon Services + Booking System (new in this delivery)

- A lightweight **hash router** (`frontend/src/router/useHashRoute.js`, no
  external library) now actually switches pages: `#/`, `#/services`,
  `#/book`, `#/book?service=<id>`. Nav links that lead to phases not built
  yet (Academy, Gallery, Testimonials, Offers, Contact) show a polished
  "coming soon" page tagged with the phase that builds them, instead of a
  blank or broken route.
- **Services page** (`pages/Services.jsx`) — the full catalogue (9 services
  across Hair/Makeup/Skin/Mehendi) with category filter tabs, built on a
  new shared `ServiceCard` component also used by the homepage preview, so
  a service looks identical everywhere it appears.
- **Booking page** (`pages/Booking.jsx`) — a real, working appointment flow:
  1. choose a service, 2. choose a date (native date picker, bounded to
  today–60 days out), 3. pick a real available time slot (already-booked
  and past-time slots are greyed out and disabled), 4. enter contact
  details (validated: name, 10-digit Indian mobile, optional email). On
  submit, generates a confirmation with a reference number and offers a
  one-tap WhatsApp message to the salon with the booking details.
- **Real double-booking prevention**, not just decorative: the frontend
  checks `GET /api/bookings/availability` before showing slots, and the
  backend's `Booking` model has a **unique compound index**
  (service + date + start time) so two people can't be given the same
  slot even if they submit at the exact same moment — the database itself
  rejects the second one (`POST /api/bookings` returns `409` in that case).
  If the backend isn't running, the frontend falls back to checking
  `localStorage` bookings instead, so the demo still works standalone —
  same pattern as the Phase 2 newsletter form.
- **Salon-themed icon illustrations** (`components/ui/SalonIcon.jsx`) —
  original line-art (scissors, lipstick, henna cone, graduation cap, veil,
  leaf), not stock photography, used on service cards and the gallery
  preview tiles. See the note in `data/gallery.js` on why stock/scraped
  photos weren't used and how to swap in real studio photos later.

**Backend additions:** `Service` model + full CRUD routes (`/api/services`),
`Booking` model + `/api/bookings` (create), `/api/bookings/availability`
(the real conflict check), `/api/bookings` `GET` (for Phase 8's dashboard).
Write routes are unauthenticated for now — Phase 8 adds admin auth
middleware, marked with `TODO` comments at each route.

---

## Phase 2 — Homepage

`frontend/src/pages/Home.jsx` is now the real homepage, assembled from
self-contained sections in `frontend/src/components/home/`:

- **Hero** — parallax gold-glow layer behind the headline (`useParallax`
  hook), scroll cue, dual CTAs
- **StatsBar** — four stats that count up from 0 when scrolled into view
  (`useCountUp` hook)
- **FeaturedServices** — 4 service cards pulled from `data/services.js`
- **AcademyHighlights** — split layout with a placeholder visual panel and
  a bulleted highlight list from `data/academy.js`
- **TestimonialPreview** — 3 testimonial cards with star ratings
  (`StarRating`, reused as-is in Phase 6) from `data/testimonials.js`
- **OffersPreview** — a promo banner with a **live, real countdown timer**
  (`useCountdown` hook, ticks every second) from `data/offers.js`
- **GalleryPreview** — a 6-tile gradient-placeholder grid from
  `data/gallery.js` (see note on images below)
- **Newsletter** — a signup form that **actually posts to the backend**
  (`POST /api/newsletter/subscribe`), and falls back to saving locally if
  the backend isn't running, so the flow always completes

Every section fades/slides in via the shared `Reveal` component
(`useScrollReveal` hook) — this is the one mechanism used for *all*
scroll-reveal animation on the site, so later phases should reuse `<Reveal>`
rather than adding new animation approaches.

**On images:** the gallery preview and service cards use gradient
placeholder swatches instead of stock photography. This is a real
business's homepage — the right images are the owner's actual salon/work
photos, which Phase 5 (Gallery) is built to accept. Using generic stock
photos here would look worse than an honest placeholder once real photos
go in.

**On content:** every section reads from a small data file in
`frontend/src/data/` via a `getX()` helper that checks for an owner-edited
override in `localStorage` first (see `data/services.js` for the pattern).
This means Phase 3/4/5/6's admin editing will make the homepage update
automatically — no changes needed here later.

**Backend addition:** `NewsletterSubscriber` model +
`POST /api/newsletter/subscribe` / `GET /api/newsletter/subscribers`
(the latter for Phase 8's dashboard, currently open/unauthenticated).

---

**Phase 1 — Design System & Navigation.** This delivers a working,
running project (frontend + backend) with the shared visual language and
site chrome that every later phase builds on: color/type tokens, Button,
Card, the signature `KumkumDivider` motif, sticky Navbar, animated
MobileMenu, Footer, floating WhatsApp button (already fully functional —
no backend needed for that one), scroll progress bar, and a working
language-switcher shell (EN done, MR/HI wired up with placeholder copy for
Phase 7 to finish).

## Stack (recommended, already set up in this repo)

- **Frontend:** React + Vite. Chosen over plain HTML/JS because Phase 8's
  admin dashboard needs real component state and reactivity, and over
  Next.js because you explicitly want a separate backend — a plain SPA
  keeps that boundary clean and easy to deploy (e.g. frontend on
  Vercel/Netlify, backend on Render/Railway).
- **Backend:** Node.js + Express + MongoDB (via Mongoose). MongoDB over
  PostgreSQL here because most of this app's data — services, courses,
  gallery items, offers, testimonials — is document-shaped and will change
  shape as you add fields (e.g. a new course property), which Mongoose
  handles without migrations. If you later want relational integrity
  (e.g. strict foreign keys between bookings and services), Postgres +
  Prisma is a reasonable swap — the route/controller structure here would
  transfer with moderate changes.

## What's real vs. placeholder in Phase 1

| Piece | Status |
|---|---|
| Design tokens, Button, Card, KumkumDivider | Real, final |
| Navbar (sticky, scroll-aware), MobileMenu, Footer | Real, final |
| WhatsApp floating button | Real, final — **works with zero backend**, just edit the phone number |
| Scroll progress bar | Real, final |
| Language selector (EN/MR/HI) + persistence | Mechanism real & final; MR/HI **copy** is placeholder (marked `TODO` in `frontend/src/i18n/dictionary.js`) until Phase 7 |
| `Home.jsx` page content | **Placeholder** — a design-system showcase, not the real homepage. Phase 2 replaces its contents entirely |
| Backend `BusinessInfo` model + routes | Real, minimal — enough for the Footer/WhatsApp data to eventually come from the database in Phase 8, not yet wired to the frontend |
| Everything payments/SMS/email related | Not started — Phase 9 and the confirmation steps in Phases 3/4 |

## Running it locally

**Order matters now** (didn't in earlier phases): start the backend
first, since the frontend fetches all content from it on load.

### Backend

```bash
cd backend
cp .env.example .env
# edit .env:
#  - MONGO_URI: a local Mongo instance or a free MongoDB Atlas cluster
#  - JWT_SECRET: any long random string (see the comment in .env.example
#    for a one-line command to generate one)
#  - ADMIN_EMAIL: whatever you want to log into the dashboard with
#  - ADMIN_PASSWORD_HASH: run `node scripts/generate-admin-hash.js "your-password"`
#    from this backend/ folder and paste the output here
#  - RAZORPAY_KEY_ID / RAZORPAY_KEY_SECRET: optional — leave blank to run
#    in the honest demo payment mode (see the Phase 9 section above)
npm install
npm run dev
```

Confirms it's running: `curl http://localhost:5000/api/health` should
return `{"status":"ok", ...}`. Every content endpoint
(`/api/services`, `/api/courses`, `/api/gallery`, `/api/testimonials`,
`/api/offers`, `/api/academy-highlights`, `/api/business-info`)
auto-seeds sensible starting content on its first request — you don't
need to manually populate the database before first run.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Opens at `http://localhost:5173`. Try: resizing to mobile width, the
language switcher, the WhatsApp button (opens a real chat — replace the
placeholder number via the admin dashboard's Business Info page first),
and `#/admin` (small "Admin" link in the footer) to log into the
dashboard and edit content — changes appear on the public pages
immediately (no rebuild, just a page refresh), because both are reading
from the same backend now.

If the backend isn't running, the public site still works — every page
falls back to local placeholder content, same as every phase before this
one — but the admin dashboard requires the backend, since there's nothing
to log into or save to without it.

**Before deploying for real:** replace `your-domain.example` in
`frontend/index.html` (canonical URL, Open Graph/Twitter tags),
`frontend/public/robots.txt`, and `frontend/public/sitemap.xml` with your
actual domain — a simple find-and-replace across those three files.

## Design rationale (why it looks like this)

The brief said "luxury salon + academy," which nudges toward either a
cream-and-serif beauty-brand look or a generic dark-mode SaaS look. Neither
says anything specific about *this* business, so the direction taken here
is grounded in the Indian salon/vanity-room world instead:

- **Palette** — deep aubergine-black (`#1B1420`) instead of the common
  cream beauty-brand background, with brushed champagne gold (`#C9A15A`)
  as the precision accent and dusty rose (`#C98A93`) as the warm/human
  note — closer to how a mirror-lit vanity counter actually looks than a
  bright, flat beauty-app palette.
- **Type** — Fraunces (a characterful, slightly eccentric serif) for
  headings, Manrope for body/UI — a pairing chosen for restraint against a
  dark ground rather than the high-contrast serif-on-cream look that's
  become an AI-design default.
- **Signature motif** — `KumkumDivider`, a hand-swept gold ink stroke
  (see `frontend/src/components/ui/KumkumDivider.jsx`) used as section
  dividers everywhere a generic straight `<hr>` or numbered `01/02/03`
  marker would otherwise go. It references a kumkum/sindoor swipe and a
  mirror's gilt edge — specific to this subject rather than decorative.
- **Card hover** — a diagonal "mirror shine" gleam sweep, a single quiet
  motion detail rather than piling on multiple hover effects.

## Roadmap (unchanged from the original plan)

1. ✅ Design System & Navigation
2. ✅ Homepage (hero, stats, previews, scroll-reveal)
3. ✅ Salon Services + Booking System
4. ✅ Beauty Academy + Courses + Enrollment
5. ✅ Gallery + Before/After
6. ✅ Testimonials + Offers/Promotions
7. ✅ Contact + Multi-language
8. ✅ Owner Admin Dashboard
9. ✅ Payments (UI + flow, backend-ready — flagged where your real gateway keys plug in)
10. ✅ SEO & Performance Polish — **this delivery, final phase**

## Honest scope reminder

- Payments (Razorpay/Stripe actually charging cards) and real SMS/email
  sending need your own API keys/merchant account — Phase 9 builds the full
  UI and backend endpoints wired to accept those keys, but can't move real
  money without them.
- WhatsApp deep-linking (already working in this phase) needs nothing from
  you but your business's WhatsApp number.
- Multi-language and "instant owner updates" are both fully achievable
  client-side (localStorage now; Phase 8 can optionally move owner edits to
  the real database via the backend above, which is why that model exists
  already).

Ready for review — say the word and Phase 2 (Homepage) starts from this
exact foundation.


Email: admin@salonacademy.com
Password: Admin@123
Hash: $2a$10$eh5QzYZLxXXIUa/lK6oaF.749Oh8Q1LaexsqoeKLcP70Keehh3mGu
You c