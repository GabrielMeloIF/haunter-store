import Header from "@/Components/Header/Header";
import { Icon } from "@iconify/react";
import { useState } from "react";

const chatInicial = [
  {
    id: 1,
    usuario: "Kauan",
    avatar: "https://pbs.twimg.com/media/DqPSpVzWsAAAWqP.jpg",
    mensagem: "Ola sou o kauan, gostaria de negociar o produto...",
    hora: "2026-03-19T14:32:00",
    mensagens: [
      { id: 1, texto: "Oi, tenho interesse!", eu: false },
      { id: 2, texto: "Ola, kauan", eu: true },
    ],
  },
  {
    id: 2,
    usuario: "Lula",
    avatar: "https://www.brasildefato.com.br/wp-content/uploads/2024/09/image_processing20231027-1640-qzx79g.jpeg",
    mensagem: "Companheiro ainda está disponível?",
    hora: "2026-03-19T09:15:00",
    mensagens: [
      { id: 1, texto: "Companheiro ainda está disponível?", eu: false },
      { id: 2, texto: "Sim!", eu: true },
    ],
  },
   {
    id: 3,
    usuario: "Bolsonaro",
    avatar: "https://s2-cbn.glbimg.com/xi0bwCYiNub6yfst_XaYka2_yw4=/0x0:2047x1365/888x0/smart/filters:strip_icc()/i.s3.glbimg.com/v1/AUTH_d975fad146a14bbfad9e763717b09688/internal_photos/bs/2025/1/N/LKABYTQbagCGAHZAv6Kw/54580441966-9ccaaa985f-k.jpg",
    mensagem: "Ta ok?",
    hora: "2026-03-19T09:15:00",
    mensagens: [
      { id: 1, texto: "Ta ok?", eu: false },
      { id: 2, texto: "Sim!", eu: true },
    ],
  },
];

