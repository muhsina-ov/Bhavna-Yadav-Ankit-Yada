// ─────────────────────────────────────────────────────────────
// EDIT THIS FILE ONLY when cloning this template for a client.
// ─────────────────────────────────────────────────────────────

export const invite = {
  bride: "Bhavna Yadav",
  groom: "Ankit Yadav",
  /** Shown big in the hero */
  dateLabel: "14.10.26",
  /** Local start / end of the main function (ISO, no timezone) */
  start: "2026-10-14T19:00:00",
  end: "2026-10-14T23:00:00",
  /** IANA timezone of the venue */
  timeZoneOffset: "+05:30",
  dayLine: "Tuesday, 14th October 2026",
  timeLine: "7:00 PM onwards",
  eventTitle: "Welcome to the celebrations of Bhavna & Ankit",
  invitationNote:
    "With the blessings of our families, we invite you to share in the joy of their journey together — an evening of love, laughter, and cherished memories.",
  venue: {
    name: "Aspire Hotel and Resorts",
    address: "Aspire Hotel and Resorts, Ludhiana, Punjab",
    /** Used for the Google Maps deep link */
    query: "Aspire Hotel and Resorts, Ludhiana, Punjab",
    lat: 30.824024200439453,
    lng: 75.78478240966797,
  },
  /** Display location for envelopes and footers */
  city: "Ludhiana, Punjab",
  closing: "See you there",
  mapsLink: "https://www.google.com/maps?q=30.824024200439453,75.78478240966797",
  backgroundMusic: "https://www.instagram.com/p/Dc5gQd7M90r/",
  /** Actual audio file URL (using music.mp3 from workspace) */
  musicFileUrl: "/music.mp3",
  /** Customer reference image */
  referenceImage: "/image1.jpeg",
} as const;

export const mapsUrl = invite.mapsLink;

export const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
  invite.venue.query,
)}`;
