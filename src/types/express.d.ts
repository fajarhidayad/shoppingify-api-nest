import { JwtPayload } from 'src/modules/auth/interfaces/payload.interface';

declare global {
  namespace Express {
    interface Request {
      user: JwtPayload;
    }
  }
}
