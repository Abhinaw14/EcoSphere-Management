import prisma from './config/database';
import bcrypt from 'bcryptjs';

async function main() {
  console.log('Seeding Database...');

  // 1. Clear existing data (optional, but good for resetting)
  console.log('Cleaning up existing data...');
  await prisma.$transaction([
    prisma.reportSnapshot.deleteMany(),
    prisma.notification.deleteMany(),
    prisma.rewardRedemption.deleteMany(),
    prisma.reward.deleteMany(),
    prisma.userBadge.deleteMany(),
    prisma.badge.deleteMany(),
    prisma.challenge.deleteMany(),
    prisma.governanceAudit.deleteMany(),
    prisma.complianceRecord.deleteMany(),
    prisma.policy.deleteMany(),
    prisma.socialParticipation.deleteMany(),
    prisma.socialInitiative.deleteMany(),
    prisma.carbonTransaction.deleteMany(),
    prisma.environmentalGoal.deleteMany(),
    prisma.productProfile.deleteMany(),
    prisma.emissionFactor.deleteMany(),
    prisma.environmentalMetric.deleteMany(),
    prisma.category.deleteMany(),
    prisma.refreshToken.deleteMany(),
    prisma.user.deleteMany(),
    prisma.department.deleteMany(),
  ]);

  // 2. Foundation: Departments
  console.log('Creating Departments...');
  const engineering = await prisma.department.create({
    data: { name: 'Engineering', code: 'ENG' },
  });
  const sales = await prisma.department.create({
    data: { name: 'Sales & Marketing', code: 'SMK' },
  });
  const hr = await prisma.department.create({
    data: { name: 'Human Resources', code: 'HR' },
  });

  // 3. Foundation: Users
  console.log('Creating Users...');
  const defaultPassword = await bcrypt.hash('password123', 10);
  
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@ecosphere.com',
      password: defaultPassword,
      firstName: 'Admin',
      lastName: 'User',
      role: 'ADMIN',
      departmentId: engineering.id,
      xpPoints: 8500,
    },
  });

  const emp1 = await prisma.user.create({
    data: {
      email: 'jane@ecosphere.com',
      password: defaultPassword,
      firstName: 'Jane',
      lastName: 'Doe',
      role: 'EMPLOYEE',
      departmentId: sales.id,
      xpPoints: 3400,
    },
  });

  const emp2 = await prisma.user.create({
    data: {
      email: 'john@ecosphere.com',
      password: defaultPassword,
      firstName: 'John',
      lastName: 'Smith',
      role: 'EMPLOYEE',
      departmentId: hr.id,
      xpPoints: 2100,
    },
  });

  // 4. Categories
  const catCsr = await prisma.category.create({
    data: { name: 'Community Volunteering', type: 'CSR' },
  });
  const catChallenge = await prisma.category.create({
    data: { name: 'Energy Savings', type: 'CHALLENGE' },
  });

  // 5. Environmental
  console.log('Creating Environmental Data...');
  
  // Emission Factors
  await prisma.emissionFactor.createMany({
    data: [
      { source: 'Grid Electricity', factor: 0.45, unit: 'kg CO2e / kWh', gasType: 'CO2' },
      { source: 'Diesel Fuel', factor: 2.68, unit: 'kg CO2e / L', gasType: 'CO2' },
    ],
  });

  // Product Profiles
  await prisma.productProfile.createMany({
    data: [
      { name: 'EcoPack Biodegradable Box', category: 'Packaging', carbonFootprint: 1.2, waterUsage: 5.5 },
      { name: 'Solar Lamp v2', category: 'Electronics', carbonFootprint: 15.0, waterUsage: 25.0 },
    ],
  });

  // Environmental Goals
  await prisma.environmentalGoal.create({
    data: {
      title: 'Reduce Office Energy by 20%',
      targetValue: 8000,
      currentValue: 2500,
      unit: 'kWh',
      deadline: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
      departmentId: engineering.id,
      status: 'IN_PROGRESS',
    },
  });

  // Carbon Transactions
  await prisma.carbonTransaction.create({
    data: {
      type: 'OFFSET',
      amount: 500,
      date: new Date(),
      description: 'Purchased offset credits from Rainforest Trust',
      departmentId: engineering.id,
    },
  });

  // Metrics
  const metricTypes = ['CARBON', 'ENERGY', 'WATER', 'WASTE'] as const;
  for (const type of metricTypes) {
    for (let month = 0; month < 6; month++) {
      const date = new Date();
      date.setMonth(date.getMonth() - month);
      
      await prisma.environmentalMetric.create({
        data: {
          type,
          value: Math.floor(Math.random() * 1000) + 500,
          unit: type === 'WATER' ? 'L' : type === 'ENERGY' ? 'kWh' : 'kg',
          recordedAt: date,
          departmentId: engineering.id,
          userId: adminUser.id,
        },
      });
    }
  }

  // 6. Social
  console.log('Creating Social Data...');
  const initiative = await prisma.socialInitiative.create({
    data: {
      title: 'Local Beach Cleanup',
      description: 'Annual corporate beach cleanup drive.',
      status: 'IN_PROGRESS',
      departmentId: hr.id,
      participantsCount: 2,
      hoursLogged: 10,
    },
  });

  await prisma.socialParticipation.createMany({
    data: [
      { userId: emp1.id, initiativeId: initiative.id, hoursLogged: 5 },
      { userId: emp2.id, initiativeId: initiative.id, hoursLogged: 5 },
    ],
  });

  // 7. Governance
  console.log('Creating Governance Data...');
  const policy = await prisma.policy.create({
    data: {
      title: 'Data Privacy Standards 2026',
      version: '1.2',
      status: 'ACTIVE',
    },
  });

  await prisma.complianceRecord.create({
    data: {
      policyId: policy.id,
      departmentId: engineering.id,
      status: 'COMPLIANT',
      notes: 'Passed ISO 27001 audit.',
    },
  });

  await prisma.governanceAudit.create({
    data: {
      title: 'Q3 Security Audit',
      status: 'PASSED',
      auditorId: adminUser.id,
      departmentId: engineering.id,
      scheduledDate: new Date(),
      completedDate: new Date(),
    },
  });

  // 8. Gamification
  console.log('Creating Gamification Data...');
  
  // Badges
  const ecoWarrior = await prisma.badge.create({
    data: { name: 'Eco Warrior', description: 'Log 50 hours of volunteering', icon: 'Medal', xpThreshold: 5000 },
  });
  const recycler = await prisma.badge.create({
    data: { name: 'Master Recycler', description: 'Perfect waste sorting', icon: 'Leaf', xpThreshold: 2000 },
  });

  await prisma.userBadge.createMany({
    data: [
      { userId: adminUser.id, badgeId: ecoWarrior.id },
      { userId: emp1.id, badgeId: recycler.id },
    ],
  });

  // Challenges
  await prisma.challenge.create({
    data: {
      title: 'Bike to Work Month',
      xpReward: 500,
      startDate: new Date(),
      endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
      status: 'ACTIVE',
    },
  });

  // Rewards
  const swag = await prisma.reward.create({
    data: { name: 'EcoSphere Hoodie', xpCost: 2000, stock: 50 },
  });
  await prisma.rewardRedemption.create({
    data: { userId: adminUser.id, rewardId: swag.id },
  });

  console.log('Database Seeding Complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
