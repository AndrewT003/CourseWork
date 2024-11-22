// models/crime.js
const mongoose = require('mongoose');

const crimeSchema = new mongoose.Schema({
  crimeName: {  // Назва правопорушення
    type: String,
    required: true,
  },
  issuedTo: { // Кому видано
    type: String,
    required: true,
  },
  issuedBy: { // Хто видав
    type: String,
    required: true,
  },
  crimeDate: { // Дата правопорушення
    type: Date,
    required: true,
  },
  penalty: { // Накладене стягнення
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('Crime', crimeSchema);
