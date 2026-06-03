import { Controller, Get, Post, Patch, Delete, Param, Body } from '@nestjs/common';
import { MensagemService } from './mensagem.service';

@Controller('mensagens')
export class MensagemController {
  constructor(private readonly mensagemService: MensagemService) {}

  @Post()
  create(@Body() body: { id_conversa?: number; id_destinatario?: number; id_remetente: number; conteudo: string }) {
    return this.mensagemService.create(body);
  }

  @Get('conversa/:id_conversa')
  findByConversa(@Param('id_conversa') id_conversa: string) {
    return this.mensagemService.findByConversa(+id_conversa);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.mensagemService.findOne(+id);
  }

  @Patch(':id/lida')
  marcarComoLida(@Param('id') id: string) {
    return this.mensagemService.marcarComoLida(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.mensagemService.remove(+id);
  }
}
