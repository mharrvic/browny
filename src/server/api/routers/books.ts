import { env } from "@/env/server.mjs";
import { generateSongList } from "@/utils/openai";
import type { BookItem, GoogleBooksResponse } from "src/types/books";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const booksRouter = createTRPCRouter({
  search: publicProcedure
    .input(z.object({ book: z.string() }))
    .mutation(async ({ input }) => {
      const GOOGLE_BOOKS_API_KEY = env.GOOGLE_BOOKS_API_KEY;
      const book = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=${
          input.book
        }&key=${GOOGLE_BOOKS_API_KEY!}&maxResults=6`
      );
      const bookJson = (await book.json()) as GoogleBooksResponse;
      return bookJson;
    }),

  getBookInfo: publicProcedure
    .input(z.object({ bookId: z.string() }))
    .query(async ({ input }) => {
      const GOOGLE_BOOKS_API_KEY = env.GOOGLE_BOOKS_API_KEY;
      const book = await fetch(
        `https://www.googleapis.com/books/v1/volumes/${
          input.bookId
        }?key=${GOOGLE_BOOKS_API_KEY!}`
      );
      const bookJson = (await book.json()) as BookItem;
      return bookJson;
    }),

  generatePlaylist: publicProcedure
    .input(
      z.object({
        title: z.string(),
        description: z.string(),
        categories: z.array(z.string()),
      })
    )
    .mutation(async ({ input }) => {
      const { title, description, categories } = input;
      const rawSongList = await generateSongList(
        title,
        description,
        categories
      );

      const generatedSongList =
        rawSongList.choices[0]?.text?.split("\n").filter((item) => {
          return item !== "";
        }) ?? [];

      return {
        generatedSongList,
      };
    }),
});
