import firestore from "../firestore.js";
import moment from "moment";
import { firestore as fs } from "firebase-admin";

interface NewRecord {
  [k: string]: any;
  createdAt: moment.Moment;
}

export default class Record {
  id: string;

  static COLLECTION: string;

  constructor(attributes: { [key: string]: any }) {
    for (const key in attributes) {
      (this as any)[key] = attributes[key];
    }
  }

  static collection(): fs.CollectionReference {
    return firestore().collection(this.COLLECTION);
  }

  static fromSnapshot(snapshot: fs.QuerySnapshot): Record[] {
    if (snapshot.empty) return [];

    return snapshot.docs.map(
      (doc) =>
        new this({
          id: doc.id,
          ...doc.data(),
        })
    );
  }

  static fromSnapshotSingle(snapshot: fs.QuerySnapshot): Record | null {
    const records = this.fromSnapshot(snapshot);
    return records.length > 0 ? records[0] : null;
  }

  static async all() {
    const snapshot = await this.collection().get();

    return this.fromSnapshot(snapshot);
  }

  static ref(id: string) {
    return this.collection().doc(id);
  }

  static async find(id: string) {
    const doc = await this.ref(id).get();

    return doc.exists
      ? new this({
          id: doc.id,
          ...doc.data(),
        })
      : null;
  }

  async save() {
    if (process.env.NODE_ENV === "development") return;

    const obj = Object.fromEntries(Object.entries(this)) as NewRecord;
    obj.createdAt = moment();

    return await (this.constructor as typeof Record)
      .collection()
      .doc()
      .set(obj);
  }

  async update(attributes: { [k: string]: any }) {
    return await (this.constructor as typeof Record)
      .ref(this.id)
      .update(attributes);
  }
}
