# Learning Prisma

## Initialization

1. Initialize a TypeScript project and add the Prisma CLI as a development dependency to it:

    ```sh
    npm init -y
    npm install prisma typescript ts-node @types/node --save-dev
    ```

2. Next, initialize TypeScript:x

    `npx tsc --init`

3. Next, set up your Prisma ORM project by creating your Prisma schema file with the following command:

    `npx prisma init`

4. Add your database url to `.env`

    `postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=SCHEMA`

    Here's a short explanation of each component:

    > USER: The name of your database user
    >
    >PASSWORD: The password for your database user
    >
    >HOST: The name of your host name (for the local environment, it is localhost)
    >
    >PORT: The port where your database server is running (typically 5432 for PostgreSQL)
    >
    >DATABASE: The name of the database
    >
    >SCHEMA: The name of the schema inside the database

5. Create your model (table) in `schema.prisma`

    ```Prisma
    model User {
        id   Int    @id @default(autoincrement())
        name String
    }
    ```

    To map your data model to the database schema:
    `npx prisma migrate dev --name init`

    Prisma Migrate generates migrations based on changes in the Prisma schema – a human-readable declarative definition of your database schema.

    So every time you make changes to the schema, you've to run the migrate command

6. Install prisma client using

    `npm install @prisma/client`

    The install command invokes prisma generate for you. Now, "prisma generate" is a tool that looks at a file called your "Prisma schema". This file basically outlines the structure of your database, like what tables you have and what data they store.

    So, when "prisma generate" reads this schema, it creates something called "Prisma Client". Think of Prisma Client like a customized tool specifically made for your database. It's like having a special helper that knows exactly how your database works and can interact with it in the best possible way. And it does all this based on the information it gets from your Prisma schema file.

    Whenever you update your Prisma schema, you will have to update your database schema using either `prisma migrate dev` or `prisma db push`. This will keep your database schema in sync with your Prisma schema. The commands will also regenerate Prisma Client.

    Regenerating the client each time using `npx prisma generate`. It goes through all the steps of generating based on whatever provider we want (prisma-client-js - deafult). The prisma generate command reads your Prisma schema and updates the generated Prisma Client library inside node_modules/@prisma/client.

7. Create your `script.ts` file and add the following to access prisma client in node.js

    ```ts
    import { PrismaClient } from '@prisma/client'
    const prisma = new PrismaClient()
    ```

    To log all queries that Prisma Client sends to the database, you can pass a log array

    ```ts
    const prisma = new PrismaClient({ log: ["query"] });
    ```

8. To run scripts automatically using nodemon, add the following scripts to your `package.json`:

    ```json
    "scripts": {
        "dev": "nodemon script.ts"
    },
    ```

    Then run using `npm run dev`

>Note: To fetch all tables in postgres `select * from information_schema.tables`

## Using postgres in Prisma

1. To create a new entry (user)

    ```ts
    const user = await prisma.user.create({
      data: {
        name: "Alice",
      },
    });
    console.log("User is: ", user);
    ```

2. To print all the entries (users)

    ```ts
    const allUsers = await prisma.user.findMany({});
    console.dir(allUsers, { depth: null });
    ```

3. To create nested entries

    ```ts
    const user = await prisma.user.create({
        data: {
            name: "Anushka",
            email: "anushka@test.com",
            age: 22,
            userPreference: {
                create: {
                emailUpdates: true,
                },
            },
        },
    })
    ```

4. Include - By using include, we can specify which nested objects to include in the response i.e we can include the various references like userPreference, posts etc.

    ```ts
    const user = await prisma.user.create({
        data: {
            name: "Anushka",
            email: "anushka@test.com",
            age: 22,
            userPreference: {
            create: {
                emailUpdates: true,
            },
            },
        },
        include: {
            userPreference: true,
        },
    });
    ```

5. Select - By using select, we can specify which fields to include in the response.

    ```ts
    const user = await prisma.user.create({
        data: {
            name: "Anushka",
            email: "anushka@test.com",
            age: 22,
            userPreference: {
            create: {
                emailUpdates: true,
            },
            },
        },
        select: {
            name: true,
            userPreference: {
                select: {
                id: true,
                },
            },
        },
    });
    ```

    Note :- Select and include are mutually exclusive i.e we can't use both of them together

6. To create many entries

    ```ts
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
    ```

    > Note:- You cannot use select clause in createMany.

7. To fetch all users with a particular name by taking one at a time and skipping the first one

    ```ts
    const user = await prisma.user.findMany({
        where: {
            name: "Anushka",
        },
        take: 1,
        skip: 1,
    });

8. To fetch all users with a name "Anushka" but distinct name and age pair and order them in ascending order

    ```ts
    const user = await prisma.user.findMany({
        where: {
            name: "Anushka",
        },
        distinct: ["name", "age"],
        orderBy: {
            age: "asc",
        },
    });

9. To fetch all users with a name other than "Anushka"

    ```ts
    const user = await prisma.user.findMany({
        where: {
            name: { not: "Anushka" },
        },
    });
    ```

