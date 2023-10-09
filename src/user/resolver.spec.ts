import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../core/prisma.service';
import { UserResolver } from './resolver';
import { User } from './entity';
import { HttpException } from '@nestjs/common';

const makeUser = (attributes) => {
  return {
    id: 1,
    name: 'Mocked User',
    email: 'mocked@email.com',
    createdAt: new Date(),
    updatedAt: new Date(),
    ...attributes,
  };
};
const PrismaServiceMock = {
  user: {
    findFirst: jest
      .fn()
      .mockImplementation(
        ({ where: { id } }): Promise<User> => Promise.resolve(makeUser(id)),
      ),
    findUnique: jest
      .fn()
      .mockImplementation(
        ({ where: { id } }): Promise<User> => Promise.resolve(makeUser(id)),
      ),
    create: jest
      .fn()
      .mockImplementation(
        ({ data: { email, name } }): Promise<User> =>
          Promise.resolve(makeUser({ email, name })),
      ),
    update: jest
      .fn()
      .mockImplementation(
        ({ data: { email, name } }): Promise<User> =>
          Promise.resolve(makeUser({ email, name })),
      ),
    findMany: jest
      .fn()
      .mockImplementation(
        (): Promise<User[]> =>
          Promise.resolve([
            makeUser({ id: 1 }),
            makeUser({ id: 2 }),
            makeUser({ id: 3 }),
            makeUser({ id: 4 }),
            makeUser({ id: 5 }),
          ]),
      ),
  },
};

const createResolverMock = async (prismaServiceMock) => {
  const module: TestingModule = await Test.createTestingModule({
    providers: [
      UserResolver,
      { provide: PrismaService, useValue: prismaServiceMock },
    ],
  }).compile();

  return module.get<UserResolver>(UserResolver);
};

describe('UsersResolver', () => {
  let resolver: UserResolver;

  beforeEach(async () => {
    resolver = await createResolverMock(PrismaServiceMock);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  it('createUser: should create a user', async () => {
    /**
     * Making sure our prisma service mock returns no user on findFirst
     * so the method doesn't throw the exception within the body of createUser
     */
    const prismaServiceMock = {
      user: {
        ...PrismaServiceMock.user,
        findFirst: jest
          .fn()
          .mockImplementation((): Promise<void> => Promise.resolve()),
      },
    };
    const resolver = await createResolverMock(prismaServiceMock);
    const result = await resolver.createUser({
      email: 'test@test.com',
      password: 'test',
      name: 'test',
    });

    expect(result.email).toEqual('test@test.com');
    expect(result.name).toEqual('test');
  });

  it('createUser: should throw HttpException: Email already exists', async () => {
    await resolver
      .createUser({
        email: 'test@test.com',
        password: 'test',
        name: 'test',
      })
      .catch((e) => {
        expect(e.response).toEqual('Email already exists');
        expect(e.status).toEqual(409);
      });
  });

  it('updateUser: should query a user by its id', async () => {
    const result = await resolver.updateUser(
      { id: 1 },
      {
        email: 'testupdate@test.com',
        name: 'test update',
      },
    );

    expect(result.id).toEqual(1);
    expect(result.email).toEqual('testupdate@test.com');
    expect(result.name).toEqual('test update');
  });

  it('getUser: should query a user by its id', async () => {
    const result = await resolver.getUser({ id: 1 });
    expect(result.id).toEqual(1);
  });

  it('listUsers: should query page 0 of all users', async () => {
    await resolver.listUsers({ page: 0 });

    expect(PrismaServiceMock.user.findMany).toHaveBeenCalledWith({
      skip: 0,
      take: 5,
      orderBy: [],
    });
  });

  it('listUsers: should query page 1 of all users', async () => {
    await resolver.listUsers({ page: 1 });

    expect(PrismaServiceMock.user.findMany.mock.calls[1]).toMatchObject([
      {
        skip: 5,
        take: 5,
        orderBy: [],
      },
    ]);
  });

  it('listUsers: should query page 0 of all users and order by user id', async () => {
    await resolver.listUsers({ page: 0 }, null, { id: 'asc' });

    expect(
      PrismaServiceMock.user.findMany.mock.calls[2][0].orderBy[0],
    ).toMatchObject({ id: 'asc' });
  });

  it('listUsers: should filter by name OR email', async () => {
    await resolver.listUsers(
      { page: 0 },
      { email: 'test@test.com', name: 'test' },
      {},
    );

    expect(
      PrismaServiceMock.user.findMany.mock.calls[3][0].where,
    ).toMatchObject({
      OR: [
        { email: { contains: 'test@test.com', mode: 'insensitive' } },
        { name: { contains: 'test', mode: 'insensitive' } },
      ],
    });
  });

  it('listUsers: should filter by email', async () => {
    await resolver.listUsers({ page: 0 }, { email: 'test@test.com' }, {});

    expect(
      PrismaServiceMock.user.findMany.mock.calls[4][0].where,
    ).toMatchObject({
      AND: [
        { email: { contains: 'test@test.com', mode: 'insensitive' } },
        { name: { contains: '', mode: 'insensitive' } },
      ],
    });
  });
});
