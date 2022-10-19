const mongoose = require('mongoose')

const validationStringSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  string: String,
})

const ValidationString = mongoose.model(
  'ValidationString',
  validationStringSchema
)

module.exports = ValidationString
