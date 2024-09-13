const Appointment = require('../models/Appointment');

// Create a new appointment
exports.createAppointment = async (req, res) => {
  try {
    const appointment = new Appointment(req.body); // Assuming req.body contains all the necessary appointment details
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
    const appointment = await Appointment.findByIdAndUpdate(req.params.id, req.body, { new: true });
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
