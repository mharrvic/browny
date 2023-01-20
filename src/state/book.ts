import produce from "immer";
import { create } from "zustand";
import { persist } from "zustand/middleware";

const initBooks = [
  {
    id: "",
    title: "",
    subtitle: "",
    authors: [],
    description: "",
    image: "",
    generatedSongs: [],
  },
];

export interface Book {
  id: string;
  title: string;
  subtitle: string;
  authors: string[];
  description: string;
  image: string;
  generatedSongs: string[];
}
interface PlaylistState {
  books: Array<Book>;
  saveGeneratedPlaylist: (bookInfo: Book) => any;
  getBookById: (id: string) => Book | undefined;
}

export const userBookStore = create<PlaylistState>()(
  persist(
    (set, get) => ({
      books: initBooks,
      saveGeneratedPlaylist: (bookInfo) =>
        set(
          produce((draft: PlaylistState) => {
            const isBookIdExisting = draft.books.find(
              (book) => book.id === bookInfo.id
            );
            if (isBookIdExisting) {
              const bookIndex = draft.books.findIndex(
                (book) => book.id === bookInfo.id
              );
              draft.books[bookIndex] = bookInfo;
            } else {
              draft.books.push(bookInfo);
            }
          })
        ),
      getBookById: (id) => {
        const book = get().books.find((book) => book.id === id);
        return book;
      },
      resetBooks: () => set((state) => ({ books: initBooks })),
    }),
    {
      name: "book-generated", // name of the item in the storage (must be unique)
    }
  )
);
