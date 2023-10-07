import 'reflect-metadata';
import {
  Resolver,
  Query,
  Mutation,
  Args,
  Context,
  InputType,
  Field,
} from '@nestjs/graphql';
import { Inject } from '@nestjs/common';
import { User } from '../user/entity';
import { PrismaService } from '../core/prisma.service';

@InputType()
class UserUniqueInput {
  @Field({ nullable: true })
  id: number;

  @Field({ nullable: true })
  email: string;
}

@InputType()
class UserCreateInput {
  @Field()
  email: string;

  @Field()
  name: string;

  @Field()
  password: string;
}

@Resolver(User)
export class UserResolver {
  constructor(@Inject(PrismaService) private prismaService: PrismaService) {};

  @Mutation((returns) => User)
  async createUser(
    @Args('data') data: UserCreateInput,
    @Context() ctx,
  ): Promise<User> {
    return this.prismaService.user.create({
      data: {
        email: data.email,
        name: data.name,
      },
    });
  };

  @Query((returns) => [User], { nullable: true })
  async listUsers(@Context() ctx) {
    return this.prismaService.user.findMany();
  };
}