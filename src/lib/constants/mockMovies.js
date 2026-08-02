/**
 * Placeholder catalog used until NEXT_PUBLIC_API_URL is wired up.
 * Content aligned with the CineVerse landing sketch.
 */
export const MOCK_MOVIES = [
  {
    id: 'mock-oppenheimer',
    title: 'Oppenheimer',
    posterUrl: 'https://picsum.photos/seed/oppenheimer-explosion/400/600',
    backdropUrl: 'https://picsum.photos/seed/oppenheimer-explosion/2400/1080',
    rating: 8.6,
    year: 2023,
    genres: ['Drama', 'History'],
    runtime: '3h 0m',
    synopsis:
      'The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb.',
  },
  {
    id: 'mock-interstellar',
    title: 'Interstellar',
    posterUrl: 'https://picsum.photos/seed/interstellar-space-saturn/400/600',
    backdropUrl: 'https://picsum.photos/seed/interstellar-space-saturn/2400/1080',
    rating: 8.7,
    year: 2014,
    genres: ['Sci-Fi', 'Adventure'],
    runtime: '2h 49m',
    synopsis:
      'A team of explorers travel through a wormhole in space in an attempt to ensure humanity\'s survival.',
  },
  {
    id: 'mock-batman',
    title: 'The Batman',
    posterUrl: 'https://picsum.photos/seed/batman-gotham-rain/400/600',
    backdropUrl: 'https://picsum.photos/seed/batman-gotham-rain/2400/1080',
    rating: 7.8,
    year: 2022,
    genres: ['Action', 'Noir'],
    runtime: '2h 56m',
    synopsis:
      'When a sadistic serial killer begins murdering key political figures in Gotham, Batman is forced to investigate.',
  },
  {
    id: 'mock-spiderverse',
    title: 'Across the Spider-Verse',
    posterUrl: 'https://picsum.photos/seed/spiderverse-neon-multiverse/400/600',
    backdropUrl: 'https://picsum.photos/seed/spiderverse-neon-multiverse/2400/1080',
    rating: 8.6,
    year: 2023,
    genres: ['Animation'],
    runtime: '2h 20m',
    synopsis:
      'Miles Morales catapults across the Multiverse, where he encounters a team of Spider-People charged with protecting its very existence.',
  },
  {
    id: 'mock-inception',
    title: 'Inception',
    posterUrl: 'https://picsum.photos/seed/inception-folding-city/400/600',
    backdropUrl: 'https://picsum.photos/seed/inception-folding-city/2400/1080',
    rating: 8.8,
    year: 2010,
    genres: ['Sci-Fi', 'Heist'],
    runtime: '2h 28m',
    synopsis:
      'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea.',
  },
  {
    id: 'mock-poor-things',
    title: 'Poor Things',
    posterUrl: 'https://picsum.photos/seed/poor-things-victorian-surreal/400/600',
    backdropUrl: 'https://picsum.photos/seed/poor-things-victorian-surreal/2400/1080',
    rating: 7.9,
    year: 2023,
    genres: ['Fantasy', 'Drama'],
    runtime: '2h 21m',
    synopsis:
      'The incredible tale about the fantastical evolution of Bella Baxter, a young woman brought back to life by a brilliant and unorthodox scientist.',
  },
];

const DEFAULT_CAST = [
  {
    name: 'Timothée Chalamet',
    role: 'Paul Atreides',
    avatarUrl: 'https://picsum.photos/seed/cast-timothee/96/96',
  },
  {
    name: 'Zendaya',
    role: 'Chani',
    avatarUrl: 'https://picsum.photos/seed/cast-zendaya/96/96',
  },
  {
    name: 'Rebecca Ferguson',
    role: 'Lady Jessica',
    avatarUrl: 'https://picsum.photos/seed/cast-rebecca/96/96',
  },
  {
    name: 'Austin Butler',
    role: 'Feyd-Rautha',
    avatarUrl: 'https://picsum.photos/seed/cast-austin/96/96',
  },
];

export const FEATURED_MOVIE = {
  id: 'mock-dune-2',
  title: 'Dune: Part Two',
  posterUrl: 'https://picsum.photos/seed/dune-part-two-desert/400/600',
  backdropUrl: 'https://picsum.photos/seed/dune-part-two-desert/2400/1080',
  rating: 9.4,
  year: 2024,
  genres: ['Sci-Fi', 'Epic'],
  runtime: '2h 46m',
  certification: 'PG-13',
  director: 'Denis Villeneuve',
  cast: DEFAULT_CAST,
  synopsis:
    'Paul Atreides unites with the Fremen to wage war against House Harkonnen. A mythic journey of revenge, destiny, and the price of becoming a messiah — Denis Villeneuve\'s most ambitious spectacle yet.',
};

export function getAllMovies() {
  return [FEATURED_MOVIE, ...MOCK_MOVIES];
}

export function getMovieById(movieId) {
  return getAllMovies().find((movie) => movie.id === movieId) ?? null;
}
