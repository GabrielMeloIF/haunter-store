import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cupom } from './cupom.entitity';
import { CupomUsuario } from './cupom-usuario.entity';
import { CupomService } from './cupom.service';
import { CupomController } from './cupom.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Cupom, CupomUsuario]), // registra as duas tabelas
  ],
  controllers: [CupomController],
  providers: [CupomService],
  exports: [CupomService],
})
export class CupomModule {}