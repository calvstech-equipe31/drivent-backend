import { prisma } from "@/config";

async function findDays() {
  //return prisma.days.findMany();
  return await prisma.day.findMany();
}

const dayRepository = {
  findDays,
};

export default dayRepository;
