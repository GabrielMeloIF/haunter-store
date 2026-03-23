import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { CarrinhoService } from './carrinho.service';

@Controller('carrinho')
export class CarrinhoController {
  constructor(private readonly carrinhoService: CarrinhoService) {}

  @Get('usuario/:id_usuario')
  findByUsuario(@Param('id_usuario') id_usuario: string) {
    return this.carrinhoService.findByUsuario(+id_usuario);
  }

  @Post()
  addItem(
    @Body() body: { id_usuario: number; id_produto: number; quantidade: number },
  ) {
    return this.carrinhoService.addItem(body);
  }

  @Put(':id_carrinho')
  updateItem(
    @Param('id_carrinho') id_carrinho: string,
    @Body() body: { quantidade: number },
  ) {
    return this.carrinhoService.updateItem(+id_carrinho, body.quantidade);
  }

  @Delete(':id_carrinho')
  removeItem(@Param('id_carrinho') id_carrinho: string) {
    return this.carrinhoService.removeItem(+id_carrinho);
  }

  @Delete('usuario/:id_usuario/limpar')
  clearCarrinho(@Param('id_usuario') id_usuario: string) {
    return this.carrinhoService.clearCarrinho(+id_usuario);
  }
}
