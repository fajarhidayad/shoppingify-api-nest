import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/modules/users/users.service';
import argon2 from 'argon2';
import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signUp(data: SignUpDto) {
    const isEmailExist = await this.userService.findByEmail(data.email);
    if (isEmailExist) throw new BadRequestException('User already exist');

    const hashed = await this.hashPassword(data.password);

    const newUser = await this.userService.create({
      ...data,
      password: hashed,
    });

    return await this.signPayload({ email: newUser.email, sub: newUser.id });
  }

  async signIn(data: SignInDto) {
    const user = await this.userService.findByEmail(data.email);
    if (!user) throw new UnauthorizedException('User does not exist');

    await this.verifyPassword(data.password, user.password);

    return await this.signPayload({ email: user.email, sub: user.id });
  }

  private async hashPassword(password: string) {
    const hash = await argon2.hash(password);
    return hash;
  }

  private async verifyPassword(password: string, hashed: string) {
    const checkPass = await argon2.verify(hashed, password);
    if (!checkPass) throw new UnauthorizedException('Incorrect password');
    return;
  }

  private async signPayload(payload: { email: string; sub: number | string }) {
    const token = await this.jwtService.signAsync(payload);

    return {
      access_token: token,
    };
  }
}
