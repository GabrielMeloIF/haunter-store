import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards, Req, BadRequestException, NotFoundException } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

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
    console.log('PUT /users chamado com id:', id, '| body:', body)
    return this.usersService.update(+id, body)
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove(@Param('id') id: string, @Req() req: any) {
    const userId = +id;
    const requestingUserId = req.user?.id;

    // Verificar se o usuário existe
    const user = await this.usersService.findOne(userId);
    if (!user) {
      throw new NotFoundException(`Usuário #${userId} não encontrado`);
    }

    // Apenas o próprio usuário ou admin pode deletar
    if (requestingUserId !== userId && req.user?.tipo !== 'ADMIN') {
      throw new BadRequestException('Você não tem permissão para deletar esta conta');
    }

    console.log(`🗑️ Deletando usuário #${userId} por requisição de #${requestingUserId}`);
    const result = await this.usersService.remove(userId);
    console.log(`✅ Usuário #${userId} deletado com sucesso`);
    
    return { message: 'Conta deletada com sucesso', usuario: result };
  }
}