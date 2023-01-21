import Modal from "@/components/common/modal";
import Image from "next/image";
import type { Dispatch, SetStateAction } from "react";
import { useCallback, useMemo, useState } from "react";

const PlaylistModal = ({
  showModal,
  setShowModal,
  details,
}: {
  details: {
    title: string;
    url: string;
  };
  showModal: boolean;
  setShowModal: Dispatch<SetStateAction<boolean>>;
}) => {
  return (
    <Modal showModal={showModal} setShowModal={setShowModal}>
      <div className="w-full overflow-hidden shadow-xl sm:max-w-lg sm:rounded-2xl sm:border sm:border-gray-100">
        <div className="flex flex-col items-center justify-center space-y-3 border-b border-gray-200 bg-white px-4 py-6 pt-8 text-center sm:px-16">
          <Image
            src="/spotify.png"
            alt="Logo"
            className="h-10 w-10 rounded-full"
            width={20}
            height={20}
          />

          <h3 className="font-display text-2xl font-bold">
            {details.title} Playlist Created
          </h3>
          <p className="text-gray-500">
            Your playlist has been created on Spotify. Click the link below to
            view it.
          </p>
        </div>

        <div className="bg-gray-50 py-8 px-2">
          <div className="text-center">
            <a
              href={details.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-browny-brown hover:underline"
            >
              {details.url}
            </a>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export function usePlaylistModal() {
  const [showModal, setShowModal] = useState(false);
  const [details, setDetails] = useState({
    title: "",
    url: "",
  });

  const ModalCallback = useCallback(() => {
    return (
      <PlaylistModal
        details={details}
        showModal={showModal}
        setShowModal={setShowModal}
      />
    );
  }, [details, showModal]);

  return useMemo(
    () => ({ setShowModal, PlaylistModal: ModalCallback, setDetails }),
    [setShowModal, ModalCallback, setDetails]
  );
}
