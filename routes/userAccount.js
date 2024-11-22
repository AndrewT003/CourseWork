const express = require('express'); 
const path = require('path');
const router = express.Router(); 

router.get('/user', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/pages/userAccount.html'));
});


module.exports = router; 