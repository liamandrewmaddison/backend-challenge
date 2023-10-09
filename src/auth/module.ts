import { Module } from '@nestjs/common';
import { AuthResolver } from './resolver';

@Module({
  providers: [AuthResolver],
})
export class AuthModule {}
