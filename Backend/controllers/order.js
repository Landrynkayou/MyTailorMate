const Order = require('../models/order');
const Client = require('../models/client');
const mongoose = require('mongoose');

exports.createOrder = async (req, res) => {
  try {
    const { clientId, orders } = req.body;

    if (!clientId || !orders || !Array.isArray(orders) || orders.length === 0) {
      return res.status(400).json({ message: 'Client ID and orders are required' });
    }

    if (!mongoose.Types.ObjectId.isValid(clientId)) {
      return res.status(400).json({ message: 'Invalid client ID' });
    }

    const invalidOrders = orders.filter(order => !order.items || !order.status || !order.createdAt);

    if (invalidOrders.length > 0) {
      return res.status(400).json({
        message: 'Some orders are missing required fields',
        invalidOrders
      });
    }

    // Create new orders
    const newOrders = orders.map(order => ({
      ...order,
      clientId
    }));

    // Save orders
    const savedOrders = await Order.insertMany(newOrders);

    // Optionally, you can update the client document to include the new orders
    await Client.findByIdAndUpdate(clientId, {
      $push: { orders: { $each: savedOrders.map(order => order._id) } }
    });

    res.status(201).json(savedOrders);
  } catch (error) {
    console.error('Error creating orders:', error.message);
    res.status(500).json({ message: 'Failed to create orders' });
  }
};

exports.getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getOrders = async (req, res) => {
  try {
    // Find orders by client ID
    const clientId = req.query.clientId; // Expect clientId to be sent as a query parameter
    if (!clientId) {
      return res.status(400).json({ message: 'Client ID is required' });
    }

    if (!mongoose.Types.ObjectId.isValid(clientId)) {
      return res.status(400).json({ message: 'Invalid client ID' });
    }

    const orders = await Order.find({ clientId }); // Fetch orders by client ID
    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error.message);
    res.status(500).json({ message: 'Failed to fetch orders' });
  }
};

exports.updateOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.toggleOrderStatus = async (req, res) => {
    try {
      const { orderId } = req.params;
      
      // Find the order by ID
      const order = await Order.findById(orderId);
      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }
  
      // Toggle the status
      order.status = order.status === 'Completed' ? 'Upcoming' : 'Completed';
      
      // Save the updated order
      await order.save();
  
      res.status(200).json(order);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  };
  
exports.deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json({ message: 'Order deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
