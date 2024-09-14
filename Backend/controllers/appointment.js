const Appointment = require('../models/Appointment');
const upload = require('../middleware/uploads'); // Assuming you have configured Multer in the middleware
const path = require('path');

// Create a new appointment (with image upload)
exports.createAppointment = async (req, res) => {
  try {
    // Handle the image file if provided
    let imagePath;
    if (req.file) {
      imagePath = req.file.path; // This will be the uploaded image's path
      imageUrl = `uploads/${path.basename(imagePath)}`;
    }

    // Create new appointment using the request body and the image path
    const appointmentData = {
      ...req.body, // Assuming req.body contains the necessary fields like clientId, date, time, details, etc.
      image: imagePath || '', // Add the image path if available
    };

    const appointment = new Appointment(appointmentData);
    await appointment.save();
    res.status(201).json(appointment);
  } catch (error) {
    console.error('Error creating appointment:', error.message);
    res.status(500).json({ message: error.message });
  }
};

// Get all appointments (with optional user ID filter)
exports.getAppointments = async (req, res) => {
  try {
    // Extract userId from query parameters, if provided
    const { userId } = req.query;
    let query = {};

    if (userId) {
      query.userId = userId; // Filter by userId if provided
    }

    const appointments = await Appointment.find(query); // Fetch appointments based on query
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single appointment by ID
exports.getAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) return res.status(404).json({ message: 'Appointment not found' });
    res.json(appointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update an appointment
exports.updateAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = { ...req.body };

    // Check if a new image is being uploaded
    if (req.file) {
      updatedData.image = req.file.path; // Update image path if a new image is uploaded
    }

    const appointment = await Appointment.findByIdAndUpdate(id, updatedData, { new: true });
    if (!appointment) return res.status(404).json({ message: 'Appointment not found' });
    res.json(appointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Validate an appointment
exports.validateAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    console.log('Appointment ID:', id); // Log to confirm the ID is being received
    if (!id) return res.status(400).json({ message: 'Appointment ID is required' });

    const appointment = await Appointment.findById(id);
    if (!appointment) return res.status(404).json({ message: 'Appointment not found' });

    appointment.validated = true;
    appointment.status = 'confirmed';
    await appointment.save();

    res.json({ message: 'Appointment validated', appointment });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete an appointment
exports.deleteAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndDelete(req.params.id);
    if (!appointment) return res.status(404).json({ message: 'Appointment not found' });
    res.json({ message: 'Appointment deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
