import { prisma } from "@/config";

async function findDays() {
  return prisma.hotel.findMany();
}

const dayRepository = {
  findDays,
};

export default dayRepository;
