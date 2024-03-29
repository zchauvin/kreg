import Record from "./Record.js";
import admin from "firebase-admin";

export type Status = "booked";

export default class Reservation extends Record {
  timestamp: admin.firestore.Timestamp;
  spotId: string;
  status: Status;

  static COLLECTION = "reservations";
}
