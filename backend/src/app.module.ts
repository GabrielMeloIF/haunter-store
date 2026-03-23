import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { ProdutosModule } from './produtos/produtos.module';
import { CategoriasModule } from './categorias/categorias.module';
import { CarrinhoModule } from './carrinho/carrinho.module';
import { PedidosModule } from './pedidos/pedidos.module';

@Module({
  imports: [
    UsersModule,
    ProdutosModule,
    CategoriasModule,
    CarrinhoModule,
    PedidosModule,
  ],
})
export class AppModule {}