import { prisma } from "@/config";

async function findAllByHotelId(hotelId: number) {
  return prisma.room.findMany({
    where: {
      hotelId,
    }
  });
}

async function findById(roomId: number) {
  return prisma.room.findFirst({
    where: {
      id: roomId,
    }
  });
}

async function typeRoom(){
  return prisma.room.findMany({
    select:{
      capacity:true,
      hotelId:true
    }
  })
}
async function countCapacityRooms() {
  return prisma.room.groupBy({
    by:['hotelId'],
    _sum:{
      capacity:true
    }
  });
}

const roomRepository = {
  findAllByHotelId,
  findById,
  countCapacityRooms,
  typeRoom
};

export default roomRepository;
