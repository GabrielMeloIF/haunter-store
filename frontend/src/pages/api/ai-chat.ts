import type { NextApiRequest, NextApiResponse } from "next";

type Req = {
  message: string;
  history?: Array<{ from: string; text: string }>;
};

async function fallbackReply(message: string) {
  const m = message.toLowerCase();
  
  // Saudações e perguntas gerais
  if (m.match(/\b(oi|ola|olá|tudo bem|e ai|opa)\b/)) 
    return "Olá! Bem-vindo! Sou assistente de suporte Haunter Store. Posso ajudar com dúvidas sobre compras, produtos, entrega, pagamento ou políticas. O que você gostaria de saber?";
  
  // Quem somos / Sobre
  if (m.match(/\b(quem|vocs|empresa|sobre|historia)\b/))
    return "Somos uma loja online dedicada a oferecer produtos de qualidade com ótimo atendimento. Para mais detalhes, visite nossa página inicial ou nos contate diretamente.";
  
  // Produtos
  if (m.match(/\b(produto|item|mercadoria|o que vendem|vocs vendem)\b/))
    return "Vendemos uma variedade de produtos conforme as categorias disponíveis no site. Navegue por consoles, jogos, PCs, periféricos e mais. Tem dúvida sobre um produto específico?";
  
  // Compra / Como comprar
  if (m.match(/\b(comprar|como compro|como faco|como fazer|tutorial|passo a passo)\b/))
    return "Para comprar: 1. Navegue e escolha um produto. 2. Clique em 'Comprar'. 3. Revise seu carrinho. 4. Finalize o pagamento com cartão ou outro meio. Precisa de mais detalhes?";
  
  // Troca e devolução
  if (m.match(/\b(troca|devolu|reembol|return)\b/))
    return "Para trocas e devoluções, verifique nossa política em /termos. Produtos com defeito ou entregues incorretamente podem ser trocados ou reembolsados. Entre em contato com suporte se necessário.";
  
  // Pagamento
  if (m.match(/\b(pagamento|cartao|credito|debito|pix|boleto|banco)\b/))
    return "Aceitamos cartões de crédito/débito e meios de pagamento compatíveis. Se houver erro, verifique os dados ou contate seu banco.";
  
  // Entrega / Rastreamento
  if (m.match(/\b(entrega|rastreia|rastreamento|onde fica|quanto tempo|prazo|quando chega)\b/))
    return "Após confirmação do pagamento você receberá um código de rastreamento por e-mail. Acompanhe o status em 'Minha Conta'. Dúvidas sobre prazos? Fale com suporte.";
  
  // Conta / Login
  if (m.match(/\b(conta|login|senha|entrar|cadastro|registrar|criar conta)\b/))
    return "Você pode fazer login ou criar uma conta na página 'Entrar'. Isso permite acompanhar pedidos, favoritos e preferências. Esqueceu a senha? Procure a opção de recuperação.";
  
  // Termos / Políticas
  if (m.match(/\b(termo|politica|privacidade|direito|condicao|condicoes)\b/))
    return "Confira nossos Termos de Uso em /termos e Política de Privacidade em /politica. Estes documentos explicam seus direitos e como protegemos seus dados.";
  
  // Suporte / Contato
  if (m.match(/\b(suporte|contato|falar|ajuda|problema|assistencia)\b/))
    return "Entre em contato conosco por email (suporte@haunter.store), WhatsApp (11 99999-9999) ou Instagram (@haunter_store). Segundas a sextas, 09:00–18:00.";
  
  // Padrão amigável
  return `Entendi sua pergunta sobre "${message}". Posso ajudar com: compras, produtos, entrega, pagamento, trocas, termos e política. O que você gostaria de saber?`;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();
  const body = req.body as Req;
  const msg = (body?.message || "").toString();
  if (!msg) return res.status(400).json({ error: "empty message" });

  const OPENAI_KEY = process.env.OPENAI_API_KEY;
  if (!OPENAI_KEY) {
    // fallback local reply
    const reply = await fallbackReply(msg);
    return res.status(200).json({ reply });
  }

  try {
    const payload = {
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "Você é um assistente de suporte ao cliente para um site de e-commerce. Responda de forma curta e clara em português." },
        ...(body.history || []).map((h) => ({ role: h.from === "user" ? "user" : "assistant", content: h.text })),
        { role: "user", content: msg },
      ],
      max_tokens: 400,
    };

    const r = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_KEY}`,
      },
      body: JSON.stringify(payload),
    });
    const text = await r.text();
    let data: any = null;
    try {
      data = JSON.parse(text);
    } catch (e) {
      console.error("OpenAI returned non-JSON response:", text);
    }
    console.debug("OpenAI response:", data ?? text);
    // If OpenAI reports invalid API key, fallback to local reply
    if (r.status === 401 || data?.error?.code === "invalid_api_key") {
      const fallback = await fallbackReply(msg);
      if (process.env.NODE_ENV === "development") {
        return res.status(200).json({ reply: fallback, debug: data ?? text });
      }
      return res.status(200).json({ reply: fallback });
    }

    const reply = data?.choices?.[0]?.message?.content ?? null;
    if (!reply) {
      if (process.env.NODE_ENV === "development") {
        return res.status(200).json({ reply: "Sem resposta da API", debug: data ?? text });
      }
      return res.status(200).json({ reply: "Sem resposta da API" });
    }
    return res.status(200).json({ reply });
  } catch (err) {
    return res.status(500).json({ error: "AI request failed" });
  }
}
