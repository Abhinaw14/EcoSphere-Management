"use strict";
// ============================================================
// EcoSphere — Database Seed
// Seeds initial data (admin user, departments, categories)
// ============================================================
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('🌱 Seeding database...\n');
    // ---- Create Admin User ----
    const adminPassword = await bcryptjs_1.default.hash('Admin@123', 12);
    const admin = await prisma.user.upsert({
        where: { email: 'admin@ecosphere.com' },
        update: {},
        create: {
            email: 'admin@ecosphere.com',
            password: adminPassword,
            firstName: 'System',
            lastName: 'Admin',
            role: client_1.Role.ADMIN,
            isActive: true,
            xpPoints: 0,
        },
    });
    console.log(`✅ Admin user created: ${admin.email}`);
    // ---- Create Departments ----
    const departments = [
        { name: 'Engineering', code: 'ENG' },
        { name: 'Human Resources', code: 'HR' },
        { name: 'Finance', code: 'FIN' },
        { name: 'Marketing', code: 'MKT' },
        { name: 'Operations', code: 'OPS' },
        { name: 'Legal & Compliance', code: 'LGL' },
        { name: 'Research & Development', code: 'RND' },
        { name: 'Sustainability', code: 'SUS' },
    ];
    for (const dept of departments) {
        await prisma.department.upsert({
            where: { code: dept.code },
            update: {},
            create: {
                name: dept.name,
                code: dept.code,
                status: client_1.Status.ACTIVE,
            },
        });
    }
    console.log(`✅ ${departments.length} departments created`);
    // ---- Create Categories ----
    const categories = [
        { name: 'Community Service', type: client_1.CategoryType.CSR, description: 'Activities focused on serving the community' },
        { name: 'Education & Training', type: client_1.CategoryType.CSR, description: 'Programs supporting education' },
        { name: 'Environmental Conservation', type: client_1.CategoryType.CSR, description: 'Efforts to protect the environment' },
        { name: 'Health & Wellness', type: client_1.CategoryType.CSR, description: 'Programs promoting health and wellness' },
        { name: 'Carbon Reduction', type: client_1.CategoryType.CHALLENGE, description: 'Challenges to reduce carbon footprint' },
        { name: 'Waste Reduction', type: client_1.CategoryType.CHALLENGE, description: 'Challenges to minimize waste' },
        { name: 'Energy Efficiency', type: client_1.CategoryType.CHALLENGE, description: 'Challenges to improve energy usage' },
        { name: 'Water Conservation', type: client_1.CategoryType.CHALLENGE, description: 'Challenges to conserve water resources' },
    ];
    for (const cat of categories) {
        const existing = await prisma.category.findFirst({
            where: { name: cat.name, type: cat.type },
        });
        if (!existing) {
            await prisma.category.create({ data: cat });
        }
    }
    console.log(`✅ ${categories.length} categories created`);
    // ---- Create Manager & Employee Users ----
    const managerPassword = await bcryptjs_1.default.hash('Manager@123', 12);
    const employeePassword = await bcryptjs_1.default.hash('Employee@123', 12);
    const engDept = await prisma.department.findUnique({ where: { code: 'ENG' } });
    await prisma.user.upsert({
        where: { email: 'manager@ecosphere.com' },
        update: {},
        create: {
            email: 'manager@ecosphere.com',
            password: managerPassword,
            firstName: 'John',
            lastName: 'Manager',
            role: client_1.Role.MANAGER,
            isActive: true,
            departmentId: engDept?.id,
            xpPoints: 150,
        },
    });
    console.log('✅ Manager user created: manager@ecosphere.com');
    await prisma.user.upsert({
        where: { email: 'employee@ecosphere.com' },
        update: {},
        create: {
            email: 'employee@ecosphere.com',
            password: employeePassword,
            firstName: 'Jane',
            lastName: 'Employee',
            role: client_1.Role.EMPLOYEE,
            isActive: true,
            departmentId: engDept?.id,
            xpPoints: 50,
        },
    });
    console.log('✅ Employee user created: employee@ecosphere.com');
    console.log('\n🎉 Database seeding completed!\n');
    console.log('Test accounts:');
    console.log('  Admin:    admin@ecosphere.com    / Admin@123');
    console.log('  Manager:  manager@ecosphere.com  / Manager@123');
    console.log('  Employee: employee@ecosphere.com / Employee@123');
}
main()
    .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map