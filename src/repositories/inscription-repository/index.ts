import { prisma } from "@/config";

async function findInscriptionByUserIdAndActivityId(userId: number, activityId: number) {
  return prisma.inscription.findFirst({
    where: {
      userId,
      activityId,
    },
  });
}

async function findAllUserInscriptions(userId: number) {
  return prisma.inscription.findMany({
    where: { userId: userId },
    select: {
      Activity: {
        select: {
          id: true,
          startHour: true,
          endHour: true,
          dayId: true,
          Day: true,
          Location: true,
        },
      },
    },
  });
}

async function createInscription(userId: number, activityId: number) {
  return prisma.inscription.create({
    data: {
      userId,
      activityId,
    },
  });
}

const inscriptionRepository = {
  findInscriptionByUserIdAndActivityId,
  findAllUserInscriptions,
  createInscription,
};

export default inscriptionRepository;
