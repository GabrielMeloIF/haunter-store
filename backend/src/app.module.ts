import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { ProdutosModule } from './produtos/produtos.module';
import { CategoriasModule } from './categorias/categorias.module';
import { CarrinhoModule } from './carrinho/carrinho.module';
import { PedidosModule } from './pedidos/pedidos.module';
import { ConversaModule } from './conversa/conversa.module';
import { MensagemModule } from './mensagem/mensagem.module';
import { NotificacaoModule } from './notificacao/notificacao.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,         
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