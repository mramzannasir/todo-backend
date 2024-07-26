import mongoose from "mongoose";

export const connectDB = async () => {
  mongoose
    .connect(process.env.MONGO_URI || "mongodb://localhost:27017", {
      dbName: "TODO-2024",
    })
    .then((c) => console.log(`DB connect successfully to ${c.connection.host}`))
    .catch((e) => console.log("Something went wrong to connect with database"));
};
