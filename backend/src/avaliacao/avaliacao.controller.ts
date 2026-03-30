import { Controller, Get, Post, Delete, Param, Body } from '@nestjs/common';
import { AvaliacaoService } from './avaliacao.service';

@Controller('avaliacoes')
export class AvaliacaoController {
  constructor(private readonly avaliacaoService: AvaliacaoService) {}

  @Post()
  create(
    @Body()
    body: { id_usuario: number; id_produto: number; nota: number; comentario: string },
  ) {
    return this.avaliacaoService.create(body);
  }

  @Get('produto/:id_produto')
  findByProduto(@Param('id_produto') id_produto: string) {
    return this.avaliacaoService.findByProduto(+id_produto);
  }

  @Get('usuario/:id_usuario')
  findByUsuario(@Param('id_usuario') id_usuario: string) {
    return this.avaliacaoService.findByUsuario(+id_usuario);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.avaliacaoService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.avaliacaoService.remove(+id);
  }
}
