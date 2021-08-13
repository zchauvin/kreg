import firestore from "../firestore.js";

const all = async () => {
  const snapshot = await firestore().collection("users").get();

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};

export default {
  all,
};
