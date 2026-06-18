import { useState, useRef } from "react";

type Msg = { from: "user" | "bot"; text: string };

export default function AIChat() {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  async function send() {
    const text = input.trim();
    if (!text) return;
    const nextUser: Msg = { from: "user", text };
    const history = messages.slice(-10);
    setMessages((m) => [...m, nextUser]);
    setInput("");'z'
    setLoading(true);
    try {
      const res = await fetch("/api/ai-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, history }),
      });
      const data = await res.json();
      const bot: Msg = { from: "bot", text: data.reply ?? "Desculpe, sem resposta." };
      setMessages((m) => [...m, bot]);
      // focus input
      inputRef.current?.focus();
    } catch (err) {
      setMessages((m) => [...m, { from: "bot", text: "Erro ao contactar o serviço de IA." }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-gray-900/50 p-4 rounded-md max-w-2xl w-full">
      <div className="h-64 overflow-auto mb-4 space-y-3">
        {messages.length === 0 && (
          <div className="text-sm text-gray-300">Converse com nossa IA sobre o site, compras e produtos.</div>
        )}
        {messages.map((m, i) => (
          <div key={i} className={m.from === "user" ? "text-right" : "text-left"}>
            <div className={`inline-block px-3 py-2 rounded ${m.from === "user" ? "bg-[#430883] text-white" : "bg-gray-700 text-gray-100"}`}>
              {m.text}
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") send(); }}
          className="flex-1 p-2 rounded bg-gray-800 text-white border border-gray-700"
          placeholder="Pergunte algo sobre o site, compras ou produtos..."
        />
        <button onClick={send} disabled={loading} className="px-4 py-2 rounded bg-[#430883] text-white disabled:opacity-50">
          {loading ? "Enviando..." : "Enviar"}
        </button>
      </div>
    </div>
  );
}
