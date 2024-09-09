import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService
  ) {}
  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneIncludePassword(email);
    if (user) {
      let correct_password = await bcrypt.compare(pass, user.password);

      if (correct_password) {
        const { password, ...result } = user;
        return result;
      }
    }
    return null;
  }
  async login(user: any) {
    const payload = { username: user.email, sub: user.id };
    const token = this.jwtService.sign(payload);
    return token;
  }
  async setCookie(res: any, token: string) {
    res.cookie('accessToken', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'Strict',
    });
  }
  async clearCookie(res: any) {
    res.clearCookie('accessToken');
  }
  async register(user) {
    return this.usersService.register(user);
  }
}
