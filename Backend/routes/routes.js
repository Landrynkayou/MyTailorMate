const express = require('express');
const router = express.Router();

// Import controllers
const client = require('../controllers/client');
const tailor = require('../controllers/tailor');
const admin = require('../controllers/admin');
const authController = require('../controllers/authController'); // Import your auth controller

// Client Routes
router.post('/clients/signup', authController.signup);  // Client signup
router.post('/clients/login', authController.login); // Client login
router.post('/clients/:clientId/appointments', client.bookAppointment);
router.post('/clients/:clientId/photos', client.uploadPhoto);
router.post('/clients/:clientId/chat-tailor', client.chatTailor); // Placeholder route
router.delete('/clients/:clientId', client.deleteClient);

// Tailor Routes
router.post('/tailors/signup', authController.signup);  // Tailor signup
router.post('/tailors/login', authController.login); // Tailor login
router.get('/tailors/:tailorId/measurements', tailor.viewMeasurements);
router.post('/tailors/:tailorId/measurements', tailor.storeMeasurements);
router.post('/tailors/:tailorId/chat-client', tailor.chatClient); // Placeholder route
router.delete('/tailors/:tailorId', tailor.deleteTailor);

// Admin Routes
router.post('/admins/signup', authController.signup);  // Admin signup
router.post('/admins/login', authController.login); // Admin login
router.get('/admins/users', admin.viewUsers);
router.delete('/admins/users/:userId', admin.deleteUser);
router.delete('/admins/:adminId', admin.deleteAdmin);

module.exports = router;
