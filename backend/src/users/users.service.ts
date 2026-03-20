import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.usuario.findMany({
      select: { id_usuario: true, nome: true, email: true, telefone: true, endereco: true }
      // senha e cpf nunca retornam na listagem
    });
  }

  async findOne(id: number) {
    return this.prisma.usuario.findUnique({
      where: { id_usuario: id },
      select: { id_usuario: true, nome: true, email: true, telefone: true, endereco: true }
    });
  }

  async create(data: { nome: string; email: string; senha: string; cpf: string; telefone: string; endereco: string }) {
    // hash da senha antes de salvar
    const bcrypt = await import('bcrypt');
    const senhaHash = await bcrypt.hash(data.senha, 10);

    return this.prisma.usuario.create({
      data: { ...data, senha: senhaHash }
    });
  }

  async update(id: number, data: Partial<{ nome: string; email: string; telefone: string; endereco: string }>) {
    return this.prisma.usuario.update({
      where: { id_usuario: id },
      data,
    });
  }

  async remove(id: number) {
    return this.prisma.usuario.delete({
      where: { id_usuario: id },
    });
  }
}