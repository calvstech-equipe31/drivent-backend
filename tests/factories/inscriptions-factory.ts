import faker from "@faker-js/faker";
import { prisma } from "@/config";

export async function createFullActivity() {
  const otherUser = await prisma.user.create({
    data: {
      email: faker.name.firstName(),
      password: faker.name.firstName(),
    },
  });

  const localtion = await prisma.location.create({
    data: {
      name: faker.company.companyName(),
      capacity: 1,
      createdAt: faker.date.recent().toISOString(),
      updatedAt: faker.date.recent().toISOString(),
    },
  });

  const day = await prisma.day.create({
    data: {
      name: faker.date.weekday(),
      date: faker.date.recent().toISOString(),
      createdAt: faker.date.recent().toISOString(),
      updatedAt: faker.date.recent().toISOString(),
    },
  });

  const activity = await prisma.activity.create({
    data: {
      dayId: day.id,
      localId: localtion.id,
      name: faker.name.firstName(),
      startHour: faker.animal.bear(),
      endHour: faker.animal.bear(),
      duration: faker.datatype.number(),
      createdAt: faker.date.recent().toISOString(),
      updatedAt: faker.date.recent().toISOString(),
    },
  });

  const inscription = await prisma.inscription.create({
    data: {
      userId: otherUser.id,
      activityId: activity.id,
    },
  });

  return activity;
}

export async function createConflitActivity(userId: number) {
  const localtion = await prisma.location.create({
    data: {
      name: faker.company.companyName(),
      capacity: faker.datatype.number(),
      createdAt: faker.date.recent().toISOString(),
      updatedAt: faker.date.recent().toISOString(),
    },
  });

  const day = await prisma.day.create({
    data: {
      name: faker.date.weekday(),
      date: faker.date.recent().toISOString(),
      createdAt: faker.date.recent().toISOString(),
      updatedAt: faker.date.recent().toISOString(),
    },
  });

  const activity = await prisma.activity.create({
    data: {
      dayId: day.id,
      localId: localtion.id,
      name: faker.name.firstName(),
      startHour: faker.animal.bear(),
      endHour: faker.animal.bear(),
      duration: faker.datatype.number(),
      createdAt: faker.date.recent().toISOString(),
      updatedAt: faker.date.recent().toISOString(),
    },
  });

  const inscription = await prisma.inscription.create({
    data: {
      userId: userId,
      activityId: activity.id,
    },
  });

  return activity;
}

export async function createConflictHour(userId: number) {
  const localtion = await prisma.location.create({
    data: {
      name: faker.company.companyName(),
      capacity: faker.datatype.number(),
      createdAt: faker.date.recent().toISOString(),
      updatedAt: faker.date.recent().toISOString(),
    },
  });

  const conflictLocaltion = await prisma.location.create({
    data: {
      name: faker.company.companyName(),
      capacity: faker.datatype.number(),
      createdAt: faker.date.recent().toISOString(),
      updatedAt: faker.date.recent().toISOString(),
    },
  });

  const day = await prisma.day.create({
    data: {
      name: faker.date.weekday(),
      date: faker.date.recent().toISOString(),
      createdAt: faker.date.recent().toISOString(),
      updatedAt: faker.date.recent().toISOString(),
    },
  });

  const activity = await prisma.activity.create({
    data: {
      dayId: day.id,
      localId: localtion.id,
      name: faker.name.firstName(),
      startHour: "12:00",
      endHour: "14:00",
      duration: faker.datatype.number(),
      createdAt: faker.date.recent().toISOString(),
      updatedAt: faker.date.recent().toISOString(),
    },
  });

  const conflictActivity = await prisma.activity.create({
    data: {
      dayId: day.id,
      localId: conflictLocaltion.id,
      name: faker.name.firstName(),
      startHour: "13:00",
      endHour: "15:00",
      duration: faker.datatype.number(),
      createdAt: faker.date.recent().toISOString(),
      updatedAt: faker.date.recent().toISOString(),
    },
  });

  const inscription = await prisma.inscription.create({
    data: {
      userId: userId,
      activityId: conflictActivity.id,
    },
  });

  return activity;
}

export async function createAValidActivity() {
  const localtion = await prisma.location.create({
    data: {
      name: faker.company.companyName(),
      capacity: faker.datatype.number(),
      createdAt: faker.date.recent().toISOString(),
      updatedAt: faker.date.recent().toISOString(),
    },
  });

  const day = await prisma.day.create({
    data: {
      name: faker.date.weekday(),
      date: faker.date.recent().toISOString(),
      createdAt: faker.date.recent().toISOString(),
      updatedAt: faker.date.recent().toISOString(),
    },
  });

  const activity = await prisma.activity.create({
    data: {
      dayId: day.id,
      localId: localtion.id,
      name: faker.name.firstName(),
      startHour: faker.animal.bear(),
      endHour: faker.animal.bear(),
      duration: faker.datatype.number(),
      createdAt: faker.date.recent().toISOString(),
      updatedAt: faker.date.recent().toISOString(),
    },
  });

  return activity;
}
