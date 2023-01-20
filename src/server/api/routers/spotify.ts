import { env } from "@/env/server.mjs";
import { RateLimit } from "async-sema";
import {
  SpotifyCreatedPlaylist,
  SpotifySearchResponse,
} from "src/types/spotify";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export async function refreshAccessToken(token: string) {
  try {
    const url = "https://accounts.spotify.com/api/token";

    const response = await fetch(url, {
      headers: {
        Authorization:
          "Basic " +
          Buffer.from(
            `${env.SPOTIFY_CLIENT_ID}:${env.SPOTIFY_CLIENT_SECRET}`
          ).toString("base64"),
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: token,
      }),

      method: "POST",
    });

    const refreshedTokens = await response.json();

    if (!response.ok) {
      throw refreshedTokens;
    }

    return {
      token,
      accessToken: refreshedTokens.access_token,
      accessTokenExpires: Date.now() + refreshedTokens.expires_in * 1000,
      refreshToken: refreshedTokens.refresh_token ?? token, // Fall back to old refresh token
    };
  } catch (error) {
    return {
      token,
      error: "RefreshAccessTokenError",
    };
  }
}

export const spotifyRouter = createTRPCRouter({
  createPlaylist: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        description: z.string(),
        generatedSongList: z.array(z.string()),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const lim = RateLimit(1 / 1);
      const { profile, refreshToken } = ctx.session;

      const token = await refreshAccessToken(refreshToken);

      // Search spotify for each song
      const songList = input.generatedSongList.map(async (song) => {
        const searchSong = await fetch(
          `https://api.spotify.com/v1/search?q=${song}&type=track&limit=1`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token.accessToken}`,
            },
          }
        );

        const searchSongJson =
          (await searchSong.json()) as SpotifySearchResponse;

        return {
          result: searchSongJson.tracks.items[0],
        };
      });

      const spotifySongList = [...(await Promise.all(songList))];
      const trackUris = spotifySongList
        .map((song) => {
          return song.result?.uri;
        })
        .join(",");

      // Create playlist
      const createPlaylist = await fetch(
        `https://api.spotify.com/v1/users/${profile.id}/playlists`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token.accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: input.name,
            description: input.description,
            public: false,
          }),
        }
      );

      const createdPlaylist =
        (await createPlaylist.json()) as SpotifyCreatedPlaylist;

      const playlistId = createdPlaylist.id;

      // Add tracks to playlist
      const addTracks = await fetch(
        `https://api.spotify.com/v1/playlists/${playlistId}/tracks?uris=${trackUris}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token.accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      const addedTracks = (await addTracks.json()) as { snapshot_id: string };

      return {
        createdPlaylist,
        addedTracks,
      };
    }),

  getAccessToken: protectedProcedure
    .input(z.object({ refreshToken: z.string() }))
    .mutation(async ({ input }) => {
      const res = await refreshAccessToken(input.refreshToken);

      return res;
    }),
});
