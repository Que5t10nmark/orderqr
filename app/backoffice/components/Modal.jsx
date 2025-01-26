import React from "react";

const Modal = ({ isOpen, closeModal, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded shadow-lg w-96">
        <button
          onClick={closeModal}
          className="absolute top-2 right-2 text-gray-500"
        >
          X
        </button>
        <div>{children}</div>
      </div>
    </div>
  );
};

export default Modal;
