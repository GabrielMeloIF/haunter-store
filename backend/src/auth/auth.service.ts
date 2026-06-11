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
  const emailNormalizado = email.trim().toLowerCase();

  console.log('================ LOGIN ================');
  console.log('Email recebido:', emailNormalizado);

  const usuario = await this.prisma.usuario.findFirst({
    where: {
      OR: [
        { email: emailNormalizado },
        { nome: emailNormalizado },
      ],
    },
  });

  console.log('Usuário encontrado:', !!usuario);

  if (!usuario) {
    console.log('ERRO: usuário não encontrado');
    throw new UnauthorizedException('Email ou senha inválidos');
  }

  console.log('ID:', usuario.id_usuario);
  console.log('Email banco:', usuario.email);
  console.log('Hash salvo:', usuario.senha.substring(0, 30) + '...');

  const senhaValida = await bcrypt.compare(senha, usuario.senha);

  console.log('Senha recebida:', senha);
  console.log('Senha válida:', senhaValida);

  if (!senhaValida) {
    console.log('ERRO: senha inválida');
    throw new UnauthorizedException('Email ou senha inválidos');
  }

  console.log('LOGIN REALIZADO COM SUCESSO');

  const payload = {
    sub: usuario.id_usuario,
    email: usuario.email,
    tipo: usuario.tipo_usuario,
  };

  return {
    token: this.jwtService.sign(payload),
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

  async esqueciSenha(email: string) {
  const emailNormalizado = email.trim().toLowerCase();

  const usuario = await this.prisma.usuario.findFirst({
    where: { email: emailNormalizado },
  });

  if (!usuario) {
    return { message: 'Se este email estiver cadastrado, uma senha temporária foi gerada.' };
  }

  const palavras = ['Gato', 'Luna', 'Fogo', 'Nexo', 'Vega', 'Kira', 'Zion', 'Orca'];
  const palavra  = palavras[Math.floor(Math.random() * palavras.length)];
  const numero   = Math.floor(1000 + Math.random() * 9000);
  const senhaTmp = `${palavra}${numero}`;

  const hash = await bcrypt.hash(senhaTmp, 10);

  await this.prisma.usuario.update({
  where: { id_usuario: usuario.id_usuario },
  data: {
    senha: hash,
    confirmar_senha: hash,
  },
});
  return {
    message: 'Senha temporária gerada com sucesso!',
    senhaTmp,
  };
}
}