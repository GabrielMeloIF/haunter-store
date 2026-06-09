import { Controller, Get, Post, Patch, Param, Body } from '@nestjs/common';
import { PedidosService } from './pedidos.service';

@Controller('pedidos')
export class PedidosController {
  constructor(private readonly pedidosService: PedidosService) {}

  @Get()
  findAll() {
    return this.pedidosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.pedidosService.findOne(+id);
  }

  @Get('usuario/:id_usuario')
  findByUsuario(@Param('id_usuario') id_usuario: string) {
    return this.pedidosService.findByUsuario(+id_usuario);
  }

  // Finaliza a compra: converte carrinho em pedido
  @Post('finalizar/:id_usuario')
  createFromCarrinho(@Param('id_usuario') id_usuario: string) {
    return this.pedidosService.createFromCarrinho(+id_usuario);
  }

  // Finaliza a compra de um produto direto, sem usar o carrinho
  @Post('checkout')
  createFromProduto(
    @Body()
    body: {
      id_usuario: number;
      id_produto: number;
      quantidade?: number;
    },
  ) {
    return this.pedidosService.createFromProduto(body.id_usuario, body.id_produto, body.quantidade ?? 1);
  }

  // Atualiza status (admin)
  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body()
    body: {
      status: 'PENDENTE' | 'CONFIRMADO' | 'ENVIADO' | 'ENTREGUE' | 'CANCELADO';
    },
  ) {
    return this.pedidosService.updateStatus(+id, body.status);
  }
}
