import { signForActivity } from "@/controllers";
import { authenticateToken } from "@/middlewares";
import { Router } from "express";

const inscriptionRouter = Router();

inscriptionRouter
  .all("/*", authenticateToken)
  .post("/", signForActivity);

export { inscriptionRouter };

