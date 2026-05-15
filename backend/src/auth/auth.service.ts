import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async login(email: string, senha: string) {
    const usuario = await this.prisma.usuario.findFirst({
      where: {
        OR: [{ email: email }, { nome: email }],
      },
    });
    

    if (!usuario) {
      throw new UnauthorizedException('Email ou senha inválidos');
    }

    // Compara senha com o hash salvo no banco
    const senhaValida = await bcrypt.compare(senha, usuario.senha);

    if (!senhaValida) {
      throw new UnauthorizedException('Email ou senha inválidos');
    }

    // Gera o token JWT
    const payload = {
      sub: usuario.id_usuario,
      email: usuario.email,
      tipo: usuario.tipo_usuario,
    };

    const token = this.jwtService.sign(payload);

    return {
      token,
      usuario: {
        id: usuario.id_usuario,
        nome: usuario.nome,
        email: usuario.email,
        tipo: usuario.tipo_usuario,
        foto: (usuario as any).foto ?? null,
      },
    };
  }

  async validarToken(token: string) {
    try {
      return this.jwtService.verify(token);
    } catch {
      throw new UnauthorizedException('Token inválido ou expirado');
    }
  }
}
