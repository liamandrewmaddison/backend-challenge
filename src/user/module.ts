import { Module } from '@nestjs/common';
import { UserResolver } from './resolver';
import { PrismaService } from 'src/core/prisma.service';

@Module({
  providers: [UserResolver, PrismaService],
  exports: [UserResolver],
})
export class UserModule {}
