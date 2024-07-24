import mongoose from 'mongoose';

const db = async () => {
  console.log(process.env.LIVE_DATABASE_URL);
  try {
    const connection = await mongoose.connect(process.env.LIVE_DATABASE_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`mongoDB connected to ${connection.connection.host}`);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

export default db;
