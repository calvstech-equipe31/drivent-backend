import { notFoundError } from "@/errors";
import activityRepository from "@/repositories/acctivity-repository";
import enrollmentRepository from "@/repositories/enrollment-repository";
import inscriptionRepository from "@/repositories/inscription-repository";
import ticketRepository from "@/repositories/ticket-repository";
import { CannotRegisterActivityEnroll, TicketActivityError, ConflictActivityError, ConflictHourError, SoldOut } from "./errors";

async function checkEnrollAndTicket(userId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) throw CannotRegisterActivityEnroll();

  const ticket = await ticketRepository.findTicketByEnrollmentId(enrollment.id);
  if (!ticket || ticket.status === "RESERVED" || ticket.TicketType.isRemote || !ticket.TicketType.includesHotel) {
    throw TicketActivityError();
  }
}

async function validateActivity(activityId: number, userId: number) {
  const activity = await activityRepository.findActivityLocationAndInscriptions(activityId);
  if (!activity) throw notFoundError();
  if (activity.Location.capacity <= activity._count.Inscription) throw  SoldOut();

  const userActivity = await inscriptionRepository.findInscriptionByUserIdAndActivityId(userId, activityId);
  if (userActivity) throw ConflictActivityError();

  const allActivitiesFromUser = await inscriptionRepository.findAllUserInscriptions(userId);
  let conflictHour = false;
  allActivitiesFromUser.forEach((actUser) => {
    if (conflictHour) {
      return;
    }
    if (actUser.Activity.dayId === activity.dayId) {
      const userStartHour = actUser.Activity.startHour.split(":").join("");
      const userEndtHour = actUser.Activity.endHour.split(":").join("");
      const actiStartHour = activity.startHour.split(":").join("");
      const actiEndtHour = activity.endHour.split(":").join("");

      if (
        (userStartHour <= actiStartHour && actiStartHour <= userEndtHour) ||
        (userStartHour <= actiEndtHour && actiEndtHour <= userEndtHour)
      ) {
        conflictHour = true;
      }
    }
  });

  if (conflictHour) throw ConflictHourError();
}

async function registrationActivity(userId: number, activityId: number) {
  await checkEnrollAndTicket(userId);
  await validateActivity(activityId, userId);
  const { id } = await inscriptionRepository.createInscription(userId, activityId);

  return { inscriptionId: id };
}

const inscriptionService = {
  registrationActivity,
};

export default inscriptionService;
