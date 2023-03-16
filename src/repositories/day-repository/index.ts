import { prisma } from "@/config";

async function findDays() {
  //return prisma.days.findMany();
  return [{name:'Segunda', date:'20/03/2023'},{name:'Terça', date:'21/03/2023'}]
}

const dayRepository = {
  findDays,
};

export default dayRepository;
