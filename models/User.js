import Record from "./Record.js";
import Reservation from "./Reservation.js";
import moment from "moment";

export default class User extends Record {
  static COLLECTION = "users";
  static DEFAULT_DISTANCE_FILTER_MILES = 2;

  static async findByPhoneNumber(phoneNumber) {
    const snapshot = await this.collection()
      .where("phoneNumber", "==", phoneNumber)
      .get();

    return this.fromSnapshotSingle(snapshot);
  }

  async reservations(status = null) {
    let query = Reservation.collection()
      .where("user", "==", this.constructor.ref(this.id))
      .orderBy("createdAt", "desc");

    if (status !== null) {
      query = query.where("status", "==", status);
    }

    const snapshot = await query.get();

    return Reservation.fromSnapshot(snapshot);
  }

  async mostRecentReservation() {
    const reservations = await this.reservations();
    return reservations.length > 0 ? reservations[0] : null;
  }

  getDistanceFilterMiles() {
    return (
      this.distanceFilterMiles || this.constructor.DEFAULT_DISTANCE_FILTER_MILES
    );
  }
}
