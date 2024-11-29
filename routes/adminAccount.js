const express = require('express');
const Crime = require('../models/crimes'); // Модель для правопорушень
const path = require('path');
const router = express.Router();


// Видача сторінки адмін-панелі (статичний HTML)
router.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'pages', 'adminAccount.html')); // Відправка статичного файлу
});

// Сторінка редагування правопорушення
router.get('/admin/crimes/edit/:crimeId', async (req, res) => {
  const crimeId = req.params.crimeId;

  try {
    const crime = await Crime.findById(crimeId);
    if (!crime) {
      return res.status(404).send('Правопорушення не знайдено');
    }

    res.render('edit', { crime }); // Використовуємо шаблон edit.ejs для динамічної сторінки
  } catch (err) {
    console.error('Помилка при завантаженні даних для редагування:', err);
    res.status(500).send('Помилка сервера');
  }
});

// API для оновлення правопорушення
router.post('/admin/crimes/edit', async (req, res) => {
  const { crimeId, crimeName, issuedTo, issuedBy, crimeDate, penalty } = req.body;

  try {
    const crime = await Crime.findByIdAndUpdate(
      crimeId,
      { crimeName, issuedTo, issuedBy, crimeDate, penalty },
      { new: true }
    );

    if (!crime) {
      return res.status(404).send('Правопорушення не знайдено');
    }

    res.redirect('/admin'); // Повертаємо користувача на головну сторінку адміністратора
  } catch (err) {
    console.error('Помилка при оновленні правопорушення:', err);
    res.status(500).send('Не вдалося оновити правопорушення');
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

router.get('/admin/crimes/edit/:crimeId', async (req, res) => {
  const crimeId = req.params.crimeId;

  try {
    const crime = await Crime.findById(crimeId);
    if (!crime) {
      return res.status(404).send('Правопорушення не знайдено');
    }
    res.render('edit', { crime }); // Рендеримо сторінку з даними
  } catch (err) {
    console.error('Помилка при завантаженні даних для редагування:', err);
    res.status(500).send('Помилка сервера');
  }
});


router.post('/admin/crimes/edit', async (req, res) => {
  const { crimeId, crimeName, issuedTo, issuedBy, crimeDate, penalty } = req.body;

  try {
    const crime = await Crime.findByIdAndUpdate(crimeId, {
      crimeName,
      issuedTo,
      issuedBy,
      crimeDate,
      penalty,
    });

    if (!crime) {
      return res.status(404).send('Правопорушення не знайдено');
    }
    res.redirect('/admin'); // Повертаємося на сторінку списку
  } catch (err) {
    console.error(err);
    res.status(500).send('Не вдалося оновити правопорушення');
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
// API для пошуку правопорушень за username (issuedTo)
router.get('/admin/crimes/search', async (req, res) => {
  const { username } = req.query;

  try {
    if (!username) {
      // Якщо запит без параметра username, повертаємо порожній список
      return res.json([]);
    }

    // Знаходимо всі правопорушення, де issuedTo містить введений username
    const crimes = await Crime.find({ issuedTo: { $regex: username, $options: 'i' } });
    res.json(crimes);
  } catch (err) {
    console.error(err);
    res.status(500).send('Виникла помилка при пошуку даних');
  }
});

module.exports = router;
