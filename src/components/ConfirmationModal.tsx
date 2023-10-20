import { Dialog, Transition } from "@headlessui/react";

import { Fragment } from "react";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  denyLabel: string;
  confirmLabel: string;
  onConfirm: () => void;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  denyLabel,
  confirmLabel,
  onConfirm,
}) => {
  //* render
  return (
    <Transition
      show={isOpen}
      as={Fragment}
      enter="transition duration-100 ease-out"
      enterFrom="transform scale-95 opacity-0"
      enterTo="transform scale-100 opacity-100"
      leave="transition duration-100 ease-out"
      leaveFrom="transform scale-100 opacity-100"
      leaveTo="transform scale-95 opacity-0"
    >
      <div className="fixed w-full h-screen z-40">
        <div className="fixed z-50 w-full h-screen bg-black/10"></div>
        <Dialog
          className="fixed flex flex-col justify-around items-center z-[60] top-[40%] left-1/2 transform -translate-x-1/2 -translate-y-20 bg-white w-[90%] sm:w-1/2 h-[50vh] overflow-y-auto p-4 rounded-lg shadow-xl"
          onClose={onClose}
        >
          <div className="text-center">
            <h2 className="text-2xl font-bold">{title}</h2>
            <p>{description}</p>
          </div>
          <div className="flex items-center gap-x-3">
            <button
              onClick={onClose}
              className="leading-6 text-gray-900 rounded-md bg-white px-3 py-2 text-sm font-semibold shadow-sm transition-colors hover:bg-gray-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              {denyLabel}
            </button>
            <button
              onClick={onConfirm}
              className="rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
            >
              {confirmLabel}
            </button>
          </div>
        </Dialog>
      </div>
    </Transition>
  );
};

export default ConfirmationModal;
