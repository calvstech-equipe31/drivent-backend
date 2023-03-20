import { prisma } from "@/config";

async function findLocations(){
   const response = await prisma.location.findMany({});
   return response;
}

async function findActivities(){
    const response = await prisma.activity.findMany({
      select:{
        id:true,
        dayId:true,
        name:true,
        localId:true,
        startHour: true,
        endHour:true,
        duration:true,
        createdAt:true,
        updatedAt:true,
        Location:true,
        Inscription:true
      }
      }) 
      _count:{
        select:{
          Inscription:true
        }
      }
    return response;
}

const activitiesRepository = {
    findLocations,
    findActivities
}

export default activitiesRepository;