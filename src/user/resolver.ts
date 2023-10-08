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
import { HttpException, Inject } from '@nestjs/common';
import { User } from '../user/entity';
import { PrismaService } from '../core/prisma.service';
import { IsEmail, IsString } from 'class-validator';

@InputType()
class UserCreateInput {
  @Field((type) => String)
  @IsEmail()
  email: string;

  @Field((type) => String)
  @IsString()
  name: string;

  // @Field()
  // password: string;
}

@InputType()
class UserWhereUniqueInput {
  @Field()
  id: number;
}

@InputType()
class UserFilterInput {
  @Field((type) => String, { nullable: true })
  name?: string;

  @Field((type) => String, { nullable: true })
  email?: string;
}

@InputType()
class UserFilterSortOrderInput {
  @Field((type) => String, { nullable: true })
  id?: 'asc' | 'desc';

  @Field((type) => String, { nullable: true })
  createdAt?: 'asc' | 'desc';

  @Field((type) => String, { nullable: true })
  updatedAt?: 'asc' | 'desc';
}

@InputType()
class UserFilterPageInput {
  @Field((type) => Number)
  page: number;
}

@Resolver(User)
export class UserResolver {
  constructor(@Inject(PrismaService) private prismaService: PrismaService) {}

  /**
   * Creates a user in the database
   * @param data UserCreateInput
   * @param ctx @Context()
   * @returns Promise<User>
   */
  @Mutation((returns) => User)
  async createUser(
    @Args('data') data: UserCreateInput,
    @Context() ctx,
  ): Promise<User> {
    const user = await this.prismaService.user.findFirst({
      where: { email: data.email },
    });

    if (user) {
      throw new HttpException('Email already exists', 403);
    }

    return this.prismaService.user.create({
      data: {
        email: data.email,
        name: data.name,
      },
    });
  }

  /**
   * Updates a user when gievn an ID
   * @param where UserWhereUniqueInput
   * @param data UserUpdateInput
   * @param ctx @Context()
   * @returns Promis<User>
   */
  @Mutation((returns) => User)
  async updateUser(
    @Args('where') where: UserWhereUniqueInput,
    @Args('data') data: UserCreateInput,
    @Context() ctx,
  ): Promise<User> {
    return this.prismaService.user.update({
      where: {
        id: where.id,
      },
      data: {
        email: data.email,
        name: data.name,
      },
    });
  }

  /**
   * Returns a user based on ID
   * @param where UserWhereUniqueInput
   * @param ctx @Context()
   * @returns Promise<User>
   */
  @Query((returns) => User, { nullable: true })
  async getUser(
    @Args('where') where: UserWhereUniqueInput,
    @Context() ctx,
  ): Promise<User> {
    return this.prismaService.user.findUnique({
      where: { id: where.id },
    });
  }

  /**
   * Returns a list of paginated users
   * @param filter UserFilterInput
   * @param orderBy UserOrderInput
   * @returns Promise<User[]>
   */
  @Query((returns) => [User], { nullable: true })
  async listUsers(
    @Args('page') page: UserFilterPageInput,
    @Args('filter', { nullable: true }) filter?: UserFilterInput,
    @Args('orderBy', { nullable: true }) orderBy?: UserFilterSortOrderInput,
  ): Promise<User[]> {
    const operator = (filter?.email && filter?.name) ? "OR" : "AND";
    const orderByUserRequest = [
      (orderBy?.id ? { id: orderBy?.id } : null),
      (orderBy?.createdAt ? { createdAt: orderBy?.createdAt } : null),
      (orderBy?.updatedAt ? { updatedAt: orderBy?.updatedAt } : null),
    ].filter(item => item !== null);
    const take = 5;
    const query = {
      take,
      skip: page?.page * take || 0,
      ...( filter ?  {
        where: {
          [operator]: [
            { email: { contains: filter?.email || '', mode: 'insensitive' } },
            { name: { contains: filter?.name || '', mode: 'insensitive' } },
          ],
        },
      } : null ),
      orderBy: [
        ...orderByUserRequest
      ]
    };

    return this.prismaService.user.findMany(query);
  }
}
