import Record from "./Record.js";
import Reservation from "./Reservation.js";
import moment from "moment";

export default class User extends Record {
  static COLLECTION = "users";
  static RECENT_RESERVATION_THRESHOLD_DAYS = 3;

  static async findByPhoneNumber(phoneNumber) {
    const snapshot = await this.collection()
      .where("phoneNumber", "==", phoneNumber)
      .get();

    return this.fromSnapshotSingle(snapshot);
  }

  async reservations() {
    const snapshot = await Reservation.collection()
      .where("user", "==", this.constructor.ref(this.id))
      .where(
        "timestamp",
        ">=",
        moment().subtract(
          this.constructor.RECENT_RESERVATION_THRESHOLD_DAYS,
          "days"
        )
      )
      .orderBy("timestamp", "desc")
      .get();

    return Reservation.fromSnapshot(snapshot);
  }

  async mostRecentReservation() {
    const reservations = await this.reservations();
    return reservations.length > 0 ? reservations[0] : null;
  }
}
