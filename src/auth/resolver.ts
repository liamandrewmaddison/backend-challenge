import * as bcrypt from 'bcrypt';
import { Args, Field, InputType, Mutation, Resolver } from '@nestjs/graphql';
import { Inject, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../core/prisma.service';
import { IsEmail } from 'class-validator';
import { JwtService } from '@nestjs/jwt';
import { AuthUser } from './entity';

@InputType()
class UserLoginInput {
  @Field((type) => String)
  @IsEmail()
  email: string;

  @Field((type) => String)
  password: string;
}

type UserLoggedInResponse = {
  token: string;
};

@Resolver(AuthUser)
export class AuthResolver {
  constructor(
    @Inject(PrismaService) private prismaService: PrismaService,
    @Inject(JwtService) private jwtService: JwtService,
  ) {}

  /**
   * Creates a user in the database
   * @param data UserCreateInput
   * @returns Promise<User>
   */
  @Mutation((returns) => AuthUser, { nullable: true })
  async login(
    @Args('data') data: UserLoginInput,
  ): Promise<UserLoggedInResponse> {
    const attemptUserLogin = await this.prismaService.user.findFirst({
      where: { email: data.email },
    });

    if (!attemptUserLogin) {
      throw new UnauthorizedException();
    }

    const isMatch = await bcrypt.compare(
      data.password,
      attemptUserLogin.password,
    );

    if (!isMatch) {
      throw new UnauthorizedException();
    }

    const payload = {
      sub: attemptUserLogin.id,
      username: attemptUserLogin.email,
    };
    const token = await this.jwtService.signAsync(payload);

    return {
      ...attemptUserLogin,
      token,
    };
  }
}
