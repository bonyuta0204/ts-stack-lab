import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";
import { hash } from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  console.log("Start seeding...");

  // Create 100 users
  const users = [];
  for (let i = 0; i < 100; i++) {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const email = faker.internet.email({ firstName, lastName });
    const password = await hash("password123", 10); // Using a common password for all test users

    const user = await prisma.user.create({
      data: {
        name: `${firstName} ${lastName}`,
        email,
        password,
        profile: {
          create: {
            bio: faker.person.bio(),
          },
        },
        posts: {
          create: Array.from(
            { length: faker.number.int({ min: 0, max: 5 }) },
            () => ({
              title: faker.lorem.sentence(),
              content: faker.lorem.paragraphs(),
              published: faker.datatype.boolean(),
            }),
          ),
        },
      },
    });
    users.push(user);
    console.log(`Created user ${i + 1}/100: ${user.email}`);
  }

  console.log("Seeding finished");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect().catch((e) => {
      console.error(e);
    });
  });
