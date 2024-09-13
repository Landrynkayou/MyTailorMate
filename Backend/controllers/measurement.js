const Measurements = require('../models/measurements');

// Create new measurements
exports.createMeasurements = async (req, res) => {
    try {
      const { clientId, measurements } = req.body;
  
      if (!clientId || !measurements) {
        return res.status(400).json({ message: 'Client ID and measurements are required' });
      }
  
      // Assuming you have a reference to client in your measurements schema
      const newMeasurements = measurements.map(measurement => ({
        ...measurement,
        clientId
      }));
  
      // Save measurements
      const savedMeasurements = await Measurements.insertMany(newMeasurements);
  
      res.status(201).json(savedMeasurements);
    } catch (error) {
      console.error('Error creating measurements:', error.message);
      res.status(500).json({ message: 'Failed to create measurements' });
    }
  };
exports.getMeasurements = async (req, res) => {
  try {
    const measurements = await Measurements.findById(req.params.id);
    if (!measurements) return res.status(404).json({ message: 'Measurements not found' });
    res.json(measurements);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateMeasurements = async (req, res) => {
  try {
    const measurements = await Measurements.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!measurements) return res.status(404).json({ message: 'Measurements not found' });
    res.json(measurements);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteMeasurements = async (req, res) => {
  try {
    const measurements = await Measurements.findByIdAndDelete(req.params.id);
    if (!measurements) return res.status(404).json({ message: 'Measurements not found' });
    res.json({ message: 'Measurements deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
