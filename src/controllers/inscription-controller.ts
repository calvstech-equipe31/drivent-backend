import { AuthenticatedRequest } from "@/middlewares";
import inscriptionService from "@/services/inscription-service";
import { Response } from "express";
import httpStatus from "http-status";

export async function signForActivity(req: AuthenticatedRequest, res: Response) {
  try {
    const { userId } = req;
    const { activityId } = req.body;
    if (!activityId || isNaN(activityId)) {
      return res.sendStatus(httpStatus.BAD_REQUEST);
    }

    const reservation = await inscriptionService.registrationActivity(userId, activityId);
    return res.status(200).send(reservation);
  } catch (err) {
    if (err.name === "CannotRegisterActivityEnroll") {
      return res.status(httpStatus.NOT_FOUND).send(err);
    }
    if (err.name === "TicketError") {
      return res.status(httpStatus.PAYMENT_REQUIRED).send(err);
    }
    if (err.name === "ActivitySoldOut") {
      return res.status(httpStatus.UNPROCESSABLE_ENTITY).send(err);
    }
    if (err.name === "ConflictActivityError") {
      return res.status(httpStatus.CONFLICT).send(err);
    }
    if (err.name === "ConflictHourError") {
      return res.status(httpStatus.CONFLICT).send(err);
    }
    if (err.name === "NotFoundError") {
      return res.status(httpStatus.NOT_FOUND).send(err);
    }
  }
}
