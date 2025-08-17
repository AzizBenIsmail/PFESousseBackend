const mongoose = require("mongoose");

module.exports.connectToMongoDb = async () => {
  mongoose.set("strictQuery", false);
  mongoose
    .connect(process.env.Url_Db)
    .then(() => {
      console.log("connect ot db");
    })
    .catch((error) => {
      console.log(error);
    });
}
