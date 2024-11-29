const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Crime = require('../models/crimes');

router.get('/user', async (req, res) => {
  try {
    const userId = req.session.userId;

    if (!userId) {
      return res.status(401).send('Неавторизований доступ. Будь ласка, увійдіть в систему.');
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send('Користувача не знайдено');
    }

    const crimes = await Crime.find({ issuedTo: user.username });

    res.render('userAccount', { user, crimes });

  } catch (err) {
    console.error('Помилка при завантаженні даних користувача:', err);
    res.status(500).send('Помилка сервера');
  }
});

module.exports = router;
