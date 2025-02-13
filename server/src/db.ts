import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI || "";

function connectDB() {
  mongoose
    .connect(MONGO_URI)
    .then(() => {
      console.log("Connected to MongoDB");
    })
    .catch((error) => {
      console.error("Error connecting to MongoDB:", error);
    });
}

// export async function seedData() {
//   try {
//     await appartment.deleteMany({});

//     await appartment.insertMany(properties);
//     console.log("Data seeded successfully");
//   } catch (err) {
//     console.error("Error seeding data:", err);
//     mongoose.connection.close();
//   }
// }

// seedData();

export default connectDB;
