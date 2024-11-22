const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

const app = express();

dotenv.config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Підключено до бази даних MongoDB'))
  .catch(err => console.log('Помилка підключення до бази даних:', err));

app.use(express.static(path.join(__dirname, 'public')));

const authRoutes = require('./routes/auth');
const userAccountRoutes = require('./routes/userAccount'); 
const adminAccountRoutes = require('./routes/adminAccount'); 


app.use(authRoutes); 
app.use(userAccountRoutes); 
app.use(adminAccountRoutes); 


app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/pages/index.html'));
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Сервер працює на порту ${PORT}`);
});
