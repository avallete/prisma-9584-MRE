import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient();
const prisma2 = new PrismaClient();

function makeid(length: number) {
  var result           = '';
  var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for ( var i = 0; i < length; i++ ) {
    result += characters.charAt(Math.floor(Math.random() * 
charactersLength));
 }
 return result;
}


// Do some stuff in a transaction with client 1
async function transactionalDoStuff() {
  await prisma.$transaction([
    prisma.user.create({data: {
      email: `${makeid(10)}@gmail.com`,
    }}),
    // This gonna take a full exclusive lock on the task
    prisma.user.deleteMany({}),
    prisma.user.create({data: {
      email: `${makeid(10)}@gmail.com`,
    }}),
  ]);
}

// Do some stuff in transaction with client 2
async function transactional2DoStuff() {
  await prisma2.$transaction([
    prisma2.user.create({data: {
      email: `${makeid(10)}@gmail.com`,
    }}),
    // This gonna take a full exclusive lock on the task
    prisma.user.deleteMany({}),
    prisma2.user.create({data: {
      email: `${makeid(10)}@gmail.com`,
    }}),
  ]);
}

// A `main` function so that you can use async/await
async function main() {
  let i = 0;
  await prisma.$executeRawUnsafe(`CREATE TABLE "user" ("id" serial NOT NULL,  "email" text NOT NULL, "name" text, PRIMARY KEY ("id"), UNIQUE("email"))`);

  // We set a low timeout for the transactions, this should allow prisma to close the session, re-run another one
  await prisma.$executeRawUnsafe(`SET SESSION idle_in_transaction_session_timeout = '10s'`);
  await prisma2.$executeRawUnsafe(`SET SESSION idle_in_transaction_session_timeout = '10s'`);
  while (true) {
    console.log(`iteration number: ${i}`);
    try {
      // We volontary create lock which will conflict between each others
      await Promise.all([
        transactionalDoStuff(),
        transactionalDoStuff(),
        transactional2DoStuff(),
        transactional2DoStuff(),
      ]);
    } catch (e) {
      console.log("an error: ", e);
    }
    i += 1;
  }
}

main()
  .catch(e => {
    throw e
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
