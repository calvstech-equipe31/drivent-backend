import dayRepository from '@/repositories/day-repository';
import enrollmentRepository from '@/repositories/enrollment-repository';
import ticketRepository from '@/repositories/ticket-repository';
import { notFoundError } from '@/errors';
import { cannotListActivitiesError } from '@/errors/cannot-list-activities-error';
import { paymentError } from '@/errors/payment-error';
import bookingRepository from '@/repositories/booking-repository';

async function listDays(userId: number) {
  //Tem enrollment?
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) {
    throw notFoundError();
  }
  //Tem ticket pago isOnline false
  const ticket = await ticketRepository.findTicketByEnrollmentId(enrollment.id);

  if (!ticket || ticket.status === 'RESERVED') {
    throw paymentError();
  }
  
  if (ticket.TicketType.isRemote) {
    throw cannotListActivitiesError();
  }
  const days = await dayRepository.findDays();
  return days;
}

const activitieService = {
  listDays,
};

export default activitieService;
