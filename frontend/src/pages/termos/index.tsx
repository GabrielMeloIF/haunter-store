import Header from "@/Components/Header/Header";
import Footer from "@/Components/Footer/Footer";
export default function Termos() {
  return (
    <>
    <Header />
    <div className="min-h-screen p-10 text-white">
      <h1 className="text-3xl font-bold mb-5">Termos de Uso</h1>

      <p className="mb-4">
        Estes Termos de Uso regem o acesso e uso dos serviços oferecidos por
        este site. Ao utilizar a plataforma você concorda com estes termos.
      </p>

      <section className="mb-4">
        <h2 className="font-bold">1. Serviço</h2>
        <p>
          Oferecemos uma plataforma para compra e venda de produtos. Os
          serviços podem incluir funcionalidades adicionais, como anúncios e
          canais de comunicação entre usuários.
        </p>
      </section>

      <section className="mb-4">
        <h2 className="font-bold">2. Conta e segurança</h2>
        <p>
          O usuário é responsável por manter a confidencialidade de sua
          conta e senha. Qualquer atividade realizada por meio da conta é de
          responsabilidade do titular.
        </p>
      </section>

      <section className="mb-4">
        <h2 className="font-bold">3. Conduta</h2>
        <p>
          É proibido utilizar a plataforma para fins ilegais, fraudes,
          divulgação de conteúdo ofensivo ou violação de direitos de terceiros.
        </p>
      </section>

      <section className="mb-4">
        <h2 className="font-bold">4. Pagamentos e cancelamentos</h2>
        <p>
          Pagamentos seguem as condições do meio escolhido. Cancelamentos e
          reembolsos serão tratados conforme nossa política e legislação
          aplicável.
        </p>
      </section>

      <section className="mb-4">
        <h2 className="font-bold">5. Limitação de responsabilidade</h2>
        <p>
          Até onde permitido por lei, a plataforma não se responsabiliza por
          danos indiretos, lucros cessantes ou perdas decorrentes do uso do
          serviço.
        </p>
      </section>

      <section className="mb-4">
        <h2 className="font-bold">6. Propriedade intelectual</h2>
        <p>
          Todo conteúdo fornecido pela plataforma é protegido por direitos de
          propriedade intelectual. O uso não autorizado é proibido.
        </p>
      </section>

      <section className="mb-4">
        <h2 className="font-bold">7. Alterações nos termos</h2>
        <p>
          Podemos revisar estes termos periodicamente. Publicaremos a versão
          atualizada na plataforma e indicaremos a data de vigência.
        </p>
      </section>

      <section className="mb-4">
        <h2 className="font-bold">8. Contato</h2>
        <p>
          Dúvidas ou solicitações relacionadas aos Termos podem ser enviadas
          para <strong>suporte@seudominio.com</strong>.
        </p>
      </section>
    </div>
    <Footer />
    </>
  );
}