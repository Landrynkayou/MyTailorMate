const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the measurement schema
const measurementSchema = new Schema({
  clientId: { type: Schema.Types.ObjectId, ref: 'Client', required: true },
  height: { type: Number, required: true },
  weight: { type: Number, required: true },
  chestSize: { type: Number, required: true },
  waistSize: { type: Number, required: true },
  hipSize: { type: Number, required: true },
});

// Create the Measurement model
const Measurement = mongoose.model('Measurement', measurementSchema);

// Export the model
module.exports = Measurement;
