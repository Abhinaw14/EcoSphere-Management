import prisma from '../../../config/database';

export class ReportService {
  async getDashboardAnalytics() {
    // 1. Environmental
    const txs = await prisma.carbonTransaction.findMany();
    const totalEmissions = txs.filter(t => t.type === 'EMISSION').reduce((acc, t) => acc + t.amount, 0);
    const totalOffsets = txs.filter(t => t.type === 'OFFSET').reduce((acc, t) => acc + t.amount, 0);
    const totalCredits = txs.filter(t => t.type === 'CREDIT').reduce((acc, t) => acc + t.amount, 0);

    // 2. Social
    const participations = await prisma.socialParticipation.findMany();
    const totalVolunteerHours = participations.reduce((acc, p) => acc + p.hoursLogged, 0);
    const activeInitiativesCount = await prisma.socialInitiative.count({ where: { status: 'IN_PROGRESS' } });

    // 3. Governance
    const compliances = await prisma.complianceRecord.findMany();
    const compliantCount = compliances.filter(c => c.status === 'COMPLIANT').length;
    const complianceRate = compliances.length > 0 ? (compliantCount / compliances.length) * 100 : 100;
    
    const pendingAuditsCount = await prisma.governanceAudit.count({ where: { status: 'PENDING' } });

    // 4. Gamification/Engagement
    const topUsers = await prisma.user.findMany({
      orderBy: { xpPoints: 'desc' },
      take: 5,
      select: { id: true, firstName: true, lastName: true, xpPoints: true, avatarUrl: true },
    });

    return {
      environmental: {
        totalEmissions,
        totalOffsets,
        totalCredits,
        netCarbon: totalEmissions - totalOffsets - totalCredits,
      },
      social: {
        totalVolunteerHours,
        activeInitiativesCount,
      },
      governance: {
        complianceRate,
        pendingAuditsCount,
      },
      engagement: {
        topUsers,
      }
    };
  }
}

export const reportService = new ReportService();
