import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { ProdutosService } from './produtos.service';

@Controller('produtos')
export class ProdutosController {
  constructor(private readonly produtosService: ProdutosService) {}

  @Get()
  findAll() {
    return this.produtosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.produtosService.findOne(+id);
  }

  @Post()
  create(
    @Body()
    body: {
      nome: string;
      descricao: string;
      preco: number;
      estoque: number;
      tipo_produto?: string;
      categoriaId: number;
      imagem_url: string;
    },
  ) {
    return this.produtosService.create(body);
  }

  @Put('lote')
updateMany(
  @Body()
  body: {
    id: number;
    imagem_url?: string;
    nome?: string;
    descricao?: string;
    preco?: number;
    estoque?: number;
    categoriaId?: number;
  }[],
) {
  return this.produtosService.updateMany(body);
}

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body()
    body: Partial<{
      nome: string;
      descricao: string;
      preco: number;
      estoque: number;
      tipo_produto: string;
      categoriaId: number;
    }>,
  ) {
    return this.produtosService.update(+id, body);
  }
  

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.produtosService.remove(+id);
  }
}
