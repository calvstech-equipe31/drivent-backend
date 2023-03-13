import hotelRepository from "@/repositories/hotel-repository";
import enrollmentRepository from "@/repositories/enrollment-repository";
import ticketRepository from "@/repositories/ticket-repository";
import { notFoundError } from "@/errors";
import { cannotListHotelsError } from "@/errors/cannot-list-hotels-error";
import bookingRepository from "@/repositories/booking-repository";
import roomRepository from "@/repositories/room-repository";
import { Hotel } from "@prisma/client";

async function listHotels(userId: number) {
  //Tem enrollment?
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) {
    throw notFoundError();
  }
  //Tem ticket pago isOnline false e includesHotel true
  const ticket = await ticketRepository.findTicketByEnrollmentId(enrollment.id);

  if (!ticket || ticket.status === "RESERVED" || ticket.TicketType.isRemote || !ticket.TicketType.includesHotel) {
    throw cannotListHotelsError();
  }
}

async function organizateHotels(hotels: Hotel[]) {
  const roomsTypes = await roomRepository.typeRoom();
  const typesRoom: any= {};
  roomsTypes.forEach((r) => {
    if (!typesRoom[r.hotelId]) typesRoom[r.hotelId] = [];
    if (r.capacity === 1 && !typesRoom[r.hotelId].includes("Single")) {
      typesRoom[r.hotelId].push("Single");
    }
    if (r.capacity === 2 && !typesRoom[r.hotelId].includes("Double")) {
      typesRoom[r.hotelId].push("Double");
    }
    if (r.capacity === 3 && !typesRoom[r.hotelId].includes("Triple")) {
      typesRoom[r.hotelId].push("Triple");
    }
  });

  const capacity = await roomRepository.countCapacityRooms();
  const bookingsByHotelId = await bookingRepository.findAllBooking();

  const hotelsCapacity: any = {};
  capacity.forEach((h) => {
    hotelsCapacity[h.hotelId] = h._sum.capacity;
  });
  bookingsByHotelId.forEach((b) => {
    hotelsCapacity[b.Room.hotelId] -= 1;
  });

  const finalHotels = hotels.map(h=>{return {
    "id":h.id, 
    "name":h.name, 
    "image":h.image,
    "typesRoom":typesRoom[h.id],
    "capacity":hotelsCapacity[h.id], 
    "createdAt":h.createdAt, 
    "updatedAt":h.updatedAt
  }})
  
  return finalHotels;
}

async function getHotels(userId: number) {
  await listHotels(userId);

  const hotels = await hotelRepository.findHotels();
  const infosFromHotels = organizateHotels(hotels);

  return infosFromHotels;
}

async function getHotelsWithRooms(userId: number, hotelId: number) {
  await listHotels(userId);
  const hotel = await hotelRepository.findRoomsByHotelId(hotelId);

  if (!hotel) {
    throw notFoundError();
  }
  return hotel;
}

const hotelService = {
  getHotels,
  getHotelsWithRooms,
};

type TypesRoom = {
  Single: number[];
  Double: number[];
  Triple: number[];
};

export default hotelService;
