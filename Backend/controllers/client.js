const Client = require('../models/client');
const Order = require('../models/order');
const Measurement = require('../models/measurements'); // Import Measurement model

exports.createClient = async (req, res) => {
    try {
        // Log the request body for debugging
        console.log('Request Body:', req.body);

        // Ensure userID is provided in the request body
        if (!req.body.userID) {
            return res.status(400).json({ message: 'UserID is required' });
        }

        // Create and save the client
        const client = new Client({
            ...req.body,
            userID: req.body.userID, // Include userID in the client creation
        });
        await client.save();

        // Create an order for the client if provided in the request body
        if (req.body.orders) {
            for (const orderData of req.body.orders) {
                const order = new Order({
                    clientId: client._id, // Associate the order with the newly created client
                    items: orderData.item || '', // Default to empty if not provided
                    status: orderData.status || 'Pending', // Default to 'Pending' if not provided
                });
                await order.save();
            }
        }

        // Validate and save measurements if provided in the request body
        if (req.body.measurements) {
            // Ensure measurements is an array of objects
            if (!Array.isArray(req.body.measurements)) {
                return res.status(400).json({ message: 'Measurements must be an array of objects' });
            }

            // Validate each measurement object
            const requiredFields = ['height', 'weight', 'chestSize', 'waistSize', 'hipSize'];
            for (const measurement of req.body.measurements) {
                if (typeof measurement !== 'object') {
                    return res.status(400).json({ message: 'Each measurement must be an object' });
                }

                for (const field of requiredFields) {
                    if (!measurement[field]) {
                        return res.status(400).json({ message: `${field} is required in each measurement` });
                    }
                }

                // Add clientId to each measurement
                measurement.clientId = client._id;

                // Save measurement
                const measurements = new Measurement(measurement);
                await measurements.save();
            }
        }

        res.status(201).json({ client });
    } catch (error) {
        console.error('Error creating client:', error);  // Log error details for debugging
        res.status(500).json({ message: error.message });
    }
};

exports.getClients = async (req, res) => {
    try {
        const { clientId } = req.query;

        if (clientId) {
            // Fetch client by clientId
            const client = await Client.findById(clientId);
            if (!client) {
                return res.status(404).json({ message: 'Client not found' });
            }
            const orders = await Order.find({ clientId: client._id });
            return res.json(client,orders);
        }

        // If clientId is not provided
        return res.status(400).json({ message: 'Please provide a clientId' });
    } catch (error) {
        console.error('Error fetching client:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getAllClients = async (req, res) => {
    try {
        const clients = await Client.find();
        res.json(clients);
    } catch (error) {
        console.error('Error fetching clients:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.bookAppointment = async (req, res) => {
    try {
        const appointment = new Appointment(req.body);
        appointment.client = req.params.clientId;
        await appointment.save();
        res.status(201).json(appointment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.uploadPhoto = async (req, res) => {
    try {
        const photo = new Photo(req.body);
        photo.client = req.params.clientId;
        await photo.save();
        res.status(201).json(photo);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.chatTailor = async (req, res) => {
    // Implement chat functionality between client and tailor
};

exports.deleteClient = async (req, res) => {
    try {
        const client = await Client.findByIdAndDelete(req.params.clientId);
        if (!client) return res.status(404).json({ message: 'Client not found' });
        res.json({ message: 'Client deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.toggleOrderStatus = async (req, res) => {
    try {
        const { clientId } = req.params; // Assuming you only have clientId

        // Find the client by ID
        const client = await Client.findById(clientId);
        if (!client) {
            return res.status(404).json({ message: 'Client not found' });
        }

        // Find orders for the client
        const orders = await Order.find({ clientId: client._id });
        if (orders.length === 0) {
            return res.status(404).json({ message: 'No orders found for this client' });
        }

        // Update the status of each order
        const updatedOrders = [];
        for (const order of orders) {
            const newStatus = order.status === 'Completed' ? 'Upcoming' : 'Completed';
            order.status = newStatus;
            await order.save();
            updatedOrders.push(order);
        }

        res.status(200).json({ updatedOrders });
    } catch (error) {
        console.error('Error toggling order status:', error);
        res.status(500).json({ message: error.message });
    }
};
