const mongoose = require('mongoose');


console.log(process.env.DB_URI)

const connectDB = async () => {
  try{
  const conn = await mongoose.connect(process.env.DB_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  });
  console.log(
    `Connected to database on host ${conn.connection.host}`
  );
  } catch(err) {
    console.log(err)
  }
};
connectDB();
module.exports = connectDB;
