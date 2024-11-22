const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const path = require('path');
const User = require('../models/user');
const router = express.Router();

// Видача сторінки реєстрації
router.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/pages/register.html'));
});

// Видача сторінки входу
router.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/pages/login.html'));
});

// Реєстрація нового користувача
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.send(`
      <script>
        alert('Будь ласка, заповніть всі поля');
        window.location.href = '/register';
      </script>
    `);
  }

  try {
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.send(`
        <script>
          alert('Користувач з таким email або username вже існує');
          window.location.href = '/register';
        </script>
      `);
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      role: 'user', // Встановлюємо роль за замовчуванням
    });

    await newUser.save();

    // Показуємо повідомлення про успіх і редирект на сторінку входу
    res.send(`
      <script>
        alert('Реєстрація успішна! Тепер ви можете увійти.');
        window.location.href = '/login';
      </script>
    `);
  } catch (error) {
    console.error('Помилка реєстрації:', error.message);
    res.send(`
      <script>
        alert('Помилка реєстрації, спробуйте ще раз');
        window.location.href = '/register';
      </script>
    `);
  }
});

// Авторизація користувача
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.send(`
        <script>
          alert('Користувач не знайдений');
          window.location.href = '/login';
        </script>
      `);
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.send(`
        <script>
          alert('Невірний пароль');
          window.location.href = '/login';
        </script>
      `);
    }

    // Створення JWT
    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Відповідь і редирект на відповідну сторінку залежно від ролі
    if (user.role === 'admin') {
      res.redirect('/admin'); // Сторінка адміністрування
    } else {
      res.redirect('/user'); // Сторінка звичайного користувача
    }
  } catch (error) {
    res.send(`
      <script>
        alert('Помилка авторизації, спробуйте ще раз');
        window.location.href = '/login';
      </script>
    `);
  }
});

module.exports = router;
