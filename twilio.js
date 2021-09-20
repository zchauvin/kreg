import twilio from "twilio";
import User from "./models/User.js";

const { MessagingResponse } = twilio.twiml;

export const handleSMS = async (req, res) => {
  const phoneNumber = req.body.From;
  const requestBody = req.body.Body.trim().toLowerCase();

  console.log(`${phoneNumber}: ${requestBody}`);

  let message;
  if (requestBody === "y") {
    const user = await User.findByPhoneNumber(phoneNumber);
    const reservation = await user.mostRecentReservation();

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
