import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.usuario.findMany({
      select: { id_usuario: true, nome: true, email: true, senha: true },
    });
  }

  async findOne(id: number) {
    return this.prisma.usuario.findUnique({
      where: { id_usuario: id },
      select: { id_usuario: true, nome: true, email: true, senha: true },
    });
  }

  async create(data: {
    nome: string;
    email: string;
    senha: string;
    confirmar_senha: string;
  }) {
    const bcrypt = await import('bcrypt');

    const senhaHash = await bcrypt.hash(data.senha, 10);

    return this.prisma.usuario.create({
      data: {
        nome: data.nome,
        email: data.email,
        senha: senhaHash,
        confirmar_senha: senhaHash,
      },
    });
  }

  async update(
    id: number,
    data: Partial<{
      nome: string;
      email: string;
      senha: string;
      confirmar_senha: string;
    }>,
  ) {
    if (!id) throw new Error('ID inválido');

    
    if (data.senha) {
      const bcrypt = await import('bcrypt');
      data.senha = await bcrypt.hash(data.senha, 10);
    }

    return this.prisma.usuario.update({
      where: { id_usuario: Number(id) }, 
      data,
    });
  }

  async remove(id: number) {
    return this.prisma.usuario.delete({
      where: { id_usuario: id },
    });
  }
}
