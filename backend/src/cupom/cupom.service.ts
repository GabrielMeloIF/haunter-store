import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cupom } from './cupom.entitity';
import { CupomUsuario } from './cupom-usuario.entity';

@Injectable()
export class CupomService {
  constructor(
    @InjectRepository(Cupom)
    private readonly cupomRepo: Repository<Cupom>,

    @InjectRepository(CupomUsuario)
    private readonly cupomUsuarioRepo: Repository<CupomUsuario>,
  ) {}

  // ── CRUD básico ────────────────────────────────────────────────────────────

  create(data: {
    codigo: string;
    descricao: string;
    desconto: number;
    validade: string;
  }) {
    console.log('DADOS CUPOM:', data) // adiciona isso
    const cupom = this.cupomRepo.create({
      ...data,
      validade: new Date(data.validade),
    });
    return this.cupomRepo.save(cupom);
  }

  findAll() {
    return this.cupomRepo.find({ order: { criado_em: 'DESC' } });
  }

  async findOne(id: number) {
    const cupom = await this.cupomRepo.findOne({ where: { id_cupom: id } });
    if (!cupom) throw new NotFoundException(`Cupom #${id} não encontrado`);
    return cupom;
  }

  async remove(id: number) {
    await this.findOne(id); // lança 404 se não existir
    return this.cupomRepo.delete({ id_cupom: id });
  }

  // ── Por usuário ────────────────────────────────────────────────────────────

  findByUsuario(id_usuario: number) {
    return this.cupomUsuarioRepo.find({
      where: { id_usuario },
      relations: ['cupom'],
      order: { utilizado_em: 'DESC' },
    });
  }

  // ── Validar ────────────────────────────────────────────────────────────────

  async validar(codigo: string, id_usuario: number) {
    const cupom = await this.cupomRepo.findOne({ where: { codigo } });
    if (!cupom) throw new NotFoundException(`Cupom "${codigo}" não encontrado`);

    if (new Date() > cupom.validade)
      throw new BadRequestException('Cupom expirado');

    const uso = await this.cupomUsuarioRepo.findOne({
      where: { id_cupom: cupom.id_cupom, id_usuario, utilizado: true },
    });
    if (uso) throw new BadRequestException('Cupom já utilizado por este usuário');

    return { valido: true, desconto: cupom.desconto, cupom };
  }

  // ── Utilizar ───────────────────────────────────────────────────────────────

  async utilizar(codigo: string, id_usuario: number) {
    // Valida antes de marcar (lança exceção se inválido)
    await this.validar(codigo, id_usuario);

    const cupom = await this.cupomRepo.findOne({ where: { codigo } });

    const existente = await this.cupomUsuarioRepo.findOne({
      where: { id_cupom: cupom!.id_cupom, id_usuario },
    });

    if (existente) {
      await this.cupomUsuarioRepo.update(existente.id_cupom_usuario, {
        utilizado: true,
        utilizado_em: new Date(),
      });
      return this.cupomUsuarioRepo.findOne({
        where: { id_cupom_usuario: existente.id_cupom_usuario },
      });
    }

    const novo = this.cupomUsuarioRepo.create({
      id_usuario,
      id_cupom: cupom!.id_cupom,
      utilizado: true,
      utilizado_em: new Date(),
    });
    return this.cupomUsuarioRepo.save(novo);
  }
}