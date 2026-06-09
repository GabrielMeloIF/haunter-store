import { useState } from "react";
import AIChat from "@/Components/AIChat/AIChat";
import { X, MessageCircle } from "lucide-react";

export default function FloatingChatWidget() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Botão flutuante */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-100 right-6 w-14 h-14 rounded-full bg-[#430883] text-white shadow-lg hover:bg-[#5a1a99] transition-all duration-300 flex items-center justify-center z-40 border-2 border-white"
        aria-label="Abrir chat de suporte"
      >
        {open ? <X size={24} /> : <MessageCircle size={24} />}
      </button>

      {/* Modal/Drawer do chat */}
      {open && (
        <div className="fixed bottom-24 right-6 w-96 bg-gray-950 rounded-lg shadow-2xl border border-gray-800 z-50 max-h-[600px] overflow-hidden flex flex-col animate-in fade-in slide-in-from-bottom-4">
          <div className="bg-[#430883] px-4 py-3 flex justify-between items-center">
            <h3 className="text-white font-bold">Assistente de Suporte</h3>
            <button
              onClick={() => setOpen(false)}
              className="text-white hover:bg-[#5a1a99] p-1 rounded"
              aria-label="Fechar chat"
            >
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-hidden">
            <AIChat />
          </div>
        </div>
      )}

      {/* Overlay (opcional - para fechar ao clicar fora) */}
      {open && (
        <div
          className="fixed inset-0 z-30"
          onClick={() => setOpen(false)}
        />
      )}
    </>
  );
}
