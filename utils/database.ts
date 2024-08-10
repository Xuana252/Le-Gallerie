import mongoose from "mongoose";

let isConnected = false;

export const connectToDB = async () => {
  mongoose.set("strictQuery", true);

  if (isConnected) {
    console.log("Database already connected");
    return;
    }
    try {
    await mongoose.connect(process.env.MONGODB_URL as string, {
      dbName: "Le-Gallerie",
    });
    isConnected = true;
    console.log('Database connected')
    } catch (error) {
    console.log(error)
}
};
