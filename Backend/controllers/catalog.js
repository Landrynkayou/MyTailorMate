const Catalog = require('../models/Catalog');

exports.createCatalog = async (req, res) => {
  try {
    const catalog = new Catalog(req.body);
    await catalog.save();
    res.status(201).json(catalog);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getCatalog = async (req, res) => {
  try {
    const catalog = await Catalog.findById(req.params.id);
    if (!catalog) return res.status(404).json({ message: 'Catalog not found' });
    res.json(catalog);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateCatalog = async (req, res) => {
  try {
    const catalog = await Catalog.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!catalog) return res.status(404).json({ message: 'Catalog not found' });
    res.json(catalog);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteCatalog = async (req, res) => {
  try {
    const catalog = await Catalog.findByIdAndDelete(req.params.id);
    if (!catalog) return res.status(404).json({ message: 'Catalog not found' });
    res.json({ message: 'Catalog deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
