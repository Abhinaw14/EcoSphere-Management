import prisma from './config/database';

async function main() {
  console.log('Seeding XP for the Virtual Forest...');
  
  // Give every user some XP to grow the forest
  await prisma.user.updateMany({
    data: {
      xpPoints: { increment: 1500 }
    }
  });

  const users = await prisma.user.findMany();
  const totalXp = users.reduce((acc, user) => acc + user.xpPoints, 0);
  
  console.log(`Successfully added XP. Total XP across all users: ${totalXp}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
