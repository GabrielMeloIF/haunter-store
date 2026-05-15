import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() body: { email: string; senha: string }) {
    if (!body.email || !body.senha) {
      throw new BadRequestException('Email ou nome de usuário e senha são obrigatórios');
    }

    return this.authService.login(body.email, body.senha);
  }
}