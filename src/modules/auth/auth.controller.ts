import { Body, Controller, Post, Res, UsePipes } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto, signInSchema } from './dto/sign-in.dto';
import { SignUpDto, signUpSchema } from './dto/sign-up.dto';
import { ZodValidationPipe } from 'src/utils/zod-validation.pipe';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @UsePipes(new ZodValidationPipe(signInSchema))
  async signIn(
    @Body() data: SignInDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const { access_token, email, name, userId } =
      await this.authService.signIn(data);

    response.cookie('access-token', access_token, { httpOnly: true });

    return {
      userId,
      email,
      name,
    };
  }

  @Post('register')
  @UsePipes(new ZodValidationPipe(signUpSchema))
  async signUp(@Body() data: SignUpDto) {
    return await this.authService.signUp(data);
  }
}
