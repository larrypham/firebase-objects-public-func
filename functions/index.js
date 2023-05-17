const functions = require("firebase-functions");
const admin = require("firebase-admin");
const {Storage} = require("@google-cloud/storage");

admin.initializeApp();
const storage = new Storage();

exports.makeBucketObjectsPublic = functions.pubsub.schedule("every 24 hours")
    .onRun(async (context) => {
      const bucketName = "rainbow-colors.appspot.com";
      try {
        const bucket = storage.bucket(bucketName);
        const [files] = await bucket.getFiles();

        const updatePromises = files.map((file) => file.makePublic());
        await Promise.all(updatePromises);
      } catch (error) {
        console.error("Error making bucket objects to be public.", error);
        throw new functions.https.HttpsError("internal",
            "Failed to make bucket objects to be public.");
      }
    });
