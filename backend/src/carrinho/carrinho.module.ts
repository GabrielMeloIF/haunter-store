import { Module } from '@nestjs/common';
import { CarrinhoController } from './carrinho.controller';
import { CarrinhoService } from './carrinho.service';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [CarrinhoController],
  providers: [CarrinhoService, PrismaService],
})
export class CarrinhoModule {}
