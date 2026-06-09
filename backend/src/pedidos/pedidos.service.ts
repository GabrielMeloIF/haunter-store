import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PedidosService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.pedido.findMany({
      include: { itempedido: { include: { produto: true } }, usuario: { select: { id_usuario: true, nome: true, email: true } } },
    });
  }

  async findOne(id: number) {
    const pedido = await this.prisma.pedido.findUnique({
      where: { id_pedido: id },
      include: { itempedido: { include: { produto: true } }, usuario: { select: { id_usuario: true, nome: true, email: true } } },
    });
    if (!pedido) throw new NotFoundException(`Pedido #${id} não encontrado`);
    return pedido;
  }

  findByUsuario(id_usuario: number) {
    return this.prisma.pedido.findMany({
      where: { id_usuario },
      include: { itempedido: { include: { produto: true } } },
      orderBy: { data_pedido: 'desc' },
    });
  }

  async createFromCarrinho(id_usuario: number) {
    // Busca todos os itens do carrinho do usuário
    const itensCarrinho = await this.prisma.carrinho.findMany({
      where: { id_usuario },
      include: { produto: true },
    });

    if (itensCarrinho.length === 0) {
      throw new BadRequestException('Carrinho vazio — não é possível criar um pedido.');
    }

    // Calcula o total
    const valor_total = itensCarrinho.reduce(
      (acc, item) => acc + item.produto.preco * item.quantidade,
      0,
    );

    // Cria pedido + itens numa única transação e limpa o carrinho
    const pedido = await this.prisma.$transaction(async (tx) => {
      const novoPedido = await tx.pedido.create({
        data: {
          id_usuario,
          valor_total,
          itempedido: {
            create: itensCarrinho.map((item) => ({
              id_produto: item.id_produto,
              quantidade: item.quantidade,
              preco_unitario: item.produto.preco,
            })),
          },
        },
        include: { itempedido: true },
      });

      // Limpa carrinho
      await tx.carrinho.deleteMany({ where: { id_usuario } });

      return novoPedido;
    });

    return pedido;
  }

  async createFromProduto(id_usuario: number, id_produto: number, quantidade = 1) {
    if (quantidade <= 0) {
      throw new BadRequestException('Quantidade inválida para checkout.');
    }

    const produto = await this.prisma.produto.findUnique({ where: { id: id_produto } });
    if (!produto) {
      throw new NotFoundException(`Produto #${id_produto} não encontrado`);
    }

    const pedido = await this.prisma.pedido.create({
      data: {
        id_usuario,
        valor_total: produto.preco * quantidade,
        itempedido: {
          create: {
            id_produto,
            quantidade,
            preco_unitario: produto.preco,
          },
        },
      },
      include: { itempedido: { include: { produto: true } } },
    });

    return pedido;
  }

  updateStatus(
    id: number,
    status: 'PENDENTE' | 'CONFIRMADO' | 'ENVIADO' | 'ENTREGUE' | 'CANCELADO',
  ) {
    return this.prisma.pedido.update({
      where: { id_pedido: id },
      data: { status },
    });
  }
}
