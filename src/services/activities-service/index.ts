import dayRepository from '@/repositories/day-repository';
import enrollmentRepository from '@/repositories/enrollment-repository';
import ticketRepository from '@/repositories/ticket-repository';
import { notFoundError } from '@/errors';
import { cannotListActivitiesError } from '@/errors/cannot-list-activities-error';
import { paymentError } from '@/errors/payment-error';
import bookingRepository from '@/repositories/booking-repository';
import activitiesRepository from '@/repositories/activities-repository';

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

async function listLocations(userId: number){
  //Tem enrollment?
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if(!enrollment){
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
  const locations = await activitiesRepository.findLocations();
  return locations;
}

async function listActivities(userId: number){
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if(!enrollment){
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
  const activities = await activitiesRepository.findActivities();
  return activities;
}

const activitieService = {
  listDays,
  listLocations,
  listActivities
};

export default activitieService;