export default function Chat() {
  const [chats, setChats] = useState(chatInicial);
  const [chatSelecionado, setChatSelecionado] = useState<any>(null);
  const [novaMensagem, setNovaMensagem] = useState("");
  const [menuAberto, setMenuAberto] = useState<number | null>(null);

  const enviarMensagem = () => {
    if (!novaMensagem.trim()) return;

    const novaMsg = {
      id: Date.now(),
      texto: novaMensagem,
      eu: true,
    };

    const novosChats = chats.map((c) => {
      if (c.id === chatSelecionado.id) {
        return {
          ...c,
          mensagens: [...c.mensagens, novaMsg],
          mensagem: novaMensagem,
        };
      }
      return c;
    });

    setChats(novosChats);
    setChatSelecionado({
      ...chatSelecionado,
      mensagens: [...chatSelecionado.mensagens, novaMsg],
    });

    setNovaMensagem("");
  };

  const excluirMensagem = (msgId: number) => {
    const novosChats = chats.map((c) => {
      if (c.id === chatSelecionado.id) {
        return {
          ...c,
          mensagens: c.mensagens.filter((m) => m.id !== msgId),
        };
      }
      return c;
    });

    setChats(novosChats);
    setChatSelecionado({
      ...chatSelecionado,
      mensagens: chatSelecionado.mensagens.filter((m: any) => m.id !== msgId),
    });

    setMenuAberto(null);
  };

  const editarMensagem = (msgId: number, textoAtual: string) => {
    const novoTexto = prompt("Editar mensagem:", textoAtual);
    if (!novoTexto) return;

    const novosChats = chats.map((c) => {
      if (c.id === chatSelecionado.id) {
        return {
          ...c,
          mensagens: c.mensagens.map((m) =>
            m.id === msgId ? { ...m, texto: novoTexto } : m,
          ),
        };
      }
      return c;
    });

    setChats(novosChats);
    setChatSelecionado({
      ...chatSelecionado,
      mensagens: chatSelecionado.mensagens.map((m: any) =>
        m.id === msgId ? { ...m, texto: novoTexto } : m,
      ),
    });

    setMenuAberto(null);
  };

  return (
    <>
      <Header />

      <div className="flex h-svh">
        {/* contatos */}
        <div className="bg-gray-700 w-[25%] flex flex-col p-4">
          {chats.map((n) => (
            <div
              key={n.id}
              onClick={() => setChatSelecionado(n)}
              className="flex items-center gap-3 border-b border-gray-600 py-3 cursor-pointer hover:bg-gray-600 rounded-lg px-2"
            >
              <div className="bg-gray-300 rounded-full w-12 h-11 flex items-center justify-center">
                {n.avatar ? (
                  <img
                    src={n.avatar}
                    alt={n.usuario}
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  <Icon icon="heroicons:user" className="text-xl text-white" />
                )}
              </div>

              <div className="flex flex-col w-full">
                <span className="text-gray-200 font-bold text-sm">
                  {n.usuario}
                </span>
                <span className="text-gray-400 text-xs truncate">
                  {n.mensagem}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* chat */}
        <div className="flex-1 flex flex-col">
          {chatSelecionado ? (
            <>
              <div className="flex border-b border-gray-600 p-4 items-center gap-3 bg-gray-800">
                <div className="bg-gray-300 rounded-full w-11 h-11 flex items-center justify-center">
                  {chatSelecionado.avatar ? (
                    <img
                      src={chatSelecionado.avatar}
                      alt={chatSelecionado.usuario}
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : (
                    <Icon icon="heroicons:user" className="text-xl text-white" />
                  )}
                </div>

                <h2 className="text-white text-xl">
                  {chatSelecionado.usuario}
                </h2>
              </div>

              {/* mensagens */}
              <div className="flex-1 p-4 flex flex-col gap-3 overflow-y-auto">
                {chatSelecionado.mensagens.map((msg: any) => (
                  <div
                    key={msg.id}
                    className={`p-3 rounded-lg max-w-xl text-white relative ${
                      msg.eu
                        ? "bg-purple-600 self-end mr-2"
                        : "bg-gray-600 self-start ml-2"
                    }`}
                  >
                    {msg.texto}

                    {/* editar excluir */}
                    {msg.eu && (
                      <div className="absolute top-3 right-0">
                        <button
                          onClick={() =>
                            setMenuAberto(menuAberto === msg.id ? null : msg.id)
                          }
                          className="text-white text-sm"
                        >
                          <Icon icon="iconamoon:arrow-down-2-thin" width={20} height={20} className="-mt-8"/>
                        </button>

                        {menuAberto === msg.id && (
                          <div className="absolute right-0 mt-1 bg-gray-700 rounded shadow-md text-sm z-10">
                            <button
                              onClick={() => editarMensagem(msg.id, msg.texto)}
                              className="flex flex-col px-3 py-1 hover:bg-gray-600 w-full text-left"
                            >
                              Editar
                            </button>
                            <button
                              onClick={() => excluirMensagem(msg.id)}
                              className="flex flex-col  px-3 py-1 hover:bg-gray-600 w-full text-left text-red-400"
                            >
                              Excluir
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* input */}
              <div className="p-4 flex gap-2 sticky bottom-0 w-full bg-gray-800">
                <input
                  value={novaMensagem}
                  onChange={(e) => setNovaMensagem(e.target.value)}
                  placeholder="Digite uma mensagem..."
                  className="flex-1 min-w-0 p-2 rounded bg-gray-700 text-white outline-none"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      enviarMensagem();
                    }
                  }}
                />

                <button
                  onClick={enviarMensagem}
                  className="bg-purple-600 text-white px-4 rounded hover:bg-purple-800"
                >
                  Enviar
                </button>
              </div>
            </>
          ) : (
            <p className="text-gray-400 p-4">Selecione um chat</p>
          )}
        </div>
      </div>
    </>
  );
}