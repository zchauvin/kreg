import admin from "firebase-admin";

let _db;

export default () => {
  if (!_db) {
    admin.initializeApp();

    _db = admin.firestore();
  }

  return _db;
};
