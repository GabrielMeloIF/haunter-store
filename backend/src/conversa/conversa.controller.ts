import { Controller, Get, Post, Delete, Param, Body } from '@nestjs/common';
import { ConversaService } from './conversa.service';

@Controller('conversas')
export class ConversaController {
  constructor(private readonly conversaService: ConversaService) {}

  @Post()
  create(@Body() body: { participantes: number[] }) {
    return this.conversaService.create(body.participantes);
  }

  @Get()
  findAll() {
    return this.conversaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.conversaService.findOne(+id);
  }

  @Get('usuario/:id_usuario')
  findByUsuario(@Param('id_usuario') id_usuario: string) {
    return this.conversaService.findByUsuario(+id_usuario);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.conversaService.remove(+id);
  }
}
