import {
  Body,
  Controller,
  Get,
  Post,
  Res,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto, signInSchema } from './dto/sign-in.dto';
import { SignUpDto, signUpSchema } from './dto/sign-up.dto';
import { ZodValidationPipe } from 'src/utils/zod-validation.pipe';
import { Response } from 'express';
import { JwtAuthGuard } from './guard/jwt-auth.guard';
import { User } from 'src/common/decorators/user.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @UsePipes(new ZodValidationPipe(signInSchema))
  async signIn(
    @Body() data: SignInDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { access_token, email, name, userId } =
      await this.authService.signIn(data);

    res.cookie('access-token', access_token, { httpOnly: true });

    return {
      userId,
      email,
      name,
    };
  }

  @Post('register')
  @UsePipes(new ZodValidationPipe(signUpSchema))
  async signUp(
    @Body() data: SignUpDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { access_token, email, name, userId } =
      await this.authService.signUp(data);

    res.cookie('access-token', access_token, { httpOnly: true });

    return {
      email,
      name,
      userId,
    };
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  async profile(@User('id') userId: number) {
    return await this.authService.profile(userId);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  async logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('access-token');

    return {
      message: 'success',
    };
  }
}
