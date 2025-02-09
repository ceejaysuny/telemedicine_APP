// app.js
require('dotenv').config();
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const patientsRouter = require('./routes/patients');
const doctorsRouter = require('./routes/doctors');
const appointmentsRouter = require('./routes/appointments');
const adminRouter = require('./routes/admin');

const app = express();
// Serve static files from the 'public' folder
app.use(express.static('public'));
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Session middleware
// app.js
//app.use(session({
  //  secret: 'secret_key', // Use a strong secret key in production
  //  resave: false,
   // saveUninitialized: true,
  //  cookie: { secure: false } // Set to true when using HTTPS
//}));

// Session middleware
app.use(session({
    secret: 'secret_key',
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: process.env.NODE_ENV === 'production', // Only true in production
        httpOnly: true, // Helps prevent XSS
        sameSite: 'strict' // Helps prevent CSRF
    }
}));


// Routes
app.use('/patients', patientsRouter);
app.use('/doctors', doctorsRouter);
app.use('/appointments', appointmentsRouter);
app.use('/admin', adminRouter);

// Start server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
