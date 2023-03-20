import app, { init } from "@/app";
import supertest from "supertest";
import faker from "@faker-js/faker";
import httpStatus from "http-status";
import * as jwt from "jsonwebtoken";
import {
  createAValidActivity,
  createConflictHour,
  createConflitActivity,
  createEnrollmentWithAddress,
  createFullActivity,
  createPayment,
  createTicket,
  createTicketTypeWithHotel,
  createUser,
} from "../factories";
import { cleanDb, generateValidToken } from "../helpers";
import { CannotRegisterActivityEnroll, ConflictActivityError, ConflictHourError, SoldOut, TicketActivityError } from "@/services/inscription-service/errors";
import { TicketStatus } from "@prisma/client";

beforeAll(async () => {
  await init();
});

beforeEach(async () => {
  await cleanDb();
});

const server = supertest(app);

describe("POST /inscription", () => {
  it("should respond with status 401 if no token is given", async () => {
    const response = await server.post("/inscription");

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if given token is not valid", async () => {
    const token = faker.lorem.word();

    const response = await server.post("/inscription").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if there is no session for given token", async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

    const response = await server.post("/inscription").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe("when token is valid", () => {
    it("Should respond with status 400 when body is invalid", async () => {
      const token = await generateValidToken();

      const response = await server.post("/inscription").set("Authorization", `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.BAD_REQUEST);
    });

    it("Should respond with status 404 when enroll from user not exists", async () => {
      const token = await generateValidToken();
      const validBody = { activityId: faker.datatype.number() };

      const response = await server.post("/inscription").set("Authorization", `Bearer ${token}`).send(validBody);

      expect(response.status).toEqual(httpStatus.NOT_FOUND);
      expect(response.body).toEqual(CannotRegisterActivityEnroll());
    });

    it("Should respond with status 402 when ticket from user not exists", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const validBody = { activityId: faker.datatype.number() };

      const response = await server.post("/inscription").set("Authorization", `Bearer ${token}`).send(validBody);

      expect(response.status).toEqual(httpStatus.PAYMENT_REQUIRED);
      expect(response.body).toEqual(TicketActivityError());
    });

    it("Should respond with status 404 when activity id does not exists", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeWithHotel();
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      const payment = await createPayment(ticket.id, ticketType.price);
      const validBody = { activityId: faker.datatype.number() };

      const response = await server.post("/inscription").set("Authorization", `Bearer ${token}`).send(validBody);

      expect(response.status).toEqual(httpStatus.NOT_FOUND);
    });

    it("Should respond with status 422 when activity is full", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeWithHotel();
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      const payment = await createPayment(ticket.id, ticketType.price);

      const activity = await createFullActivity();

      const validBody = { activityId: activity.id };

      const response = await server.post("/inscription").set("Authorization", `Bearer ${token}`).send(validBody);

      expect(response.status).toEqual(httpStatus.UNPROCESSABLE_ENTITY);
      expect(response.body).toEqual(SoldOut())
    });

    it("Should respond with status 409 when user already have the inscription for the activity", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeWithHotel();
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      const payment = await createPayment(ticket.id, ticketType.price);

      const activity = await createConflitActivity(user.id);

      const validBody = { activityId: activity.id };

      const response = await server.post("/inscription").set("Authorization", `Bearer ${token}`).send(validBody);

      expect(response.status).toEqual(httpStatus.CONFLICT);
      expect(response.body).toEqual(ConflictActivityError())
    });

    it("Should respond with status 409 when user already have other activity in same hour", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeWithHotel();
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      const payment = await createPayment(ticket.id, ticketType.price);

      const activity = await createConflictHour(user.id);

      const validBody = { activityId: activity.id };

      const response = await server.post("/inscription").set("Authorization", `Bearer ${token}`).send(validBody);

      expect(response.status).toEqual(httpStatus.CONFLICT);
      expect(response.body).toEqual(ConflictHourError())
    });
    
    it("Should respond with status 200 and the inscription id", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeWithHotel();
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      const payment = await createPayment(ticket.id, ticketType.price);

      const activity = await createAValidActivity();

      const validBody = { activityId: activity.id };

      const response = await server.post("/inscription").set("Authorization", `Bearer ${token}`).send(validBody);

      expect(response.status).toEqual(httpStatus.OK);
      expect(response.body).toEqual({inscriptionId: expect.any(Number)})
    });
  });
});
