import { notFoundError } from "@/errors";
import activityRepository from "@/repositories/acctivity-repository";
import enrollmentRepository from "@/repositories/enrollment-repository";
import inscriptionRepository from "@/repositories/inscription-repository";
import ticketRepository from "@/repositories/ticket-repository";

async function checkEnrollAndTicket(userId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) throw { name: "CannotRegisterActivityEnroll" };

  const ticket = await ticketRepository.findTicketByEnrollmentId(enrollment.id);
  if (!ticket || ticket.status === "RESERVED" || ticket.TicketType.isRemote || !ticket.TicketType.includesHotel) {
    throw { name: "TicketError" };
  }
}

async function validateActivity(activityId: number, userId: number) {
  const activity = await activityRepository.findActivityLocationAndInscriptions(activityId);
  if (!activity) throw notFoundError();
  if (activity.Location.capacity <= activity._count.Inscription) throw { name: "ActivitySoldOut" };

  const userActivity = await inscriptionRepository.findInscriptionByUserIdAndActivityId(userId, activityId);
  if (userActivity) throw { name: "ConflictActivityError" };

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

  if (conflictHour) throw { name: "ConflictHourError" };
}

async function validateConflictHour() {}

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
