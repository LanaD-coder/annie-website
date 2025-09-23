import React, { useState } from "react";

function ContactModal() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button onClick={() => setIsOpen(true)}>Kontak my</button>
      {isOpen && (
        <div className="modal">
          <h2>Kontak Form</h2>
          <button onClick={() => setIsOpen(false)}>Sluit</button>
        </div>
      )}
    </>
  );
}

export default ContactModal;
