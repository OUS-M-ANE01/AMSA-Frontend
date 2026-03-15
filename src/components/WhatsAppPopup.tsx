import { useState } from 'react';

export default function WhatsAppPopup() {
  const [open, setOpen] = useState(false);
  const whatsappNumber = '+221787965132'; // Numéro admin
  const whatsappUrl = `https://wa.me/${whatsappNumber.replace('+', '')}`;

  return (
    <>
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-50 bg-[#25D366] rounded-full shadow-lg flex items-center justify-center w-12 h-12 hover:bg-[#128C7E] transition-all"
          title="Contact WhatsApp"
        >
          <img src="/whatsapp-eva.png" alt="WhatsApp" className="w-24 h-auto" />
        </button>
      )}
      {open && (
        <div className="fixed bottom-6 right-6 z-50 bg-white border border-[#25D366] rounded-xl shadow-xl p-4 flex flex-col items-center gap-3">
          <img src="/whatsapp-eva.png" alt="WhatsApp" className="w-auto h-24 mb-2" />
          <p className="text-[#25D366] font-bold text-lg">Contactez-nous sur WhatsApp !</p>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#25D366] text-white px-6 py-2 rounded-full font-semibold hover:bg-[#128C7E] transition-all"
          >
            Accéder à WhatsApp
          </a>
          <button
            onClick={() => setOpen(false)}
            className="mt-2 text-xs text-[#6B6B6B] hover:text-[#25D366]"
          >
            Fermer
          </button>
        </div>
      )}
    </>
  );
}
