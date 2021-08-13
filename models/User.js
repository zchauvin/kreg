import firestore from "../firestore.js";

const COLLECTION = "users";

const all = async () => {
  const snapshot = await firestore().collection(COLLECTION).get();

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};

export default {
  all,
};
