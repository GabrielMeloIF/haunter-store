import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class MarketplaceService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
      return this.prisma.produto.findMany();  
    }

  async create(data: any) {
    console.log('BODY:', data);

    return this.prisma.produto.create({
      data: {
        nome: data.title || '',
        descricao: data.description || '',

        preco: Number(data.price) || 0,

        marketplace: true,

        negociavel: Boolean(data.negotiable),

        condicao: data.condition || null,

        cep: data.cep || null,
        cidade: data.city || null,

        imagens: data.photos || [],
        contatos: data.contacts || [],

        id_usuario: data.id_usuario || null,
      },
    });

  }
  async update(data: any) {
    return this.prisma.produto.update({
      where: { id: data.id },
      data: {
        nome: data.title || '',
        descricao: data.description || '',
        preco: Number(data.price) || 0,
        marketplace: true,
        negociavel: Boolean(data.negotiable),
        condicao: data.condition || null,
        cep: data.cep || null,
        cidade: data.city || null,
        imagens: data.photos || [],
        contatos: data.contacts || [],
        id_usuario: data.id_usuario || null,
      },
    });
  }

  async remove(data: any) {
    return this.prisma.produto.delete({
      where: { id: data.id },
    });
  }
}