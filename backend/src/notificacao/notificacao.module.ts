import { Module } from '@nestjs/common';
import { NotificacaoController } from './notificacao.controller';
import { NotificacaoService } from './notificacao.service';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [NotificacaoController],
  providers: [NotificacaoService, PrismaService],
  exports: [NotificacaoService],
})
export class NotificacaoModule {}
