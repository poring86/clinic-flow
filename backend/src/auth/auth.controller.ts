import { Controller, Post, Body, Get, Query, Delete } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Get('session')
  async session(@Query('token') token: string) {
    return this.authService.getSession(token);
  }

  @Delete('session')
  async deleteSession(@Query('token') token: string) {
    return this.authService.deleteSession(token);
  }
}
