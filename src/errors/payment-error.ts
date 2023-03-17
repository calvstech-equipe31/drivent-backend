import { ApplicationError } from "@/protocols";

export function paymentError(): ApplicationError {
  return {
    name: "NotFoundPayment",
    message: "You must pay to continue!",
  };
}
