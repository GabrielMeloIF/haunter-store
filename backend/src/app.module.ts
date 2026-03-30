import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { ProdutosModule } from './produtos/produtos.module';
import { CategoriasModule } from './categorias/categorias.module';
import { CarrinhoModule } from './carrinho/carrinho.module';
import { PedidosModule } from './pedidos/pedidos.module';
import { ConversaModule } from './conversa/conversa.module';
import { MensagemModule } from './mensagem/mensagem.module';
import { NotificacaoModule } from './notificacao/notificacao.module';

@Module({
  imports: [
    UsersModule,
    ProdutosModule,
    CategoriasModule,
    CarrinhoModule,
    PedidosModule,
    ConversaModule,
    MensagemModule,
    NotificacaoModule,
  ],
})
export class AppModule {}
