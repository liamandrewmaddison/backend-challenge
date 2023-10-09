import * as bcrypt from 'bcrypt';
import { Inject } from '@nestjs/common';
import { Args, Field, InputType, Mutation, Resolver } from '@nestjs/graphql';
import { User } from '../user/entity';
import { PrismaService } from '../core/prisma.service';
import { IsEmail } from 'class-validator';

@InputType()
class UserLoginInput {
  @Field((type) => String)
  @IsEmail()
  email: string;

  @Field((type) => String)
  password: string;
}

@Resolver(User)
export class AuthResolver {
  constructor(@Inject(PrismaService) private prismaService: PrismaService) {}

  /**
   * Creates a user in the database
   * @param data UserCreateInput
   * @returns Promise<User>
   */
  @Mutation((returns) => User, { nullable: true })
  async login(@Args('data') data: UserLoginInput): Promise<User> {
    const attemptUserLogin = await this.prismaService.user.findFirst({
      where: { email: data.email },
    });

    if (!attemptUserLogin) {
      return null;
    }

    const isMatch = await bcrypt.compare(data.password, attemptUserLogin.password);

    if (!isMatch) {
      return null;
    }

    return attemptUserLogin;
  }
}
