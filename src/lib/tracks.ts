export interface Track {
  id: string;
  title: string;
  artist: string;
}

export interface LocalTrack {
  title: string;
  artist: string;
  src: string;
}

export interface Playlist {
  name: string;
  tagline: string;
  emoji: string;
}

export const TRACKS: Track[] = [
  {
    id: "c_K2sf6QWFY",
    title: "Tujh Se Mohabbat Ka Izhar",
    artist: "Kumar Sanu & Alka Yagnik",
  },
];

export const PLAYLISTS: Playlist[] = [
  { name: "Saloon Classics", tagline: "Kasme waade, purani yaadein", emoji: "💈" },
  { name: "Dard-e-90s", tagline: "Aansu, baarish aur Kumar Sanu", emoji: "🌧️" },
  { name: "Safar", tagline: "Bus, khidki aur raat", emoji: "🚌" },
  { name: "Shaadi & Sunday", tagline: "Dhol, mehndi, poori gali", emoji: "🎉" },
];

export const SITE = {
  contactEmail: "hello@example.com",
  spotifySearchUrl:
    "https://open.spotify.com/search/90s%20hindi%20songs",
  youtubeUrl: "https://www.youtube.com/watch?v=c_K2sf6QWFY",
};
