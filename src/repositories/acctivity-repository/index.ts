import { prisma } from "@/config";

async function findActivityLocationAndInscriptions(activityId: number) {
  return prisma.activity.findUnique({
    where: { id: activityId },
    select: {
      id: true,
      dayId: true,
      startHour: true,
      endHour: true,
      Location: true,
      _count: { select: { Inscription: true } },
    },
  });
}

async function findActivityByDays(dayId: number) {
  return prisma.activity.findMany({
    where: { dayId },
    select: {
      id: true,
      localId: true,
      startHour: true,
      endHour: true,
      duration: true,
      Inscription: true,
    },
  });
}

const activityRepository = {
  findActivityLocationAndInscriptions,
  findActivityByDays,
};

export default activityRepository;
