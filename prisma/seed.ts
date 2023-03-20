import { PrismaClient } from "@prisma/client";
import dayjs from "dayjs";
const prisma = new PrismaClient();

async function main() {
  let event = await prisma.event.findFirst();
  if (!event) {
    event = await prisma.event.create({
      data: {
        title: "Driven.t",
        logoImageUrl: "https://files.driveneducation.com.br/images/logo-rounded.png",
        backgroundImageUrl: "linear-gradient(to right, #FA4098, #FFD77F)",
        startsAt: dayjs().toDate(),
        endsAt: dayjs().add(21, "days").toDate(),
      },
    });
  }

  console.log({ event });
  await prisma.ticketType.createMany({
    data: [
      {
        "name": "Online",
        "price": 100,
        "isRemote": true,
        "includesHotel": false
      },
      {
        "name": "Presencial",
        "price": 250,
        "isRemote": false,
        "includesHotel": false
      },
      {
        "name": "Presencial",
        "price": 600,
        "isRemote": false,
        "includesHotel": true
      },
    ]
  });

  const firstHotel = await prisma.hotel.create({
    data: {
      name: 'Driven Mar',
      image:
        'https://assets.hyatt.com/content/dam/hyatt/hyattdam/images/2017/08/29/1013/Grand-Hyatt-Rio-de-Janeiro-P443-Pool.jpg/Grand-Hyatt-Rio-de-Janeiro-P443-Pool.16x9.jpg?imwidth=1920',
    },
  });
  const secondHotel = await prisma.hotel.create({
    data: {
      name: 'Driven Beach',
      image:
        'https://cdn.loewshotels.com/loewshotels.com-2466770763/cms/cache/v2/620d6d91270c8.jpg/1920x1080/fit/80/eb7551cd93224863612f7472c55d933f.jpg',
    },
  });
  const thirdHotel = await prisma.hotel.create({
    data: {
      name: 'Driven Palace',
      image: 'https://media-cdn.tripadvisor.com/media/photo-s/22/25/ce/ea/kingsford-hotel-manila.jpg',
    },
  });

  await prisma.room.createMany({
    data: [
      { name: '101', capacity: 2, hotelId: firstHotel.id },
      { name: '102', capacity: 3, hotelId: firstHotel.id },
      { name: '103', capacity: 1, hotelId: firstHotel.id },
      { name: '104', capacity: 2, hotelId: firstHotel.id },
      { name: '201', capacity: 3, hotelId: secondHotel.id },
      { name: '202', capacity: 2, hotelId: secondHotel.id },
      { name: '203', capacity: 2, hotelId: secondHotel.id },
      { name: '204', capacity: 2, hotelId: secondHotel.id },
      { name: '301', capacity: 1, hotelId: thirdHotel.id },
      { name: '302', capacity: 3, hotelId: thirdHotel.id },
      { name: '303', capacity: 1, hotelId: thirdHotel.id },
      { name: '304', capacity: 3, hotelId: thirdHotel.id },
    ],
  });

  await prisma.day.createMany({
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

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
