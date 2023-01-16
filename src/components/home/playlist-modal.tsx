import Modal from "@/components/common/modal";
import Image from "next/image";
import type { Dispatch, SetStateAction } from "react";
import { useCallback, useMemo, useState } from "react";
import type { BookItem } from "src/types/books";

const PlaylistModal = ({
  playlist,
  details,
  showPlaylistModal,
  setShowPlaylistModal,
}: {
  playlist: string;
  details: BookItem;
  showPlaylistModal: boolean;
  setShowPlaylistModal: Dispatch<SetStateAction<boolean>>;
}) => {
  const list = playlist.split("\n");
  return (
    <Modal showModal={showPlaylistModal} setShowModal={setShowPlaylistModal}>
      <div className="w-full overflow-hidden shadow-xl sm:max-w-md sm:rounded-2xl sm:border sm:border-gray-100">
        <div className="flex flex-col items-center justify-center space-y-3 bg-white px-4 py-6 pt-8 text-center sm:px-16">
          <a href="https://precedent.vercel.app">
            <Image
              src={
                details?.volumeInfo?.imageLinks?.thumbnail || "/no-cover.png"
              }
              alt="Precedent Logo"
              className="h-10 w-10 rounded-full"
              width={20}
              height={20}
            />
          </a>
          <h3 className="font-display text-2xl font-bold">
            {details.volumeInfo?.title ?? ""}
          </h3>
          <div className="text-left text-sm text-gray-500">
            {list.map((song, index) => (
              <p key={index}>{song}/</p>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export function usePlaylistModal() {
  const [showPlaylistModal, setShowPlaylistModal] = useState(false);
  const [playlist, setPlaylist] = useState("");
  const [details, setDetails] = useState<BookItem>({ title: "" });

  const PlaylistModalCallback = useCallback(() => {
    return (
      <PlaylistModal
        details={details}
        playlist={playlist}
        showPlaylistModal={showPlaylistModal}
        setShowPlaylistModal={setShowPlaylistModal}
      />
    );
  }, [showPlaylistModal, setShowPlaylistModal]);

  return useMemo(
    () => ({
      setShowPlaylistModal,
      PlaylistModal: PlaylistModalCallback,
      setPlaylist,
      setDetails,
    }),
    [setShowPlaylistModal, PlaylistModalCallback, setPlaylist, setDetails]
  );
}
