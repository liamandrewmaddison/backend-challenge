import { Module } from '@nestjs/common';
import { PrismaService } from 'src/core/prisma.service';

@Module({
  providers: [PrismaService],
})
export class PrismaModule {}
