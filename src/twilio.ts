import twilio from "twilio";
import User from "./models/User.js";

const { MessagingResponse } = twilio.twiml;

import type { HttpFunction } from "@google-cloud/functions-framework/build/src/functions";

interface Request {
  body: {
    From: string;
    Body: string;
  };
}

export const handleSMS: HttpFunction = async (req: Request, res) => {
  const { body } = req;
  const phoneNumber = body.From;
  const requestBody = body.Body.trim().toLowerCase();

  console.log(`${phoneNumber}: ${requestBody}`);

  let message: string;
  if (requestBody === "y") {
    const user = await User.findByPhoneNumber(phoneNumber);

    if (!user) return;

    const reservation = await user.mostRecentReservation();

    if (!reservation) return;

    await reservation.update({ status: "booked" });

    message = "Thanks for confirming your booking!";
  } else {
    message = "Sorry, I don't understand your reply.";
  }

  const twiml = new MessagingResponse();
  twiml.message(message);

  res.writeHead(200, { "Content-Type": "text/xml" });
  res.end(twiml.toString());
};
