# CineVerse — Cinematic Immersive Movie Booking

CineVerse is a polished movie booking experience built with Next.js 14, React, Tailwind CSS, Redux Toolkit, and RTK Query. The app pairs a cinematic dark-theme interface with a functional booking flow for browsing movies, selecting showtimes, reserving seats, and completing checkout.

## Overview

This project is designed as a modern movie-booking front end with:

- a cinematic landing experience and immersive UI
- movie listings and detail pages with mock fallbacks
- a booking flow that moves from theater/showtime selection to seat selection and checkout
- Redux-powered client state for auth, filters, seats, and checkout progress
- a flexible API layer that can be connected to a real backend via RTK Query

## Features

- Movie catalog browsing with genre filters
- Cinematic movie cards and hero sections
- Detailed movie pages with synopsis, metadata, and booking panel
- Theater and showtime selection for a chosen movie
- Seat selection and checkout flow
- Protected-route structure for authenticated experiences
- Admin route shells for future movie/showtime management
- Smooth scrolling experience powered by Lenis

## Tech Stack

- Next.js 14 (App Router)
- React 18
- Tailwind CSS
- Redux Toolkit + RTK Query
- React Hook Form + Zod
- Lucide React icons
- Lenis for smooth scroll behavior

## Prerequisites

Make sure you have the following installed:

- Node.js 18 or newer
- npm 9 or newer

## Installation

```bash
npm install
```

## Environment Variables

Create a `.env.local` file in the project root and add any API endpoint you want to use:

```env
NEXT_PUBLIC_API_URL=https://your-api-url.com
```

If this variable is not set, the app will fall back to built-in mock movie and showtime data so the UI still renders.

## Available Scripts

```bash
npm run dev
```

Start the development server at http://localhost:3000.

```bash
npm run build
```

Create a production build.

```bash
npm run start
```

Run the production build locally.

## Project Structure

```text
src/
  app/                 # App Router pages and layouts
  components/          # Shared UI and layout components
  features/            # Feature-based modules: auth, movies, booking, seats, showtimes
  hooks/               # Custom React hooks
  lib/                 # Constants, helpers, validators, API base setup
  store/               # Redux store and hooks
```

## Main Routes

- `/` — home page
- `/movies` — movie listing page
- `/movies/[movieId]` — movie detail page with booking panel
- `/booking/[showtimeId]` — seat selection page
- `/booking/[showtimeId]/checkout` — checkout experience
- `/bookings` and `/bookings/[bookingId]` — booking history and detail views
- `/login` and `/register` — authentication entry points
- `/admin/movies` and `/admin/showtimes` — placeholder admin pages

## State and Data Flow

- Redux slices handle client-side UI state such as auth, selected seats, checkout flow, and active movie filters.
- RTK Query endpoints are organized under the feature modules and use the shared base query setup in [src/lib/api/baseQuery.js](src/lib/api/baseQuery.js).
- Mock data is used as a fallback to keep the experience functional even without a live backend.

## Design Notes

The UI is intentionally crafted around a dark cinematic theme with obsidian and crimson accents. Components are hand-built rather than relying on a third-party UI kit, and Tailwind is used as the styling system.

## Notes for Future Expansion

- Connect the app to a real movie/showtime API via `NEXT_PUBLIC_API_URL`
- Replace mock data with production-backed data and real authentication
- Build out the admin CRUD interfaces for movies and showtimes
- Add persistence for seat reservations and bookings
