const mongoose = require('mongoose');
require('dotenv').config(); // Імпорт dotenv

// Функція для підключення до бази даних
const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI; // Отримання URI з .env
    if (!uri) {
      throw new Error("MONGO_URI не визначено в .env файлі");
    }

    await mongoose.connect(uri, {
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
