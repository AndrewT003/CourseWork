const express = require('express');
const Crime = require('../models/crimes');  // Модель для правопорушень
const path = require('path');
const User = require('../models/user');    // Модель для користувачів
const router = express.Router();

// Видача сторінки адмін-панелі
router.get('/admin', async (req, res) => {
  res.sendFile(path.join(__dirname, '../public/pages/adminAccount.html'));
  try {
    const crimes = await Crime.find();
    res.json(crimes);
  } catch (err) {
    res.status(500).json({ message: 'Помилка при отриманні правопорушень' });
  }
});


// Пошук правопорушень за username
router.get('/api/crimes/search', async (req, res) => {
  const { username } = req.query;
  try {
    const user = await User.findOne({ username });
    if (user) {
      const crimes = await Crime.find({ issuedTo: user.username });
      res.json(crimes);
    } else {
      res.status(404).json({ message: 'Користувач не знайдений' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Помилка при пошуку правопорушень' });
  }
});

// Додавання нового правопорушення
router.post('/admin', async (req, res) => {
  const { crimeName, issuedTo, issuedBy, crimeDate, penalty } = req.body;
  try {
    const crime = new Crime({ crimeName, issuedTo, issuedBy, crimeDate, penalty });
    await crime.save();
    res.status(201).json(crime);
  } catch (err) {
    res.status(500).json({ message: 'Помилка при додаванні правопорушення' });
  }
});

// Редагування правопорушення
router.put('/api/crimes/:id', async (req, res) => {
  const { id } = req.params;
  const { crimeName, issuedTo, issuedBy, crimeDate, penalty } = req.body;
  try {
    const crime = await Crime.findByIdAndUpdate(id, { crimeName, issuedTo, issuedBy, crimeDate, penalty }, { new: true });
    if (!crime) {
      return res.status(404).json({ message: 'Правопорушення не знайдено' });
    }
    res.json(crime);
  } catch (err) {
    res.status(500).json({ message: 'Помилка при редагуванні правопорушення' });
  }
});

// Видалення правопорушення
router.delete('/api/crimes/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const crime = await Crime.findByIdAndDelete(id);
    if (!crime) {
      return res.status(404).json({ message: 'Правопорушення не знайдено' });
    }
    res.status(200).json({ message: 'Правопорушення видалено' });
  } catch (err) {
    res.status(500).json({ message: 'Помилка при видаленні правопорушення' });
  }
});

module.exports = router;
