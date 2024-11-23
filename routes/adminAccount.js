const express = require('express');
const Crime = require('../models/crimes'); // Модель для правопорушень
const path = require('path');
const router = express.Router();
const mongoose = require('mongoose'); // Додаємо mongoose

// Видача сторінки адмін-панелі
router.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'pages', 'adminAccount.html'));
});

// Маршрут для сторінки редагування правопорушення
router.get('/admin/crimes/edit.html', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'pages', 'edit.html'));
});
// API для додавання нового правопорушення
router.post('/admin/crimes', async (req, res) => {
  const { crimeName, issuedTo, issuedBy, crimeDate, penalty } = req.body;

  try {
    // Створюємо нове правопорушення
    const newCrime = new Crime({
      crimeName,
      issuedTo,
      issuedBy,
      crimeDate,
      penalty,
    });

    // Зберігаємо в базі даних
    await newCrime.save();

    // Після успішного додавання перенаправляємо на головну сторінку
    res.redirect('/admin');
  } catch (err) {
    console.error(err);
    res.status(500).send('Не вдалося додати правопорушення');
  }
});

// API для отримання списку всіх правопорушень
router.get('/admin/crimes', async (req, res) => {
  try {
    const crimes = await Crime.find(); // Отримання всіх правопорушень
    res.json(crimes); // Повертаємо список у форматі JSON
  } catch (err) {
    console.error(err);
    res.status(500).send('Виникла помилка при отриманні даних');
  }
});

// API для завантаження даних конкретного правопорушення
router.get('/admin/crimes/edit/:id', async (req, res) => {
  const crimeId = req.params.id;

  // Перевірка на валідність ObjectId
  if (!mongoose.Types.ObjectId.isValid(crimeId)) {
    return res.status(400).json({ error: 'Невірний ID правопорушення' });
  }

  try {
    const crime = await Crime.findById(crimeId);
    if (!crime) {
      return res.status(404).json({ error: 'Правопорушення не знайдено' });
    }

    // Повертаємо дані правопорушення
    res.json(crime);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Виникла помилка при завантаженні правопорушення' });
  }
});

// API для оновлення правопорушення
router.post('/admin/crimes/edit', async (req, res) => {
  const { crimeId, crimeName, issuedTo, issuedBy, crimeDate, penalty } = req.body;

  try {
    // Оновлення даних правопорушення
    await Crime.findByIdAndUpdate(crimeId, {
      crimeName,
      issuedTo,
      issuedBy,
      crimeDate,
      penalty
    });

    res.status(200).send('Правопорушення оновлено');
  } catch (err) {
    console.error(err);
    res.status(500).send('Не вдалося оновити дані правопорушення');
  }
});

// API для видалення правопорушення
router.post('/admin/crimes/delete', async (req, res) => {
  const { crimeId } = req.body;

  try {
    // Видалення правопорушення за ID
    await Crime.findByIdAndDelete(crimeId);
    
    // Після успішного видалення перенаправляємо назад на сторінку адмін-панелі
    res.redirect('/admin');
  } catch (err) {
    console.error(err);
    // Якщо сталася помилка, можемо перенаправити на сторінку з повідомленням про помилку
    res.redirect('/admin?error=true');
  }
});


module.exports = router;
