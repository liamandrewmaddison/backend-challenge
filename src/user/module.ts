import { Module } from '@nestjs/common';
import { UserResolver } from './resolver';
import { PrismaModule } from 'src/core/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [UserResolver],
  exports: [UserResolver],
})
export class UserModule {}
