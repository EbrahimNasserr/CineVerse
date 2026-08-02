/**
 * @typedef {Object} BookingPayload
 * @property {string} showtimeId
 * @property {string[]} seatIds
 * @property {string} paymentMethod
 * @property {Object} contact
 * @property {string} contact.name
 * @property {string} contact.email
 */

/**
 * @typedef {Object} Booking
 * @property {string} id
 * @property {string} showtimeId
 * @property {string[]} seatIds
 * @property {number} total
 * @property {string} status
 * @property {string} createdAt
 */

export {};
