import Layout from "@/components/layout/layout";
import {
  FADE_DOWN_ANIMATION_VARIANTS,
  FADE_IN_ANIMATION_SETTINGS,
} from "@/lib/constants";
import { api } from "@/utils/api";
import clsx from "clsx";
import { motion } from "framer-motion";
import { signIn, useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/router";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { Book, userBookStore } from "src/state/book";

function BookItem() {
  const [newBookGenerated, setNewBookGenerated] = useState<Book | null>(null);
  const store = userBookStore();
  const router = useRouter();
  const { id } = router.query;

  const { data: session, status } = useSession();

  const bookInfo = store.getBookById(id as string);

  const { data, isLoading } = api.books.getBookInfo.useQuery({
    bookId: id as string,
  });

  const mergedBookInfo = newBookGenerated ? newBookGenerated : bookInfo;

  const {
    data: generatedPlaylist,
    mutateAsync: generatePlaylistMutateAsync,
    isLoading: isGeneratePlaylistLoading,
    status: generatePlaylistStatus,
  } = api.books.generatePlaylist.useMutation({
    onSuccess: (generated) => {
      toast.remove();
      toast.success("Playlist generated!");
      toast.remove();

      if (data) {
        const newBook = {
          id: data.id,
          title: data.volumeInfo.title,
          subtitle: data.volumeInfo.subtitle,
          authors: data.volumeInfo.authors,
          description: data.volumeInfo?.description ?? "",
          image:
            data.volumeInfo.imageLinks?.small ||
            data.volumeInfo.imageLinks?.medium ||
            data.volumeInfo.imageLinks?.thumbnail ||
            data.volumeInfo.imageLinks?.large ||
            "/no-cover.png",
          generatedSongs: generated.generatedSongList,
        };
        store.saveGeneratedPlaylist(newBook);

        setNewBookGenerated(newBook);
      }
    },
    onError: (error) => {
      toast.remove();
      toast.error("Something went wrong, please try again later.");
    },
  });

  const {
    mutateAsync: createPlaylistMutateAsync,
    isLoading: createPlaylistLoading,
  } = api.spotify.createPlaylist.useMutation({
    onSuccess: (createPlaylist) => {
      toast.remove();
      toast.success("Playlist created!");
    },
    onError: (error) => {
      toast.remove();
      toast.error("Something went wrong, please try again later.");
    },
  });

  const handleOnGenerate = async () => {
    toast.loading("Generating playlist...");
    if (data) {
      await generatePlaylistMutateAsync({
        title: data.volumeInfo.title,
        description: data.volumeInfo.description || "",
      });
    }
  };

  const handleOnCreatePlaylist = async () => {
    toast.loading("Creating spotify playlist...");
    if (generatedPlaylist && data && mergedBookInfo) {
      await createPlaylistMutateAsync({
        name: mergedBookInfo.title,
        description: `Playlist generated from ${
          mergedBookInfo.title
        } by ${mergedBookInfo.authors?.join(", ")}`,
        generatedSongList: mergedBookInfo.generatedSongs,
      });
    }
  };

  if (!data) {
    return null;
  }

  return (
    <Layout>
      <motion.div
        className="mx-auto grid h-screen max-w-6xl grid-cols-1 grid-rows-[auto_1fr] gap-y-16 md:pt-20 lg:grid-cols-12 lg:gap-y-20 lg:px-3 lg:pb-36 lg:pt-0 xl:py-32"
        initial="hidden"
        whileInView="show"
        animate="show"
        viewport={{ once: true }}
        variants={{
          hidden: {},
          show: {
            transition: {
              staggerChildren: 0.15,
            },
          },
        }}
      >
        <motion.div
          className="relative flex items-start lg:col-span-5 lg:row-span-2"
          variants={FADE_DOWN_ANIMATION_VARIANTS}
        >
          <div className="relative z-10 mx-auto flex w-64 rounded-xl bg-slate-600 shadow-xl md:w-80 lg:w-auto">
            <Image
              className="w-60"
              src={
                data.volumeInfo.imageLinks?.small ||
                data.volumeInfo.imageLinks?.medium ||
                data.volumeInfo.imageLinks?.thumbnail ||
                data.volumeInfo.imageLinks?.large ||
                "/no-cover.png"
              }
              alt={data.volumeInfo.title}
              priority
              width={500}
              height={500}
            />
          </div>
        </motion.div>

        <div className="bg-white pt-16 lg:col-span-7 lg:bg-transparent lg:pt-0 lg:pl-0 xl:pl-20">
          <div className="mx-auto px-4 sm:px-6 md:max-w-2xl md:px-4 lg:px-0">
            <motion.h1
              className="bg-gradient-to-br from-browny-brown to-stone-500 bg-clip-text font-display text-5xl font-extrabold text-transparent  sm:text-6xl"
              variants={FADE_DOWN_ANIMATION_VARIANTS}
            >
              {data.volumeInfo.title}:{" "}
              <span className="text-gray-500">
                {data.volumeInfo?.subtitle ?? data.volumeInfo.publishedDate}
              </span>
            </motion.h1>
            <motion.p
              className="mt-4 text-3xl text-slate-600"
              variants={FADE_DOWN_ANIMATION_VARIANTS}
            >
              {data.volumeInfo.authors?.join(", ")}
            </motion.p>
            <motion.div
              className="mt-8 flex gap-4"
              variants={FADE_DOWN_ANIMATION_VARIANTS}
            >
              <motion.button
                className={clsx(
                  "rounded-full bg-gradient-to-br from-browny-brown to-stone-500 p-1.5 px-6 py-4 text-sm text-white transition-all hover:bg-white hover:text-black",
                  {
                    "animate-pulse cursor-not-allowed border-gray-500 bg-gray-400":
                      isGeneratePlaylistLoading,
                  }
                )}
                onClick={handleOnGenerate}
                {...FADE_IN_ANIMATION_SETTINGS}
                disabled={isGeneratePlaylistLoading}
              >
                {mergedBookInfo ? "Regenerate Playlist" : "Generate Playlist"}
              </motion.button>

              {session && mergedBookInfo && (
                <motion.button
                  className={clsx(
                    "flex space-x-3 rounded-full border border-gray-700 bg-gray-700 p-1.5 px-6 py-4 text-sm text-white transition-all hover:bg-white hover:text-black",
                    {
                      "animate-pulse cursor-not-allowed border-gray-500 bg-gray-400":
                        isGeneratePlaylistLoading,
                    }
                  )}
                  onClick={handleOnCreatePlaylist}
                  {...FADE_IN_ANIMATION_SETTINGS}
                  disabled={isGeneratePlaylistLoading}
                >
                  <Image
                    alt="Spotify logo"
                    src="/spotify.png"
                    width={20}
                    height={20}
                  />
                  <p>Save spotify playlist</p>
                </motion.button>
              )}

              {!session && mergedBookInfo && (
                <motion.button
                  className={clsx(
                    "flex space-x-3 rounded-full border border-gray-700 bg-gray-700 p-1.5 px-6 py-4 text-sm text-white transition-all hover:bg-white hover:text-black",
                    {
                      "animate-pulse cursor-not-allowed border-gray-500 bg-gray-400 hover:border-gray-500":
                        isGeneratePlaylistLoading,
                    }
                  )}
                  onClick={() => {
                    signIn("spotify");
                  }}
                  {...FADE_IN_ANIMATION_SETTINGS}
                  disabled={isGeneratePlaylistLoading}
                >
                  <Image
                    alt="Spotify logo"
                    src="/spotify.png"
                    width={20}
                    height={20}
                  />
                  <p>Sign in with Spotify</p>
                </motion.button>
              )}
            </motion.div>
          </div>
        </div>

        <motion.div
          variants={FADE_DOWN_ANIMATION_VARIANTS}
          className="my-2 mx-4  flex flex-col gap-4 lg:col-span-7"
        >
          {mergedBookInfo?.generatedSongs?.length && (
            <p className="text-lg font-semibold">AI Generated Playlist:</p>
          )}
          {mergedBookInfo?.generatedSongs?.map((song, index) => {
            return (
              <div key={index}>
                <p className="text-black">{song}</p>
              </div>
            );
          }) ?? ""}
        </motion.div>
      </motion.div>
    </Layout>
  );
}

export default BookItem;
