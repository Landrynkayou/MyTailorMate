const express = require('express');
const router = express.Router();

// Import controllers
const client = require('../controllers/client');
const tailor= require('../controllers/tailor');
const admin = require('../controllers/admin');

// Client Routes
router.post('/client', client.createClient);
router.post('/clients/:clientId/appointments', client.bookAppointment);
router.post('/clients/:clientId/photos', client.uploadPhoto);
router.post('/clients/:clientId/chat-tailor', client.chatTailor); // Placeholder route
router.delete('/clients/:clientId', client.deleteClient);

// Tailor Routes
router.post('/tailors', tailor.createTailor);
router.get('/tailors/:clientId/measurements', tailor.viewMeasurements);
router.post('/tailors/:clientId/measurements', tailor.storeMeasurements);
router.post('/tailors/:tailorId/chat-client', tailor.chatClient); // Placeholder route
router.delete('/tailors/:tailorId', tailor.deleteTailor);

// Admin Routes
router.post('/admins', admin.createAdmin);
router.get('/admins/users', admin.viewUsers);
router.delete('/admins/users/:userId', admin.deleteUser);
router.delete('/admins/:adminId', admin.deleteAdmin);

module.exports = router;
