import { BookOpenIcon, MagnifyingGlassIcon } from "@heroicons/react/20/solid";

import LoadingDots from "@/components/common/icons/loading-dots";
import { FADE_IN_ANIMATION_SETTINGS } from "@/lib/constants";
import { api } from "@/utils/api";
import clsx from "clsx";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";
import type { SubmitHandler } from "react-hook-form";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import type { BookItem } from "src/types/books";
import { usePlaylistModal } from "./playlist-modal";

type Inputs = {
  book: string;
};

const Search = () => {
  const [selectedBook, setSelectedBook] = useState<BookItem>({});
  const { register, handleSubmit } = useForm<Inputs>();

  const { setShowPlaylistModal, PlaylistModal, setDetails, setPlaylist } =
    usePlaylistModal();

  const {
    isLoading,
    mutateAsync,
    data: books,
  } = api.books.search.useMutation({
    onSuccess: (data) => {
      console.log({ data });
    },
  });

  const {
    mutateAsync: generatePlaylistMutateAsync,
    isLoading: isGeneratePlaylistLoading,
  } = api.books.generatePlaylist.useMutation({
    onSuccess: (data) => {
      console.log({ data });
      toast.remove();
      toast.success("Playlist generated!");
      setDetails(selectedBook);
      setPlaylist(data.choices[0]?.text || "");
      setShowPlaylistModal(true);
    },
  });

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    const { book } = data;
    await mutateAsync({ book });
  };

  const handleOnGenerate = async ({
    title,
    description,
  }: {
    title: string;
    description: string;
  }) => {
    toast.loading("Generating playlist...");
    await generatePlaylistMutateAsync({ title, description });
  };

  return (
    <>
      <PlaylistModal />
      <form onSubmit={handleSubmit(onSubmit)} className="w-11/12 md:w-1/3">
        <label className="mb-2 block text-3xl font-medium text-white">
          Search anything
        </label>
        <div className="mt-1 flex rounded-md shadow-sm">
          <div className="relative flex flex-grow items-stretch focus-within:z-10">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <BookOpenIcon
                className="h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
            </div>
            <input
              {...register("book")}
              name="book"
              id="book"
              className="block h-16 w-full rounded-none rounded-l-md border border-gray-300 pl-10 text-gray-700 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="Search anything"
              disabled={isLoading}
            />
          </div>
          <button
            type="button"
            className="relative -ml-px inline-flex items-center space-x-2 rounded-r-md border border-gray-300 bg-gray-50 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            onClick={handleSubmit(onSubmit)}
            disabled={isLoading}
          >
            <MagnifyingGlassIcon
              className="h-5 w-5 text-gray-400"
              aria-hidden="true"
            />
            {/* <span>{isLoading ? "Loading" : "Submit"}</span> */}
          </button>
        </div>
      </form>

      <div className="flex flex-col items-center">
        {isLoading ? (
          <div className="my-5">
            <LoadingDots />
          </div>
        ) : (
          <div className="my-10 grid max-w-screen-xl animate-[slide-down-fade_0.5s_ease-in-out] grid-cols-2 gap-5 px-5 md:grid-cols-3 xl:px-0">
            {books?.items.map((item) => {
              if (selectedBook.id === item.id) {
                return (
                  <div
                    key={item.id}
                    className="relative col-span-1 w-40 overflow-hidden rounded-xl border border-gray-200 bg-white/30 shadow-lg  backdrop-blur-md"
                  >
                    <div className="h-64 w-full">
                      <Image
                        src={
                          item?.volumeInfo?.imageLinks?.thumbnail ||
                          "/no-cover.png"
                        }
                        alt={item.volumeInfo.title}
                        width={300}
                        height={300}
                      />
                    </div>
                    <div className="p-2">
                      <AnimatePresence>
                        <motion.button
                          className={clsx(
                            "rounded-full border border-black bg-black p-1.5 px-4 text-sm text-white transition-all hover:bg-white hover:text-black",
                            {
                              "cursor-not-allowed": isGeneratePlaylistLoading,
                            }
                          )}
                          {...FADE_IN_ANIMATION_SETTINGS}
                          // eslint-disable-next-line @typescript-eslint/no-misused-promises
                          onClick={async () => {
                            await handleOnGenerate({
                              title: item.volumeInfo.title,
                              description: item.volumeInfo.description || "",
                            });
                          }}
                          disabled={isGeneratePlaylistLoading}
                        >
                          Generate Playlist
                        </motion.button>
                      </AnimatePresence>
                    </div>
                  </div>
                );
              }

              return (
                <div
                  key={item.id}
                  className="relative col-span-1 w-40 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-md"
                  onMouseEnter={() => setSelectedBook(item)}
                >
                  <div className="h-60 w-full">
                    <Image
                      src={
                        item?.volumeInfo?.imageLinks?.thumbnail ||
                        "/no-cover.png"
                      }
                      alt={item.volumeInfo.title}
                      width={300}
                      height={300}
                    />
                  </div>
                  <div className="p-2">
                    <p className="pb-2 font-semibold">
                      {item.volumeInfo.title}
                    </p>
                    <p className="text-gray-500">
                      {item.volumeInfo.publishedDate}
                    </p>
                    <p className="text-gray-500 line-clamp-3">
                      {item.volumeInfo.authors}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
};

export default Search;
