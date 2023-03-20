import { ApplicationError } from "@/protocols";

export function CannotRegisterActivityEnroll(): ApplicationError {
  return {
    name: "CannotRegisterActivityEnroll",
    message: "User does not have a enrollment.",
  };
}

export function TicketActivityError(): ApplicationError {
  return {
    name: "TicketError",
    message: "Failed to find ticket from user.",
  };
}

export function ConflictActivityError(): ApplicationError {
  return {
    name: "ConflictActivityError",
    message: "User already have sign for this activity.",
  };
}

export function ConflictHourError(): ApplicationError {
  return {
    name: "ConflictHourError",
    message: "User is subscribed to another activity at the same timer.",
  };
}

export function SoldOut(): ApplicationError {
  return {
    name: "ActivitySoldOut",
    message:"Activity has no more space."
  };
}
