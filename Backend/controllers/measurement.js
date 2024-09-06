const Measurements = require('../models/measurements');

exports.createMeasurements = async (req, res) => {
  try {
    const measurements = new Measurements(req.body);
    await measurements.save();
    res.status(201).json(measurements);
  } catch (error) {
    res.status(500).json({ message: error.message });
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
