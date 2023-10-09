import { faker } from '@faker-js/faker';
import { OmitType } from '@nestjs/graphql';
import { PrismaClient } from '@prisma/client';
import { User } from '../src/user/entity';

const prisma = new PrismaClient();

class CreateUser extends OmitType(User, ['id']) {}

function createRandomUser(): CreateUser {
  return {
    name: faker.internet.displayName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
    createdAt: faker.date.past(),
    updatedAt: faker.date.future(),
  };
}

async function main() {
  const count = 500;
  const users: CreateUser[] = faker.helpers.multiple(createRandomUser, {
    count,
  });

  console.log({ users });

  await prisma.user.createMany({ data: users });
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
