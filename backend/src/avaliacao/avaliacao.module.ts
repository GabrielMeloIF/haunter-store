import { Module } from '@nestjs/common';
import { AvaliacaoController } from './avaliacao.controller';
import { AvaliacaoService } from './avaliacao.service';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [AvaliacaoController],
  providers: [AvaliacaoService, PrismaService],
  exports: [AvaliacaoService],
})
export class AvaliacaoModule {}
