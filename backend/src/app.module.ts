import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { ProdutosModule } from './produtos/produtos.module';
import { CategoriasModule } from './categorias/categorias.module';
import { CarrinhoModule } from './carrinho/carrinho.module';
import { PedidosModule } from './pedidos/pedidos.module';
import { ConversaModule } from './conversa/conversa.module';
import { MensagemModule } from './mensagem/mensagem.module';
import { NotificacaoModule } from './notificacao/notificacao.module';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'mysql',
        host: config.get<string>('DB_HOST'),
        port: config.get<number>('DB_PORT'),
        username: config.get<string>('DB_USERNAME'),
        password: config.get<string>('DB_PASSWORD'),
        database: config.get<string>('DB_NAME'),
        autoLoadEntities: true,
        synchronize: true,
      }),
    }),
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