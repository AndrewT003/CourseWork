const mongoose = require('mongoose');
const dotnew = require("dotenv");

// Функція для підключення до бази даних
const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/MilitaryCrimes", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Успішно підключено до бази даних MongoDB');
  } catch (error) {
    console.error('Помилка підключення до бази даних:', error.message);
    process.exit(1); // Завершити процес у разі помилки
  }
};

module.exports = connectDB;
