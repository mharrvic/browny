# Browny - Turn Books into Playlists

This is a [T3 Stack](https://create.t3.gg/) project bootstrapped with `create-t3-app` and components from https://github.com/steven-tey/precedent



https://user-images.githubusercontent.com/15852818/213841634-4e5a22a8-ad89-4821-92ed-2d985ba88906.mp4



## How to use

1. Search any books / authors / categories
2. Select a book from the search results
3. Click Generate Playlist to generate a playlist based on the book's title and description
4. Review the generated results, feel free to re-generate the playlist if you don't like the results
5. Click Sign in with Spotify to sign in to your Spotify account
6. Click Save to Spotify playlist to save the playlist to your Spotify account

## Environment Setup

1. Create a `.env` file in the root directory of the project (refer to `.env.example`)
2. Add the following environment variables to the `.env` file

```
DATABASE_URL=
NEXTAUTH_SECRET=
NEXTAUTH_URL=

SPOTIFY_CLIENT_ID=<your-spotify-client-id>
SPOTIFY_CLIENT_SECRET=<your-spotify-client-secret>

GOOGLE_BOOKS_API_KEY=<your-google-books-api-key>

OPENAI_API_KEY=<your-openai-api-key>
```

4. Create a Spotify app at https://developer.spotify.com/dashboard/applications and get the client ID and secret

5. Create a Google Books API key at https://developers.google.com/books/docs/v1/using

6. Create an account at OpenAI at https://beta.openai.com/account/api-keys - and create an API key

## How do I deploy this?

Follow our deployment guides for [Vercel](https://create.t3.gg/en/deployment/vercel), [Netlify](https://create.t3.gg/en/deployment/netlify) and [Docker](https://create.t3.gg/en/deployment/docker) for more information.
