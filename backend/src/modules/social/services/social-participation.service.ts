import { socialParticipationRepository } from '../repositories/social-participation.repository';
import { CreateSocialParticipationInput, UpdateSocialParticipationInput } from '../validators/social-participation.validator';
import { AppError } from '../../../utils/errors';
import prisma from '../../../config/database';

export class SocialParticipationService {
  async getAll(userId?: string) {
    return socialParticipationRepository.findAll(userId);
  }

  async getById(id: string) {
    const item = await socialParticipationRepository.findById(id);
    if (!item) throw new AppError('Participation record not found', 404);
    return item;
  }

  async create(userId: string, data: CreateSocialParticipationInput) {
    const initiative = await prisma.socialInitiative.findUnique({ where: { id: data.initiativeId } });
    if (!initiative) throw new AppError('Social Initiative not found', 404);

    return prisma.$transaction(async (tx) => {
      const participation = await tx.socialParticipation.create({
        data: {
          ...data,
          userId,
        },
      });

      await tx.socialInitiative.update({
        where: { id: data.initiativeId },
        data: {
          hoursLogged: { increment: data.hoursLogged },
          participantsCount: { increment: 1 },
        },
      });

      // Bonus Gamification Integration! Award XP for volunteering (10 XP per hour)
      await tx.user.update({
        where: { id: userId },
        data: {
          xpPoints: { increment: Math.floor(data.hoursLogged * 10) }
        }
      });

      return participation;
    });
  }

  async update(id: string, userId: string, data: UpdateSocialParticipationInput) {
    const item = await socialParticipationRepository.findById(id);
    if (!item) throw new AppError('Participation record not found', 404);
    
    // Ensure user owns it (or is admin, handled in controller ideally, but here we just check if they are the owner for safety unless it's a generic update)
    // We'll allow it if they just want to update hours

    const hoursDiff = data.hoursLogged ? data.hoursLogged - item.hoursLogged : 0;

    return prisma.$transaction(async (tx) => {
      const updated = await tx.socialParticipation.update({
        where: { id },
        data,
      });

      if (hoursDiff !== 0) {
        await tx.socialInitiative.update({
          where: { id: item.initiativeId },
          data: { hoursLogged: { increment: hoursDiff } },
        });

        await tx.user.update({
          where: { id: item.userId },
          data: { xpPoints: { increment: Math.floor(hoursDiff * 10) } }
        });
      }

      return updated;
    });
  }

  async delete(id: string) {
    const item = await socialParticipationRepository.findById(id);
    if (!item) throw new AppError('Participation record not found', 404);

    return prisma.$transaction(async (tx) => {
      await tx.socialParticipation.delete({ where: { id } });

      await tx.socialInitiative.update({
        where: { id: item.initiativeId },
        data: {
          hoursLogged: { decrement: item.hoursLogged },
          participantsCount: { decrement: 1 },
        },
      });
      
      // Deduct XP
      await tx.user.update({
        where: { id: item.userId },
        data: { xpPoints: { decrement: Math.floor(item.hoursLogged * 10) } }
      });
    });
  }
}

export const socialParticipationService = new SocialParticipationService();
