import Record from "./Record.js";
import Reservation from "./Reservation.js";

export default class User extends Record {
  distanceFilterMiles?: number;

  static COLLECTION = "users";
  static DEFAULT_DISTANCE_FILTER_MILES = 2;

  static async findByPhoneNumber(phoneNumber: string): Promise<User | null> {
    const snapshot = await this.collection()
      .where("phoneNumber", "==", phoneNumber)
      .get();

    return this.fromSnapshotSingle(snapshot) as User;
  }

  async reservations(status = null) {
    let query = Reservation.collection()
      .where("user", "==", User.ref(this.id))
      .orderBy("createdAt", "desc");

    if (status !== null) {
      query = query.where("status", "==", status);
    }

    const snapshot = await query.get();

    return Reservation.fromSnapshot(snapshot);
  }

  async mostRecentReservation(): Promise<Reservation | null> {
    const reservations = await this.reservations();
    return reservations.length > 0 ? reservations[0] : null;
  }

  getDistanceFilterMiles(): number {
    return this.distanceFilterMiles || User.DEFAULT_DISTANCE_FILTER_MILES;
  }
}
