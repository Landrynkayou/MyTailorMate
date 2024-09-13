const mongoose = require('mongoose');
const Schema = mongoose.Schema;

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

// Create the Order model
const Order = mongoose.model('Order', orderSchema);

// Export the model
module.exports = Order;
