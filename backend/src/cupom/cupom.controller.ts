import { Controller, Get, Post, Delete, Param, Body } from '@nestjs/common';
import { CupomService } from './cupom.service';

@Controller('cupons')
export class CupomController {
  constructor(private readonly cupomService: CupomService) {}

  @Post()
  create(
    @Body()
    body: { codigo: string; descricao: string; desconto: number; validade: string },
  ) {
    return this.cupomService.create(body);
  }

  @Get()
  findAll() {
    return this.cupomService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cupomService.findOne(+id);
  }

  @Post('validar')
  validar(@Body() body: { codigo: string; id_usuario: number }) {
    return this.cupomService.validar(body.codigo, body.id_usuario);
  }

  @Post('utilizar')
  utilizar(@Body() body: { codigo: string; id_usuario: number }) {
    return this.cupomService.utilizar(body.codigo, body.id_usuario);
  }

  @Get('usuario/:id_usuario')
  findByUsuario(@Param('id_usuario') id_usuario: string) {
    return this.cupomService.findByUsuario(+id_usuario);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cupomService.remove(+id);
  }
}
