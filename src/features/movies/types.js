/**
 * @typedef {Object} CastMember
 * @property {string} _id
 * @property {string} name
 * @property {string} character
 * @property {string} image
 */

/**
 * @typedef {Object} Movie
 * @property {string}       _id
 * @property {string}       title
 * @property {string}       slug
 * @property {string}       description
 * @property {string}       poster
 * @property {string}       backdrop
 * @property {string}       trailer
 * @property {CastMember[]} cast
 * @property {string[]}     genres
 * @property {string[]}     languages
 * @property {number}       duration        - Runtime in minutes
 * @property {string}       releaseDate     - ISO 8601 date string
 * @property {string}       director
 * @property {string}       writer
 * @property {string}       production
 * @property {string}       country
 * @property {number}       imdbRating
 * @property {string}       ageRating
 * @property {string}       status          - e.g. "Released", "Upcoming"
 * @property {boolean}      featured
 * @property {boolean}      trending
 * @property {boolean}      isActive
 * @property {any[]}        slots
 * @property {string}       createdAt
 * @property {string}       updatedAt
 */

/**
 * @typedef {Object} Pagination
 * @property {number}  page
 * @property {number}  limit
 * @property {number}  total
 * @property {number}  totalPages
 * @property {boolean} hasNextPage
 * @property {boolean} hasPrevPage
 */

/**
 * @typedef {Object} MoviesListResponse
 * @property {boolean}    success
 * @property {string}     message
 * @property {Movie[]}    data
 * @property {Pagination} pagination
 */

/**
 * @typedef {Object} MovieResponse
 * @property {boolean} success
 * @property {string}  message
 * @property {Movie}   data
 */

/**
 * @typedef {Object} MoviesQueryParams
 * @property {number} [page]
 * @property {number} [limit]
 * @property {string} [search]
 * @property {string} [genre]
 * @property {string} [status]
 * @property {string} [sort]
 */

export {};
