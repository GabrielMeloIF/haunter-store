import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Post()
  create(
    @Body()
    body: {
      nome: string
      email: string
      senha: string
      confirmar_senha: string
      foto?: string
      tipo_usuario?: 'CLIENTE' | 'ADMIN'
    },
  ) {
    return this.usersService.create(body);
  }

  @Put(':id')
update(
  @Param('id') id: string,
  @Body()
  body: Partial<{
    nome: string
    email: string
    senha: string
    confirmar_senha: string
    foto: string
    tipo_usuario: 'CLIENTE' | 'ADMIN'
  }>,
) {
  console.log('PUT /users chamado com id:', id, '| body:', body) // ← aqui
  return this.usersService.update(+id, body)
};

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}