import { AuthenticatedRequest } from "@/middlewares";
import inscriptionService from "@/services/inscription-service";
import { Response } from "express";
import httpStatus from "http-status";

export async function signForActivity(req: AuthenticatedRequest, res: Response) {
  try {
    const { userId } = req;
    const { activityId } = req.body;
    if (!activityId) {
      return res.sendStatus(httpStatus.BAD_REQUEST);
    }

    const reservation = await inscriptionService.registrationActivity(userId, activityId);
    return res.status(200).send(reservation);
  } catch (err) {
    if (err.name === "CannotRegisterActivityEnroll") {
      return res.status(422).send(err);
    }
    if (err.name === "TicketError") {
      return res.status(402).send(err);
    }
    if (err.name === "ActivitySoldOut") {
      return res.status(422).send(err);
    }
    if (err.name === "ConflictActivityError") {
      return res.status(409).send(err);
    }
    if (err.name === "ConflictHourError") {
      return res.status(409).send(err);
    }
    if (err.name === "NotFoundError") {
      return res.status(404).send(err);
    }
  }
}
