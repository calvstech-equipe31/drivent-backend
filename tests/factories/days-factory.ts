import faker from "@faker-js/faker";
import { prisma } from "@/config";
import dayjs from "dayjs";

export async function createDays() {
  return await prisma.day.createMany({
    data: [
      {
        name: 'Sexta',
        date: '2023-10-22T14:56:47.098Z',
        updatedAt: dayjs().toDate(),
      },
      {
        name: 'Sábado',
        date: '2023-10-23T14:56:47.098Z',
        updatedAt: dayjs().toDate(),
      },
      {
        name: 'Domingo',
        date: '2023-10-24T14:56:47.098Z',
        updatedAt: dayjs().toDate(),
      },
    ]
  });
}
