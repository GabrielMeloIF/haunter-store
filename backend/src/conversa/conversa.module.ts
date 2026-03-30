import { Module } from '@nestjs/common';
import { ConversaController } from './conversa.controller';
import { ConversaService } from './conversa.service';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [ConversaController],
  providers: [ConversaService, PrismaService],
  exports: [ConversaService],
})
export class ConversaModule {}
