import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { UsersService } from 'src/modules/users/users.service';
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

    const token = await this.signPayload({ sub: newUser.id });

    return {
      userId: newUser.id,
      name: newUser.name,
      email: newUser.email,
      access_token: token.access_token,
    };
  }

  async signIn(data: SignInDto) {
    const user = await this.userService.findByEmail(data.email);
    if (!user) throw new NotFoundException('User does not exist');

    await this.verifyPassword(data.password, user.password);

    const token = await this.signPayload({ sub: user.id });

    return {
      userId: user.id,
      name: user.name,
      email: user.email,
      access_token: token.access_token,
    };
  }

  private async hashPassword(password: string) {
    const hash = await argon2.hash(password);
    return hash;
  }

  private async verifyPassword(password: string, hashed: string) {
    const checkPass = await argon2.verify(hashed, password);
    if (!checkPass) throw new BadRequestException('Incorrect credentials');
    return;
  }

  private async signPayload(payload: { sub: number | string }) {
    const token = await this.jwtService.signAsync(payload);

    return {
      access_token: token,
    };
  }

  async profile(userId: number) {
    const profile = await this.userService.findById(userId);

    if (!profile) throw new NotFoundException('User not found');

    return {
      id: profile.id,
      name: profile.name,
      email: profile.email,
    };
  }

  private async refreshToken(payload: { sub: number | string }) {
    const token = await this.jwtService.signAsync(payload, {
      expiresIn: '7d',
    });

    return {
      refresh_token: token,
    };
  }
}
