import { Body, Controller, Post, UsePipes } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto, signInSchema } from './dto/sign-in.dto';
import { SignUpDto, signUpSchema } from './dto/sign-up.dto';
import { ZodValidationPipe } from 'src/utils/zod-validation.pipe';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @UsePipes(new ZodValidationPipe(signInSchema))
  async signIn(@Body() data: SignInDto) {
    return await this.authService.signIn(data);
  }

  @Post('register')
  @UsePipes(new ZodValidationPipe(signUpSchema))
  async signUp(@Body() data: SignUpDto) {
    return await this.authService.signUp(data);
  }
}
