export interface Song {
  id: string;
  title: string;
  artist: string;
  duration: string;
  thumbnail?: string;
}

export enum PlayerState {
  PLAYING = 'PLAYING',
  PAUSED = 'PAUSED',
  STOPPED = 'STOPPED'
}

export interface PlaylistResponse {
  playlistName: string;
  songs: {
    title: string;
    artist: string;
    duration: string;
  }[];
}

export interface CassetteTheme {
  id: string;
  name: string;
  colors: {
    body: string;      // Main plastic color
    dark: string;      // Bottom trapezoid/shadow
    label: string;     // Sticker background
    header: string;    // The strip at the top of the label
    screw: string;     // Screw color
  }
}