const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the measurement schema
const measurementSchema = new Schema({
  clientId: { type: Schema.Types.ObjectId, ref: 'Client', required: true },
  height: { type: Number, required: true }, // Number instead of String
  weight: { type: Number, required: true },
  chestSize: { type: Number, required: true },
  waistSize: { type: Number, required: true },
  hipSize: { type: Number, required: true },
});

// Define the order schema
const orderSchema = new Schema({
  clientId: { type: Schema.Types.ObjectId, ref: 'Client', required: true },
  items: { type: String, required: true },
  status: { 
    type: String, 
    required: true, 
    enum: ['Pending', 'Completed', 'Cancelled'], 
    default: 'Pending' 
  },
  createdAt: { type: Date, required: true, default: Date.now },
  finishDate: {
    type: Date,
    validate: {
      validator: function(value) {
        return this.status !== 'Completed' || value != null;
      },
      message: 'Finish date is required if the status is Completed',
    },
  },
});

// Define the client schema
const clientSchema = new Schema({
  userID: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  measurements: [measurementSchema], // Array of measurements
  orders: [orderSchema], // Array of orders
});

// Create the Client model
const Client = mongoose.model('Client', clientSchema);

module.exports = Client;