10. To fetch all users with a name given in the array

    ```ts
    const user = await prisma.user.findMany({
        where: {
            name: { in: ["Anushka", "Ananya"] },
        },
    });

11. To fetch all users with a name other than that given in the array and age is less than 20

    ```ts
    const user = await prisma.user.findMany({
        where: {
            name: { notIn: ["Anushka", "Ananya"] },
            age: { lt: 20 },
        },
    });
    ```

    >Note:
    >
    >lt -> Less than
    >
    >gt -> Greater than
    >
    >lte -> Less than equal to
    >
    >gte -> Greater than equal to

12. To fetch all users with email containing "@test.com"

    ```ts
    const user = await prisma.user.findMany({
        where: {
            email: { contains: "@test.com" }
        },
    });
    ```

13. To fetch all users with email ending with "@test.com"

    ```ts
    const user = await prisma.user.findMany({
        where: {
            email: { endsWith: "@test.com" }
        },
    });

14. To fetch all users with email starting with "anushka"

    ```ts
    const user = await prisma.user.findMany({
        where: {
            email: { startsWith: "anushka" }
        },
    });

15. To combine two queries with AND

    ```ts
    const user = await prisma.user.findMany({
        where: {
            AND: [{ email: { startsWith: "anushka" } }, { email: { endsWith: "@test.com" } }],
        },
    });
    ```

16. To combine two queries with OR

    ```ts
    const user = await prisma.user.findMany({
        where: {
            OR: [{ email: { startsWith: "anushka" } }, { age: { gt: 20 } }],
        },
    });
    ```

17. To combine two queries with NOT

    ```ts
    const user = await prisma.user.findMany({
        where: {
            NOT: [{ email: { startsWith: "ananya" } }],
        },
    });
    ```

18. To find the first user with the name "Ananya"

    ```ts
    const user = await prisma.user.findFirst({
        where: {
            name: "Ananya",
        },
    });
    ```

19. To find a single record from te database with a unique attribute (email) or a combination of attributes (name_age). Note, the attribute must be defined unique in the schema.

    ```ts
    const user = await prisma.user.findUnique({
        where: {
            age_name: {
                age: 22,
                name: "Anushka",
            },
        },
    });
    ```

20. To query on relationships (one to one)

    ```ts
    const user = await prisma.user.findMany({
        where: {
            userPreference: {
                emailUpdates: true,
            },
        },
    });
    ```

21. To check if every writtenPost has this query, or some writtenPost has this query or none writtenPost has this query (one to many)

    ```ts
    const user = await prisma.user.findMany({
        where: {
            writtenPosts: {
                every: {
                    title: "Test",
                },
            },
        },
    });
    ```

22. To find a post whose author has age 22

    ```ts
    const post = await prisma.post.findMany({
        where: {
            auhtor: {
                is: {
                    age: 22,
                },
            },
        },
    });
    ```

23. To update a single record

    ```ts
    const user = await prisma.user.update({
        where: {
            email: "anushka@test.com",
        },
        data: {
            age: 18,
        },
    });
    ```

    >Note:
    >
    >1. 'data' is the data that you want to update and 'where' is which record(s) you want to update.
    >2. You can also use select or include in these queries.
    >3. When you are doing a single update, you must be doing it on a single field

24. To update all the records that matches a particular query

    ```ts
    const user = await prisma.user.update({
        where: {
            name: "Anushka",
        },
        data: {
            name: "Anna",
        },
    });
    ```

    > Note: updateMany does not allow you to do select or include.

25. You can increment / decrement the age

    ```ts
    const user = await prisma.user.update({
        where: {
            email: "anushka@test.com",
        },
        data: {
            age: {
                // increment: 1,
                // decrement: 1,
                // multiply: 10,
                divide: 10,
            },
        },
    });
    ```

26. To update the user by creating a userPreference

    ```ts
    const user = await prisma.user.update({
        where: {
            email: "anushka@test.com",
        },
        data: {
            userPreference: {
                create: {
                    emailUpdates: true,
                },
        },
        },
    });
    ```

27. Creating a new userPreference and then updating the user with the newly created userPreference by using connect. Connect is used to connect already existing objects.

    ```tsx
    const preference = await prisma.userPreference.create({
        data: {
            emailUpdates: true,
        },
    });
    // Copy the id of newly created preference
    console.log(preference);

    const user = await prisma.user.update({
        where: {
            email: "anushka@test.com",
        },
        data: {
            userPreference: {
                connect: {
                    // the copied id
                    id: "e8661a74-5356-476a-833f-7ac7b6978090",
                },
            },
        },
    });
    console.log(user)

    // To check if the user has been updated with the new userPreference id
    const user1 = await prisma.user.findFirst({
        where: {
            age: 18,
        },
        include: {
            userPreference: true,
        },
    });
    console.log(user1);
    ```

28. We can also disconnect to remove existing objects.

    ```tsx
    const user = await prisma.user.update({
        where: {
            email: "anushka@test.com",
        },
        data: {
            userPreference: {
                disconnect: true,
            },
        },
    });
    console.log(user);
    ```

29. We can also connect or disconnect using create.

30. To delete a single user

    ```tsx
    const user = await prisma.user.delete({
        where: {
            email: "anushka@test.com",
        },
    });
    console.log(user);
    ```

    > Note: delete only deletes a single user so it must be on a unique field

31. To delete many users with the given query

    ```tsx
    const user = await prisma.user.deleteMany({
        where: {
            age: { gt: 20 },
        },
    });
    ```

32. To delete all entries (users)

    ```ts
    await prisma.user.deleteMany();
    ```
