import { Controller, Get, Post, Patch, Delete, Param, Body } from '@nestjs/common';
import { NotificacaoService } from './notificacao.service';

@Controller('notificacoes')
export class NotificacaoController {
  constructor(private readonly notificacaoService: NotificacaoService) {}

  @Post()
  create(
    @Body()
    body: {
      id_usuario: number;
      tipo: 'MENSAGEM' | 'CONVERSA' | 'SISTEMA';
      titulo: string;
      descricao: string;
    },
  ) {
    return this.notificacaoService.create(body);
  }

  @Get('usuario/:id_usuario')
  findByUsuario(@Param('id_usuario') id_usuario: string) {
    return this.notificacaoService.findByUsuario(+id_usuario);
  }

  @Get('usuario/:id_usuario/nao-lidas')
  findNaoLidas(@Param('id_usuario') id_usuario: string) {
    return this.notificacaoService.findNaoLidas(+id_usuario);
  }

  @Patch(':id/lida')
  marcarComoLida(@Param('id') id: string) {
    return this.notificacaoService.marcarComoLida(+id);
  }

  @Patch('usuario/:id_usuario/lidas')
  marcarTodasComoLidas(@Param('id_usuario') id_usuario: string) {
    return this.notificacaoService.marcarTodasComoLidas(+id_usuario);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.notificacaoService.remove(+id);
  }
}
