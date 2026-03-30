import { Module } from '@nestjs/common';
import { CupomController } from './cupom.controller';
import { CupomService } from './cupom.service';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [CupomController],
  providers: [CupomService, PrismaService],
  exports: [CupomService],
})
export class CupomModule {}
