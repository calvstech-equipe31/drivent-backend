import { Router } from "express";
import { authenticateToken } from "@/middlewares";
import { getDays } from "@/controllers";

const activitiesRouter = Router();

activitiesRouter
  .all("/*", authenticateToken)
  .get("/", getDays)

export { activitiesRouter };
