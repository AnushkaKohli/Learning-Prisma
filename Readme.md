# Learning Prisma

## Initialisation

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

6. Install prisma client using

    `npm install @prisma/client`

    The install command invokes prisma generate for you. Now, "prisma generate" is a tool that looks at a file called your "Prisma schema". This file basically outlines the structure of your database, like what tables you have and what data they store.

    So, when "prisma generate" reads this schema, it creates something called "Prisma Client". Think of Prisma Client like a customized tool specifically made for your database. It's like having a special helper that knows exactly how your database works and can interact with it in the best possible way. And it does all this based on the information it gets from your Prisma schema file.

    Whenever you update your Prisma schema, you will have to update your database schema using either `prisma migrate dev` or `prisma db push`. This will keep your database schema in sync with your Prisma schema. The commands will also regenerate Prisma Client.

    This can also be done by manually regenerating the client each time using `npx prisma generate`. It goes through all the steps of generating based on whatever provider we want (prisma-client-js - deafult).

7. Create your `script.ts` file and add the following to access prisma client in node.js

    ```ts
    import { PrismaClient } from '@prisma/client'
    const prisma = new PrismaClient()
    ```

8. To run scripts automatically using nodemon, add the following scripts to your `package.json`:

    ```json
    "scripts": {
        "dev": "nodemon script.ts"
    },
    ```

    Then run using `npm run dev`

>Note: To fetch all tables in postgres `select * from information_schema.tables`
