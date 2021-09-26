import admin from "firebase-admin";

type Firestore = admin.firestore.Firestore;

let _db: Firestore;

export default (): Firestore => {
  if (!_db) {
    admin.initializeApp();

    _db = admin.firestore();
  }

  return _db;
};
