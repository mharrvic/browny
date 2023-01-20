import { type DefaultSession } from "next-auth";
import { SpotifyProfile } from "./spotify";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    accessTokenExpires: number;
    accessToken: string;
    refreshToken: string;
    error: string;
    user?: {
      id: string;
    } & DefaultSession["user"];
    profile: SpotifyProfile;
  }
}
