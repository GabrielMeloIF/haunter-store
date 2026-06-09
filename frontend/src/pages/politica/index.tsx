import Header from "@/Components/Header/Header";
import Footer from "@/Components/Footer/Footer";

export default function Privacidade() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1 p-10 text-white ">
        <h1 className="text-3xl font-bold mb-5">Política de Privacidade</h1>

        <p className="mb-4">
          Esta Política explica como coletamos, usamos, divulgamos e protegemos
          suas informações pessoais quando você usa nossa plataforma.
        </p>

        <section className="mb-4">
          <h2 className="font-bold">1. Tipos de dados coletados</h2>
          <p>
            Podemos coletar: (a) informações de identificação (nome, e-mail,
            telefone); (b) dados de pagamento (quando necessário); (c)
            informações de uso e dispositivo.
          </p>
        </section>

        <section className="mb-4">
          <h2 className="font-bold">2. Como usamos seus dados</h2>
          <p>
            Utilizamos os dados para processar pedidos, fornecer suporte,
            melhorar o serviço, prevenir fraudes e cumprir obrigações legais.
          </p>
        </section>

        <section className="mb-4">
          <h2 className="font-bold">3. Compartilhamento com terceiros</h2>
          <p>
            Podemos compartilhar informações com provedores de pagamento,
            serviços de entrega e prestadores que atuam em nosso nome. Não
            vendemos seus dados a terceiros.
          </p>
        </section>

        <section className="mb-4">
          <h2 className="font-bold">4. Cookies e tecnologias semelhantes</h2>
          <p>
            Usamos cookies para melhorar a navegação, lembrar preferências e
            analisar o uso do site. Você pode ajustar as preferências de
            cookies no seu navegador.
          </p>
        </section>

        <section className="mb-4">
          <h2 className="font-bold">5. Segurança e retenção</h2>
          <p>
            Implementamos medidas técnicas e organizacionais para proteger
            dados. Reteremos informações pelo tempo necessário para cumprir
            finalidades legais e operacionais.
          </p>
        </section>

        <section className="mb-4">
          <h2 className="font-bold">6. Seus direitos</h2>
          <p>
            Você pode solicitar acesso, correção, exclusão ou portabilidade de
            seus dados. Para exercer seus direitos, contate
            <strong> suporte@haunterstore.com</strong>.
          </p>
        </section>

        <section className="mb-4">
          <h2 className="font-bold">7. Alterações nesta política</h2>
          <p>
            Podemos atualizar esta Política. Quando fizermos mudanças
            significativas, informaremos na plataforma com a data de vigência.
          </p>
        </section>

        <section className="mb-4">
          <h2 className="font-bold">8. Contato</h2>
          <p>
            Para dúvidas sobre privacidade, envie um e-mail para
            <strong> suporte@haunterstore.com</strong>.
          </p>
        </section>
      </main>

      <Footer />
    </div>
  );
}