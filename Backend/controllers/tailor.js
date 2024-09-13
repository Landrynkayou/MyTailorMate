const Tailor = require('../models/tailor');
const Measurements = require('../models/measurements');
const Client = require('../models/client');

exports.createTailor = async (req, res) => {
  try {
    const tailor = new Tailor(req.body);
    await tailor.save();
    res.status(201).json(tailor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.getAllTailors = async (req, res) => {
    try {
      const tailors = await Tailor.find();
      res.json(tailors);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
exports.getTailor = async (req, res) => {
    try {
      const tailor = await Tailor.findById(req.params.tailorId);
      if (!tailor) {
        return res.status(404).json({ message: 'Tailor not found' });
      }
      res.json(tailor);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

exports.viewMeasurements = async (req, res) => {
  try {
    const measurements = await Measurements.find({ clientId: req.params.clientId });
    res.json(measurements);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.storeMeasurements = async (req, res) => {
  try {
    const measurements = new Measurements(req.body);
    measurements.client = req.params.clientId;
    await measurements.save();
    res.status(201).json(measurements);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.chatClient = async (req, res) => {
  // Implement chat functionality between tailor and client
};

exports.deleteTailor = async (req, res) => {
  try {
    const tailor = await Tailor.findByIdAndDelete(req.params.tailorId);
    if (!tailor) return res.status(404).json({ message: 'Tailor not found' });
    res.json({ message: 'Tailor deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
