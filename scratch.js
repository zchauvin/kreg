const admin = require("firebase-admin");
admin.initializeApp();
const db = admin.firestore();
const c = db.collection("users");
const ref = c.doc("Y3wLaPUBZpSOTVPcS0Yt");
const d = ref.get().then(console.log);
const moment = require("moment")(async () => {
  const snapshot = await db
    .collection("reservations")
    .where("date", "<", moment().add(1, "year"))
    .get();

  console.log(snapshot.empty);
})();

// gcloud functions deploy scrapeSpotery \
// --runtime nodejs14 \
// --trigger-topic scrape.spotery

// --set-env-vars TWILIO_ACCOUNT_SID=ACf9c58b130230d542de49e5b1cef1d8e2,TWILIO_AUTH_TOKEN=7d3294711174b2cbd1ba67736616bb66,TWILIO_PHONE_NUMBER=+13214459077,NODE_ENV=production

// gcloud pubsub topics publish scrape.spotery --message="{}"

// --message "{\"date\": \"08/15/2021\", \"address\": \"48 San Jose Avenue San Francisco, CA 94110\"}"

// curl -X POST "https://us-central1-kreg-314404.cloudfunctions.net/handleSMS" -H "Content-Type:application/json" --data '{"name":"Keyboard Cat"}'
