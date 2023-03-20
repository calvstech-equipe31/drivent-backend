import { Router } from "express";
import { authenticateToken } from "@/middlewares";
import { getActivity, getDays, getLocations } from "@/controllers";

const activitiesRouter = Router();

activitiesRouter
  .all("/*", authenticateToken)
  .get("/", getDays)
  .get("/locations", getLocations)
  .get("/activity", getActivity)

export { activitiesRouter };
