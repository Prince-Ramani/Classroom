import mongoose from "mongoose";

const MongoConnect = async () => {
  try {
    if (!process.env.MONGO_URL) {
      console.error("Mongodb url not found!");
      process.exit(1);
    }
    await mongoose.connect(process.env.MONGO_URL);
    console.log("MongoDb connected successfully!");
  } catch (err) {
    console.log("Error occured while connecting MONGODB : ", err);
  }
};

export default MongoConnect;
