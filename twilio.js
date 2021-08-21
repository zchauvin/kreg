import twilio from "twilio";
import User from "./models/User.js";

const { MessagingResponse } = twilio.twiml;

export const handleSMS = async (req, res) => {
  let message;

  if (req.body.Body.trim().toLowerCase() === "y") {
    const user = await User.findByPhoneNumber(req.body.From);
    const reservation = await user.mostRecentReservation();

    await reservation.update({ status: "booked" });

    message = "Thanks for confirming you booking!";
  } else {
    message = "Sorry, I don't understand your reply.";
  }

  const twiml = new MessagingResponse();
  twiml.message(message);

  res.writeHead(200, { "Content-Type": "text/xml" });
  res.end(twiml.toString());
};
