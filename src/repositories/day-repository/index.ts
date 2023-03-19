import { prisma } from "@/config";

async function findDays() {
  //return prisma.days.findMany();
  return [
    { id: 1, name: "Segunda", date: "20/03" },
    { id: 2, name: "Terça", date: "21/03" },
  ];
}

const dayRepository = {
  findDays,
};

export default dayRepository;
