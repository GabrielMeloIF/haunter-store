import Header from "@/Components/Header/Header";
import { Icon } from "@iconify/react";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";

export default function Chat() {
  const { usuario } = useAuth();
  const usuarioLogado = usuario?.id ?? null;

  const [chats, setChats] = useState<any[]>([]);
  const [chatSelecionado, setChatSelecionado] = useState<any>(null);
  const [novaMensagem, setNovaMensagem] = useState("");
  const [menuAberto, setMenuAberto] = useState<number | null>(null);

  useEffect(() => {
    if (usuarioLogado) carregarConversas();
  }, [usuarioLogado]);

  async function carregarConversas() {
    try {
      const response = await fetch(
        `http://localhost:5000/conversas/usuario/${usuarioLogado}`
      );

      const data = await response.json();

      const conversasTratadas = data.map((conversa: any) => {
        const p1 = conversa.participante1;
        const p2 = conversa.participante2;
        const outroUsuario = p1?.id_usuario === usuarioLogado ? p2 : p1;

        return {
          ...conversa,
          nomeUsuario: outroUsuario?.nome ?? "Usuário",
          avatar: outroUsuario?.foto ?? null,
          ultimaMensagem:
            conversa.mensagem?.[0]?.conteudo ?? "Sem mensagens",
        };
      });

      setChats(conversasTratadas);
    } catch (error) {
      console.error("Erro ao carregar conversas:", error);
    }
  }

  async function abrirConversa(conversa: any) {
    try {
      const response = await fetch(
        `http://localhost:5000/mensagens/conversa/${conversa.id_conversa}`
      );

      const mensagens = await response.json();

      // normalize selected chat to include participant info and mensagens
      const p1 = conversa.participante1;
      const p2 = conversa.participante2;
      const outroUsuario = p1?.id_usuario === usuarioLogado ? p2 : p1;

      setChatSelecionado({
        ...conversa,
        nomeUsuario: outroUsuario?.nome ?? "Usuário",
        avatar: outroUsuario?.foto ?? null,
        mensagens,
      });
    } catch (error) {
      console.error("Erro ao abrir conversa:", error);
    }
  }

  const enviarMensagem = async () => {
    if (!novaMensagem.trim() || !chatSelecionado) return;

    try {
      // if chatSelecionado has id_conversa use it, otherwise send id_destinatario
      const payload: any = {
        id_remetente: usuarioLogado,
        conteudo: novaMensagem,
      };

      if (chatSelecionado.id_conversa) payload.id_conversa = chatSelecionado.id_conversa;
      else if (chatSelecionado.participante1 || chatSelecionado.participante2) {
        // determine destinatario
        const p1 = chatSelecionado.participante1;
        const p2 = chatSelecionado.participante2;
        const destinatario = p1?.id_usuario === usuarioLogado ? p2 : p1;
        if (destinatario) payload.id_destinatario = destinatario.id_usuario;
      }

      await fetch("http://localhost:5000/mensagens", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      setNovaMensagem("");

      await abrirConversa(chatSelecionado);
      await carregarConversas();
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);
    }
  };

  const excluirMensagem = async (msgId: number) => {
    try {
      await fetch(`http://localhost:5000/mensagens/${msgId}`, {
        method: "DELETE",
      });

      await abrirConversa(chatSelecionado);
      await carregarConversas();

      setMenuAberto(null);
    } catch (error) {
      console.error("Erro ao excluir mensagem:", error);
    }
  };

  const editarMensagem = () => {
    alert("Edição de mensagens ainda não foi implementada no backend.");
  };

  return (
    <>
      <Header />

      <div className="flex h-svh">
        {/* contatos */}
        <div className="bg-gray-700 w-[25%] flex flex-col p-4">
          {chats.map((conversa) => (
            <div
              key={conversa.id_conversa}
              onClick={() => abrirConversa(conversa)}
              className="flex items-center gap-3 border-b border-gray-600 py-3 cursor-pointer hover:bg-gray-600 rounded-lg px-2"
            >
              <div className="bg-gray-300 rounded-full w-12 h-11 flex items-center justify-center overflow-hidden">
                {conversa.avatar ? (
                  <img
                    src={conversa.avatar}
                    alt={conversa.nomeUsuario}
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  <Icon icon="heroicons:user" className="text-xl text-white" />
                )}
              </div>

              <div className="flex flex-col w-full">
                <span className="text-gray-200 font-bold text-sm">
                  {conversa.nomeUsuario}
                </span>

                <span className="text-gray-400 text-xs truncate">
                  {conversa.ultimaMensagem}
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
                <div className="bg-gray-300 rounded-full w-11 h-11 flex items-center justify-center overflow-hidden">
                  {chatSelecionado.avatar ? (
                    <img
                      src={chatSelecionado.avatar}
                      alt={chatSelecionado.nomeUsuario}
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : (
                    <Icon
                      icon="heroicons:user"
                      className="text-xl text-white"
                    />
                  )}
                </div>

                <h2 className="text-white text-xl">
                  {chatSelecionado.nomeUsuario}
                </h2>
              </div>

              {/* mensagens */}
              <div className="flex-1 p-4 flex flex-col gap-3 overflow-y-auto">
                {chatSelecionado.mensagens?.map((msg: any) => (
                  <div
                    key={msg.id_mensagem}
                    className={`p-3 rounded-lg max-w-xl text-white relative ${
                      msg.id_remetente === usuarioLogado
                        ? "bg-purple-600 self-end mr-2"
                        : "bg-gray-600 self-start ml-2"
                    }`}
                  >
                    {msg.conteudo}

                    {msg.id_remetente === usuarioLogado && (
                      <div className="absolute top-3 right-0">
                        <button
                          onClick={() =>
                            setMenuAberto(
                              menuAberto === msg.id_mensagem
                                ? null
                                : msg.id_mensagem
                            )
                          }
                          className="text-white text-sm"
                        >
                          <Icon
                            icon="iconamoon:arrow-down-2-thin"
                            width={20}
                            height={20}
                            className="-mt-8"
                          />
                        </button>

                        {menuAberto === msg.id_mensagem && (
                          <div className="absolute right-0 mt-1 bg-gray-700 rounded shadow-md text-sm z-10">
                            <button
                              onClick={() => editarMensagem()}
                              className="flex flex-col px-3 py-1 hover:bg-gray-600 w-full text-left"
                            >
                              Editar
                            </button>

                            <button
                              onClick={() =>
                                excluirMensagem(msg.id_mensagem)
                              }
                              className="flex flex-col px-3 py-1 hover:bg-gray-600 w-full text-left text-red-400"
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
            <div className="flex-1 flex items-center justify-center">
              <p className="text-gray-400">Selecione uma conversa</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}