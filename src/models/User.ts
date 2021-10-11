import Record from "./Record.js";
import Reservation, { Status } from "./Reservation.js";

interface Range {
  day: "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun";
  fromTime?: string;
  toTime?: string;
}

export default class User extends Record {
  distanceFilterMiles?: number;
  address: string;
  ranges: Range[];
  firstName: string;
  phoneNumber: string;

  static COLLECTION = "users";
  static DEFAULT_DISTANCE_FILTER_MILES = 2;

  static async findByPhoneNumber(phoneNumber: string): Promise<User | null> {
    const snapshot = await this.collection()
      .where("phoneNumber", "==", phoneNumber)
      .get();

    return this.fromSnapshotSingle<User>(snapshot);
  }

  static async active(): Promise<User[]> {
    const snapshot = await this.collection()
      .where("status", "==", "active")
      .get();

    return this.fromSnapshot<User>(snapshot);
  }

  async reservations(status: Status | null = null) {
    let query = Reservation.collection()
      .where("user", "==", User.ref(this.id))
      .orderBy("createdAt", "desc");

    if (status !== null) {
      query = query.where("status", "==", status);
    }

    const snapshot = await query.get();

    return Reservation.fromSnapshot<Reservation>(snapshot);
  }

  async mostRecentReservation(): Promise<Reservation | null> {
    const reservations = await this.reservations();
    return reservations.length > 0 ? reservations[0] : null;
  }

  getDistanceFilterMiles(): number {
    return this.distanceFilterMiles || User.DEFAULT_DISTANCE_FILTER_MILES;
  }
}
