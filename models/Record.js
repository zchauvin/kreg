import firestore from "../firestore.js";

export default class Record {
  constructor(attributes) {
    for (const key in attributes) {
      this[key] = attributes[key];
    }
  }

  static collection() {
    return firestore().collection(this.COLLECTION);
  }

  static fromSnapshot(snapshot) {
    if (snapshot.empty) return [];

    return snapshot.docs.map(
      (doc) =>
        new this({
          id: doc.id,
          ...doc.data(),
        })
    );
  }

  static fromSnapshotSingle(snapshot) {
    const records = this.fromSnapshot(snapshot);
    return records.length > 0 ? records[0] : null;
  }

  static async all() {
    const snapshot = await this.collection().get();

    return this.fromSnapshot(snapshot);
  }

  static ref(id) {
    return this.collection().doc(id);
  }

  static async find(id) {
    const doc = await this.ref(id).get();

    return doc.exists
      ? new this({
          id: doc.id,
          ...doc.data(),
        })
      : null;
  }

  save() {
    if (process.env.NODE_ENV === "development") return;

    this.constructor
      .collection()
      .doc()
      .set(Object.fromEntries(Object.entries(this)));
  }

  async update(attributes) {
    await this.constructor.ref(this.id).update(attributes);
  }
}
