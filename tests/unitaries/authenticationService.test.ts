import authenticationService, { invalidCredentialsError } from "@/services/authentication-service";
import sessionRepository from "@/repositories/session-repository";
import userRepository from "@/repositories/user-repository";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { jest } from "@jest/globals";

import faker from "@faker-js/faker";

describe("authenticationServices tests suite", () => {
  it("Should return the user and the token from user", async () => {
    const user = { email: faker.internet.email(), password: faker.internet.password() };
    const token = faker.datatype.string();
    jest.spyOn(userRepository, "findByEmail").mockImplementationOnce((): any => {
      return {
        id: 1,
        email: user.email,
        password: user.password,
      };
    });
    jest.spyOn(bcrypt, "compare").mockImplementationOnce(() => {
      return true;
    });
    jest.spyOn(jwt, "sign").mockImplementationOnce(() => {
      return token;
    });
    jest.spyOn(sessionRepository, "create").mockImplementationOnce((): any => {});

    const promisse = await authenticationService.signIn(user);
    expect(promisse.token).toBe(token);
    expect(promisse.user).toEqual({ id: 1, email: user.email });
  });

  it("Should throw an error if email is not found", async () => {
    const user = { email: faker.internet.email(), password: faker.internet.password() };
    jest.spyOn(userRepository, "findByEmail").mockImplementationOnce((): any => {});
    await expect(authenticationService.signIn(user)).rejects.toEqual(invalidCredentialsError());
  });

  it("Should throw an error if password is invalid", async () => {
    const user = { email: faker.internet.email(), password: faker.internet.password() };
    jest.spyOn(userRepository, "findByEmail").mockImplementationOnce((): any => {
      return {
        id: 1,
        email: user.email,
        password: faker.internet.password(),
      };
    });
    jest.spyOn(bcrypt, "compare").mockImplementationOnce(() => {
      return false;
    });
    await expect(authenticationService.signIn(user)).rejects.toEqual(invalidCredentialsError());
  });
});
