export interface SpotifySearchResponse {
  tracks: Tracks;
}

export interface Tracks {
  href: string;
  items: Item[];
  limit: number;
  next: string;
  offset: number;
  previous: any;
  total: number;
}

export interface Item {
  album: Album;
  artists: Artist2[];
  available_markets: string[];
  disc_number: number;
  duration_ms: number;
  explicit: boolean;
  external_ids: ExternalIds;
  external_urls: ExternalUrls4;
  href: string;
  id: string;
  is_local: boolean;
  name: string;
  popularity: number;
  preview_url: string;
  track_number: number;
  type: string;
  uri: string;
}

export interface Album {
  album_type: string;
  artists: Artist[];
  available_markets: string[];
  external_urls: ExternalUrls2;
  href: string;
  id: string;
  images: Image[];
  name: string;
  release_date: string;
  release_date_precision: string;
  total_tracks: number;
  type: string;
  uri: string;
}

export interface Artist {
  external_urls: ExternalUrls;
  href: string;
  id: string;
  name: string;
  type: string;
  uri: string;
}

export interface ExternalUrls {
  spotify: string;
}

export interface ExternalUrls2 {
  spotify: string;
}

export interface Image {
  height: number;
  url: string;
  width: number;
}

export interface Artist2 {
  external_urls: ExternalUrls3;
  href: string;
  id: string;
  name: string;
  type: string;
  uri: string;
}

export interface ExternalUrls3 {
  spotify: string;
}

export interface ExternalIds {
  isrc: string;
}

export interface ExternalUrls4 {
  spotify: string;
}

export interface SpotifyProfile {
  display_name: string;
  email: string;
  external_urls: ProfileExternalUrls;
  followers: Followers;
  href: string;
  id: string;
  images: any[];
  type: string;
  uri: string;
}

export interface ProfileExternalUrls {
  spotify: string;
}

export interface Followers {
  href: any;
  total: number;
}

export interface SpotifyCreatedPlaylist {
  collaborative: boolean;
  description: string;
  external_urls: PlaylistExternalUrls;
  followers: PlaylistFollowers;
  href: string;
  id: string;
  images: any[];
  name: string;
  owner: Owner;
  primary_color: any;
  public: boolean;
  snapshot_id: string;
  tracks: PlaylistTracks;
  type: string;
  uri: string;
}

export interface PlaylistExternalUrls {
  spotify: string;
}

export interface PlaylistFollowers {
  href: any;
  total: number;
}

export interface Owner {
  display_name: string;
  external_urls: PlaylistExternalUrls2;
  href: string;
  id: string;
  type: string;
  uri: string;
}

export interface PlaylistExternalUrls2 {
  spotify: string;
}

export interface PlaylistTracks {
  href: string;
  items: any[];
  limit: number;
  next: any;
  offset: number;
  previous: any;
  total: number;
}
