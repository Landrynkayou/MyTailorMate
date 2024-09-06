const Client = require('../models/client');
const Appointment = require('../models/Appointment');
const Photo = require('../models/photo');

exports.createClient = async (req, res) => {
  try {
    const client = new Client(req.body);
    await client.save();
    res.status(201).json(client);
  } catch (error) {
    res.status(500).json({ message: error.message });
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
