const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Crime = require('../models/crimes');

// Маршрут для отримання даних користувача та його правопорушень
router.get('/user', async (req, res) => {
  try {
    // Перевірка наявності userId в сесії
    const userId = req.session.userId;

    // Якщо немає userId, повертаємо помилку авторизації
    if (!userId) {
      return res.status(401).send('Неавторизований доступ. Будь ласка, увійдіть в систему.');
    }

    // Отримуємо інформацію про користувача з бази
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send('Користувача не знайдено');
    }

    // Отримуємо всі правопорушення, пов'язані з цим користувачем
    const crimes = await Crime.find({ issuedTo: user.username });

    // Рендеримо сторінку користувача та передаємо дані
    res.render('userAccount', { user, crimes });

  } catch (err) {
    console.error('Помилка при завантаженні даних користувача:', err);
    res.status(500).send('Помилка сервера');
  }
});

module.exports = router;
