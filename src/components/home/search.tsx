import { BookOpenIcon, MagnifyingGlassIcon } from "@heroicons/react/20/solid";

import LoadingDots from "@/components/common/icons/loading-dots";
import { api } from "@/utils/api";
import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import type { SubmitHandler } from "react-hook-form";
import { useForm } from "react-hook-form";

type Inputs = {
  book: string;
};

const Search = () => {
  const { register, handleSubmit } = useForm<Inputs>();

  const {
    isLoading,
    mutateAsync,
    data: books,
    status,
  } = api.books.search.useMutation({
    onSuccess: (data) => {
      console.log({ data });
    },
  });

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    const { book } = data;
    await mutateAsync({ book });
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="w-11/12 md:w-1/3">
        <label className="mb-2 block text-3xl font-medium text-white">
          Search any book / author / genre
        </label>
        <div
          className={clsx("mt-1 flex rounded-md shadow-sm", {
            "animate-pulse": isLoading,
          })}
        >
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
              className="block h-16 w-full rounded-none rounded-l-md border border-gray-300 pl-10 text-gray-700 focus:border-amber-500 focus:outline-none focus:ring-amber-500 sm:text-sm"
              placeholder="Search any book / author / genre"
              disabled={isLoading}
            />
          </div>
          <button
            type="button"
            className="relative -ml-px inline-flex items-center space-x-2 rounded-r-md border border-gray-300 bg-gray-50 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
            onClick={handleSubmit(onSubmit)}
            disabled={status === "loading"}
          >
            <MagnifyingGlassIcon
              className="h-5 w-5 text-gray-400"
              aria-hidden="true"
            />
          </button>
        </div>
      </form>

      <div className="flex flex-col items-center">
        {isLoading ? (
          <div className="my-5">
            <LoadingDots />
          </div>
        ) : (
          <div className="my-10 grid max-w-screen-xl animate-[slide-down-fade_0.5s_ease-in-out] grid-cols-1 gap-5 px-5 md:grid-cols-3 xl:px-0">
            {books?.items.map((item) => (
              <Link
                key={item.id}
                href={`/book/${item.id}`}
                className="relative flex w-60 flex-col overflow-hidden rounded-lg shadow-lg transition-shadow duration-300 ease-in-out hover:shadow-2xl"
              >
                <div className="flex-shrink-0">
                  <Image
                    className="h-48 w-full object-cover"
                    src={
                      item?.volumeInfo?.imageLinks?.thumbnail || "/no-cover.png"
                    }
                    alt={item.volumeInfo.title}
                    width={300}
                    height={300}
                  />
                </div>
                <div className="flex flex-1 flex-col justify-between bg-white p-6">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-browny-brown">
                      {item.volumeInfo.publishedDate}
                    </p>
                    <div className="mt-2 block">
                      <p className="text-xl font-semibold text-gray-900">
                        {item.volumeInfo.title}
                      </p>
                      <p className="mt-3 text-base text-gray-500">
                        {item.volumeInfo.authors}
                      </p>
                      <p className="mt-2 text-base text-gray-400">
                        {item.volumeInfo.categories}
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default Search;
