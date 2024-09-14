const express = require('express');
const router = express.Router();

// Import controllers
const clientController = require('../controllers/client');
const tailorController = require('../controllers/tailor');
const adminController = require('../controllers/admin');
const authController = require('../controllers/authController');
const appointmentController = require('../controllers/appointment');
const orderController = require('../controllers/order');
const measurementController = require('../controllers/measurement');
const notificationController = require('../controllers/notification'); 
const auth = require('../middleware/auth'); // Import JWT auth middleware
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

// Public routes (no authentication required)
router.post('/reset-password', authController.forgotPassword);

// Signup routes
router.post('/signup', authController.signup);  // Client signup
   // Admin signup

// Login routes
router.post('/login', authController.loginUser);    // Client login
 // Admin login

// Protected routes (authentication required)

// Measurement Routes
router.route('/measurements')
  .post(auth, measurementController.createMeasurements)
  .get(auth, measurementController.getMeasurements);

router.route('/measurements/:measurementId')
  .put(auth, measurementController.updateMeasurements)
  .delete(auth, measurementController.deleteMeasurements);

// Order Routes
router.post('/orders', auth, orderController.createOrder);
router.get('/orders', auth, orderController.getOrders);

// Get a specific order by ID
router.get('/orders/:orderId', auth, orderController.getOrder);

// Update a specific order by ID
router.put('/orders/:orderId', auth, orderController.updateOrder);

// Delete a specific order by ID
router.delete('/orders/:orderId', auth, orderController.deleteOrder);

// Toggle the status of a specific order by ID
router.patch('/orders/:orderId/status', auth, orderController.toggleOrderStatus);
// Appointment Routes
router.route('/appointments')
.post(auth, upload.single('image'), appointmentController.createAppointment)
  .get(auth, appointmentController.getAppointments);

router.route('/appointments/:appointmentId')
  .get(auth, appointmentController.getAppointment)
  .put(auth, upload.single('image'), appointmentController.updateAppointment)
  .delete(auth, appointmentController.deleteAppointment);

router.patch('/appointments/:id/validate', auth, appointmentController.validateAppointment);

// Client Routes
router.route('/clients')
  .get(auth, clientController.getAllClients)
  .post(auth, clientController.createClient);

router.route('/clients/:id')
  .get(auth, clientController.getClients)
  .delete(auth, clientController.deleteClient);

  router.patch('/clients/:clientsId/orders/status', auth, clientController.toggleOrderStatus);

router.post('/clients/:clientId/appointments', auth, clientController.bookAppointment);
router.post('/clients/:clientId/photos', auth, clientController.uploadPhoto);
router.post('/clients/:clientId/chat-tailor', auth, clientController.chatTailor); // Placeholder route

// Tailor Routes
router.route('/tailors/:tailorId/measurements')
  .get(auth, tailorController.viewMeasurements)
  .post(auth, tailorController.storeMeasurements);

router.post('/tailors', auth ,tailorController.createTailor); // Placeholder route

router.get('/tailors', auth ,tailorController.getAllTailors); // Placeholder route
router.post('/tailors/:tailorId/chat-client', auth, tailorController.chatClient); // Placeholder route
router.delete('/tailors/:tailorId', auth, tailorController.deleteTailor);

// Admin Routes
router.route('/admins/users')
  .get(auth, adminController.viewUsers);

router.route('/admins/users/:userId')
  .delete(auth, adminController.deleteUser);

router.delete('/admins/:adminId', auth, adminController.deleteAdmin);

router.route('/notifications')
  .post(auth, notificationController.createNotification) // Create a new notification
  .get(auth, notificationController.getAllNotifications); // Get all notifications

router.route('/notifications/:id')
  .get(auth, notificationController.getNotification) // Get a specific notification
  .put(auth, notificationController.updateNotification) // Update a specific notification
  .delete(auth, notificationController.deleteNotification); // Delete a specific notification

module.exports = router;
