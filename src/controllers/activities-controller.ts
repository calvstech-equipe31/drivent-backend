import { Response } from "express";
import { AuthenticatedRequest } from "@/middlewares";
import activitiesService from "@/services/activities-service";
import httpStatus from "http-status";

export async function getDays(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;

  try {
    const days = await activitiesService.listDays(Number(userId));
    return res.status(httpStatus.OK).send(days);
  } catch (error) {
    if (error.name === "NotFoundError") {
      return res.sendStatus(httpStatus.NOT_FOUND);
    }
    if (error.name === "cannotListActivitiesError") {
      return res.sendStatus(httpStatus.FORBIDDEN);
    }
    if (error.name === "NotFoundPayment") {
      return res.sendStatus(httpStatus.PAYMENT_REQUIRED);
    }
    return res.sendStatus(httpStatus.BAD_REQUEST);
  }
}
