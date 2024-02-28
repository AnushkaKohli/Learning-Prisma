// Allows us to access prisma client
// Import the PrismaClient constructor from the @prisma/client node module
import { PrismaClient } from "@prisma/client";
// Instantiate PrismaClient
const prisma = new PrismaClient({});

// Define an async function called main to send queries to the database
async function main() {
  // ... you will write your Prisma Client queries here
  await prisma.user.deleteMany();
  const user = await prisma.user.createMany({
    data: [
      {
        name: "Anushka",
        email: "anushka@test.com",
        age: 22,
      },
      {
        name: "Ananya",
        email: "ananya@test.com",
        age: 17,
      },
    ],
  });
  console.log(user);
}

// Call the main function
main()
  .then(async () => {
    // Close the database connections when the script terminates
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
