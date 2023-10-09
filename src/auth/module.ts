import { JwtModule } from '@nestjs/jwt';
import { Module } from '@nestjs/common';
import { AuthResolver } from './resolver';
import { PrismaModule } from '../core/prisma.module';
import { UserModule } from '../user/module';
import { jwtConstants } from './constants';

@Module({
  imports: [
    PrismaModule,
    UserModule,
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '10m' },
    }),
  ],
  providers: [AuthResolver],
})
export class AuthModule {}
