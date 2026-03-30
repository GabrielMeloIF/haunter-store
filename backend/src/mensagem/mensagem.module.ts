import { Module } from '@nestjs/common';
import { MensagemController } from './mensagem.controller';
import { MensagemService } from './mensagem.service';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [MensagemController],
  providers: [MensagemService, PrismaService],
  exports: [MensagemService],
})
export class MensagemModule {}
