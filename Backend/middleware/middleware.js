const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const { validationResult, check } = require('express-validator');

// Middleware for logging HTTP requests
const requestLogger = morgan('dev');

// Middleware for security-related HTTP headers
const securityHeaders = helmet();

// Middleware for enabling CORS (Cross-Origin Resource Sharing)
const enableCors = cors({
  origin: '*', // Adjust as needed for your application's security requirements
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
});

// Middleware for parsing JSON and URL-encoded request bodies
const parseJson = bodyParser.json();
const parseUrlEncoded = bodyParser.urlencoded({ extended: true });

// Middleware for validation errors handling
const validationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Middleware for handling 404 errors
const handleNotFound = (req, res, next) => {
  res.status(404).json({ message: 'Not Found' });
};

// Middleware for handling general errors
const handleError = (err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal Server Error' });
};

// Exporting all middlewares
module.exports = {
  requestLogger,
  securityHeaders,
  enableCors,
  parseJson,
  parseUrlEncoded,
  validationErrors,
  handleNotFound,
  handleError,
};
