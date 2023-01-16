import { generateSongList } from "@/utils/openai";
import type { GoogleBooksResponse } from "src/types/books";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

export const booksRouter = createTRPCRouter({
  search: publicProcedure
    .input(z.object({ book: z.string() }))
    .mutation(async ({ input }) => {
      const GOOGLE_BOOKS_API_KEY = process.env.GOOGLE_BOOKS_API_KEY;
      const book = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=${
          input.book
        }&key=${GOOGLE_BOOKS_API_KEY!}&maxResults=6`
      );
      const bookJson = (await book.json()) as GoogleBooksResponse;
      return bookJson;
    }),

  generatePlaylist: publicProcedure
    .input(z.object({ title: z.string(), description: z.string() }))
    .mutation(async ({ input }) => {
      const { title, description } = input;
      const list = await generateSongList(title, description);

      return list;
    }),

  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.example.findMany();
  }),

  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!";
  }),
});
