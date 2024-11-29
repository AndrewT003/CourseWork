const mongoose = require('mongoose');

const crimeSchema = new mongoose.Schema({
  crimeName: {  
    type: String,
    required: true,
  },
  issuedTo: { 
    type: String,
    required: true,
  },
  issuedBy: { 
    type: String,
    required: true,
  },
  crimeDate: { 
    type: Date,
    required: true,
  },
  penalty: { 
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('Crime', crimeSchema);
