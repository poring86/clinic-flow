import {
  Controller,
  Post,
  Body,
  Get,
  Query,
  Delete,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import type { Request, Response } from 'express';
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

  @Get('google')
  @UseGuards(AuthGuard('google'))
  googleLogin() {
    // Passport redirects to Google
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleCallback(@Req() req: Request, @Res() res: Response) {
    const googleUser = req.user as {
      email: string;
      name: string;
      picture: string | null;
      accessToken: string;
    };
    const { token } = await this.authService.findOrCreateGoogleUser(googleUser);
    const frontendUrl =
      process.env.FRONTEND_URL || 'http://localhost:3000';
    res.redirect(`${frontendUrl}/api/auth/google/callback?token=${token}`);
  }
}
