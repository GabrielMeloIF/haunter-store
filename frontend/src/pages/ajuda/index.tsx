import Header from "@/Components/Header/Header";
import Footer from "@/Components/Footer/Footer";

export default function Ajuda() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1 p-10 text-white">
        <h1 className="text-3xl font-bold mb-5">Central de Ajuda</h1>

        <div className="space-y-6">
          <section>
            <h2 className="font-bold text-lg">Como comprar</h2>
            <p>
              Navegue pelos produtos, escolha a variação desejada (quando
              aplicável) e clique em <strong>Comprar</strong>. Você poderá
              revisar o carrinho antes de finalizar o pagamento.
            </p>
          </section>

          <section>
            <h2 className="font-bold text-lg">Pagamento</h2>
            <p>
              Aceitamos cartões de crédito e débito e meios de pagamento
              compatíveis com a plataforma. Se houver falha no pagamento,
              verifique os dados do cartão ou entre em contato com seu banco.
            </p>
          </section>

          <section>
            <h2 className="font-bold text-lg">Entrega e acompanhamento</h2>
            <p>
              Após a confirmação do pagamento, você receberá um e-mail com as
              informações do pedido e o código de rastreamento (quando
              disponível). Acompanhe seus pedidos em <strong>Minha Conta</strong>.
            </p>
          </section>

          <section>
            <h2 className="font-bold text-lg">Trocas e devoluções</h2>
            <p>
              Consulte nossa política de devolução no final da página. Em
              geral, produtos com defeito ou entregues incorretamente podem ser
              trocados ou reembolsados mediante avaliação.
            </p>
          </section>

          <section>
            <h2 className="font-bold text-lg">Suporte</h2>
            <p>
              Se precisar de ajuda, entre em contato conosco:
            </p>
            <ul className="list-disc ml-6 mt-2">
              <li>Email: <strong>suporte@seudominio.com</strong></li>
              <li>Telefone/WhatsApp: <strong>(11) 99999-9999</strong></li>
              <li>Horário: Segunda a Sexta, 09:00–18:00</li>
            </ul>
          </section>

          <section>
            <h2 className="font-bold text-lg">Perguntas frequentes</h2>
            <p className="mt-2">Visite também nossas páginas:</p>
            <ul className="list-disc ml-6 mt-2">
              <li>
                <a href="/termos" className="underline hover:text-[#430883]">Termos de uso</a>
              </li>
              <li>
                <a href="/politica" className="underline hover:text-[#430883]">Política de privacidade</a>
              </li>
            </ul>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}