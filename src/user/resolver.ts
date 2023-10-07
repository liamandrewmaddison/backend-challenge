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
class UserCreateInput {
  @Field({ nullable: true })
  email: string;

  @Field({ nullable: true })
  name: string;

  // @Field()
  // password: string;
}

@InputType()
class UserWhereUniqueInput {
  @Field()
  id: number;
}

@Resolver(User)
export class UserResolver {
  constructor(@Inject(PrismaService) private prismaService: PrismaService) {}

  /**
   * Creates a user in the database
   * @param data UserCreateInput
   * @param ctx @Context()
   * @returns User
   */
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
  }

  /**
   * Updates a user when gievn an ID
   * @param data UserUpdateInput
   * @param ctx @Context()
   * @returns User
   */
  @Mutation((returns) => User)
  async updateUser(
    @Args('where') where: UserWhereUniqueInput,
    @Args('data') data: UserCreateInput,
    @Context() ctx,
  ): Promise<User> {
    return this.prismaService.user.update({
      data: {
        email: data.email,
        name: data.name,
      },
      where: {
        id: where.id,
      },
    });
  }

  /**
   * Returns a list of paginated users
   * @param ctx @Context()
   * @returns [User]
   */
  @Query((returns) => [User], { nullable: true })
  async listUsers(@Context() ctx) {
    return this.prismaService.user.findMany({
      take: 50,
    });
  }
}
