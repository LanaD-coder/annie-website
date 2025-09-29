import React, { useState } from "react";

function ContactModal() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 z-50 px-4 py-2 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700"
      >
        Kontak my
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-40">
          <div className="bg-white p-6 rounded-xl shadow-xl relative max-w-md w-full">
            <h2 className="text-xl font-semibold mb-4">Kontak Form</h2>
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
            >
              Sluit
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default ContactModal;
