import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';

import { CreateUserDto, toIUser } from '@dog-finder/models';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Req() req, @Res() res: Response) {
    const token = await this.authService.login(req.user);
    await this.authService.setCookie(res, token);
    res.send(toIUser(req.user));
  }
  @Post('logout')
  async logout(@Res() res: Response) {
    await this.authService.clearCookie(res);
    res.send({ message: 'Logged out' });
  }
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Req() req) {
    return toIUser(req.user);
  }
  @Post('register')
  async register(@Body() userDto: CreateUserDto, @Res() res: Response) {
    try {
      const user = await this.authService.register(userDto);
      const token = await this.authService.login(user);
      await this.authService.setCookie(res, token);
      res.send(toIUser(user));
    } catch (error) {
      res.status(HttpStatus.BAD_REQUEST).json({
        statusCode: HttpStatus.BAD_REQUEST,
        message:
          error.code == 23505
            ? 'Email je zauzet'
            : error.message || 'Desila se greska prilikom registracije',
      });
    }
  }
}
