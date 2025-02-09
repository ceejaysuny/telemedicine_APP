// routes/patients.js
const express = require('express');
//const bcrypt = require('bcryptjs');
const db = require('../config/db');
const router = express.Router();
const authMiddleware = require('../middleware/auth'); // Import the middleware

// Register patient
router.post('/register', async (req, res) => {
    const { first_name, last_name, email, password, phone, date_of_birth, gender, address } = req.body;

    try {
        // Check if the email already exists
        const [existingUser] = await db.execute('SELECT * FROM Patients WHERE email = ?', [email]);
        if (existingUser.length > 0) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        // Hash the password
        const password_hash = await bcrypt.hash(password, 10);

        // Insert patient into the database
        await db.execute('INSERT INTO Patients (first_name, last_name, email, password_hash, phone, date_of_birth, gender, address) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', 
            [first_name, last_name, email, password_hash, phone, date_of_birth, gender, address]);

        res.status(201).json({ message: 'Patient registered successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// Patient login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if the patient exists
        const [user] = await db.execute('SELECT * FROM Patients WHERE email = ?', [email]);
        if (user.length === 0) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // Compare the password
        const isMatch = await bcrypt.compare(password, user[0].password_hash);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // Start the session after successful login
        req.session.user = { id: user[0].id, email: user[0].email };
        res.json({ message: 'Login successful', user: req.session.user });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

//////////////////////////////////

// View patient profile (only for logged-in patients)
router.get('/profile', async (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ message: 'Please log in to view your profile' });
    }

    try {
        const [patient] = await db.execute('SELECT first_name, last_name, phone, date_of_birth, gender, address FROM Patients WHERE id = ?', [req.session.user.id]);

        if (patient.length === 0) {
            return res.status(404).json({ message: 'Patient not found' });
        }

        res.json(patient[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/////////////////////////

// Update patient profile
router.put('/profile', async (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ message: 'Please log in to update your profile' });
    }

    const { first_name, last_name, phone, date_of_birth, gender, address } = req.body;

    try {
        await db.execute('UPDATE Patients SET first_name = ?, last_name = ?, phone = ?, date_of_birth = ?, gender = ?, address = ? WHERE id = ?',
            [first_name, last_name, phone, date_of_birth, gender, address, req.session.user.id]);

        res.json({ message: 'Profile updated successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Example of a protected route
router.get('/profile', authMiddleware, async (req, res) => {
    // Access the user data from req.session and return the profile
    const user = req.session.user;
    // Logic for fetching and returning the patient's profile
    res.json({ message: 'Profile information', user });
});

// Logout
router.post('/logout', (req, res) => {
    if (!req.session.user) {
        return res.status(400).json({ message: 'No user logged in' });
    }
    req.session.destroy(err => {
        if (err) {
            return res.status(500).json({ message: 'Logout failed' });
        }
        res.clearCookie('connect.sid');
        res.json({ message: 'Logout successful' });
    });
});


// Delete patient account
router.delete('/profile', authMiddleware, async (req, res) => {
    try {
        await db.execute('DELETE FROM Patients WHERE id = ?', [req.session.user.id]);
        req.session.destroy();
        res.json({ message: 'Account deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// Book appointment
router.post('/appointments', authMiddleware, async (req, res) => {
    const { doctor_id, appointment_date, appointment_time } = req.body;

    try {
        await db.execute('INSERT INTO Appointments (patient_id, doctor_id, appointment_date, appointment_time, status) VALUES (?, ?, ?, ?, ?)', 
            [req.session.user.id, doctor_id, appointment_date, appointment_time, 'scheduled']);
        res.status(201).json({ message: 'Appointment booked successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// List of appointments (admin, doctor, or patient)
router.get('/appointments', authMiddleware, async (req, res) => {
    let query = '';
    let params = [];

    if (req.session.user.role === 'admin') {
        query = 'SELECT * FROM Appointments';
    } else if (req.session.user.role === 'doctor') {
        query = 'SELECT * FROM Appointments WHERE doctor_id = ?';
        params = [req.session.user.id];
    } else {
        query = 'SELECT * FROM Appointments WHERE patient_id = ?';
        params = [req.session.user.id];
    }

    try {
        const [appointments] = await db.execute(query, params);
        res.json(appointments);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// Update appointment (reschedule or cancel)
router.put('/appointments/:id', authMiddleware, async (req, res) => {
    const { appointment_date, appointment_time, status } = req.body;
    const appointmentId = req.params.id;

    try {
        await db.execute('UPDATE Appointments SET appointment_date = ?, appointment_time = ?, status = ? WHERE id = ?', 
            [appointment_date, appointment_time, status, appointmentId]);
        res.json({ message: 'Appointment updated successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// Cancel appointment
router.put('/appointments/:id/cancel', authMiddleware, async (req, res) => {
    const appointmentId = req.params.id;

    try {
        await db.execute('UPDATE Appointments SET status = ? WHERE id = ?', ['canceled', appointmentId]);
        res.json({ message: 'Appointment canceled successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});



const { check, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');

// Patient registration route with validation
router.post('/register', [
    check('first_name').notEmpty().withMessage('First name is required'),
    check('last_name').notEmpty().withMessage('Last name is required'),
    check('email').isEmail().withMessage('Please enter a valid email'),
    check('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long'),
    check('phone').matches(/^[0-9]{10}$/).withMessage('Please enter a valid 10-digit phone number'),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    // If validation passes, continue with registration logic
    try {
        const { first_name, last_name, email, password, phone } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert new patient data into MySQL database here
        // ...
        await db.execute('INSERT INTO Patients (first_name, last_name, email, password_hash, phone) VALUES (?, ?, ?, ?, ?)', 
            [first_name, last_name, email, hashedPassword, phone]);

        res.status(201).json({ message: 'Patient registered successfully' });
    } catch (error) {
        console.error('Error registering patient:', error);  // This will log the error in the console
        res.status(500).json({ message: 'Error registering patient', error: error.message });
    }
});

module.exports = router;

