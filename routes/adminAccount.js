const express = require('express');
const Crime = require('../models/crimes'); 
const path = require('path');
const router = express.Router();


router.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'pages', 'adminAccount.html')); 
});

router.get('/admin/crimes/edit/:crimeId', async (req, res) => {
  const crimeId = req.params.crimeId;

  try {
    const crime = await Crime.findById(crimeId);
    if (!crime) {
      return res.status(404).send('Правопорушення не знайдено');
    }

    res.render('edit', { crime }); 
  } catch (err) {
    console.error('Помилка при завантаженні даних для редагування:', err);
    res.status(500).send('Помилка сервера');
  }
});

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

    res.redirect('/admin'); 
  } catch (err) {
    console.error('Помилка при оновленні правопорушення:', err);
    res.status(500).send('Не вдалося оновити правопорушення');
  }
});
router.get('/admin/crimes', async (req, res) => {
  try {
    const crimes = await Crime.find(); 
    res.json(crimes); 
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
    res.render('edit', { crime }); 
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
    res.redirect('/admin'); 
  } catch (err) {
    console.error(err);
    res.status(500).send('Не вдалося оновити правопорушення');
  }
});



router.post('/admin/crimes/delete', async (req, res) => {
  const { crimeId } = req.body;

  try {
    await Crime.findByIdAndDelete(crimeId);
    
    res.redirect('/admin');
  } catch (err) {
    console.error(err);
    res.redirect('/admin?error=true');
  }
});
router.get('/admin/crimes/search', async (req, res) => {
  const { username } = req.query;

  try {
    if (!username) {
      return res.json([]);
    }

    const crimes = await Crime.find({ issuedTo: { $regex: username, $options: 'i' } });
    res.json(crimes);
  } catch (err) {
    console.error(err);
    res.status(500).send('Виникла помилка при пошуку даних');
  }
});

module.exports = router;
