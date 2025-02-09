// routes/doctors.js
const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('../config/db');
const router = express.Router();
const authMiddleware = require('../middleware/auth'); // Import the middleware


// // Register doctor
router.post('/register/doctors', async (req, res) => {
    const { first_name, last_name, email, password, confirmPassword, phone, specialization, license_number, address, schedule } = req.body;
    try {
        console.log('Received input:', req.body); // Log input data
		
		// Check if the email already exists
        const [existingDoctor] = await db.execute('SELECT * FROM Doctors WHERE email = ?', [email]);
        if (existingDoctor.length > 0) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        // Hash the password
        const password_hash = await bcrypt.hash(password, 10);

        await db.execute('INSERT INTO Doctors (first_name, last_name, email, password_hash, phone, specialization, license_number, address, schedule) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [first_name, last_name, email, password_hash, phone, specialization, license_number, address, schedule]);

        res.status(201).json({ message: 'Doctor added successfully' });
    } catch (err) {
        console.error('Error registering doctor:', err.message); // Log error
        res.status(500).json({ error: err.message });
    }
});

/*
// Register doctor
router.post('/register', async (req, res) => {
    const { first_name, last_name, email, password, phone, specialization, license_number, address } = req.body;

    try {
        // Check if the email already exists
        const [existingDoctor] = await db.execute('SELECT * FROM Doctors WHERE email = ?', [email]);
        if (existingDoctor.length > 0) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        // Hash the password
        const password_hash = await bcrypt.hash(password, 10);

        // Insert doctor into the database
        await db.execute('INSERT INTO Doctors (first_name, last_name, email, password_hash, phone, specialization, license_number, address) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', 
            [first_name, last_name, email, password_hash, phone, specialization, license_number, address]);

        res.status(201).json({ message: 'Doctor registered successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

*/

// Doctor login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if the doctor exists
        const [doctor] = await db.execute('SELECT * FROM Doctors WHERE email = ?', [email]);
        if (doctor.length === 0) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // Compare the password
        const isMatch = await bcrypt.compare(password, doctor[0].password_hash);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // Start the session after successful login
        req.session.user = { id: doctor[0].id, email: doctor[0].email, role: 'doctor' };
        res.json({ message: 'Login successful', user: req.session.user });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// View doctor profile (only for logged-in doctors)
router.get('/profile', async (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ message: 'Please log in to view your profile' });
    }

    try {
        const [doctor] = await db.execute('SELECT first_name, last_name, email, phone, specialization, license_number, address, schedule FROM Doctors WHERE id = ?', [req.session.user.id]);

        if (doctor.length === 0) {
            return res.status(404).json({ message: 'Doctor not found' });
        }

        res.json(doctor[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update doctor profile
router.put('/update/profile', async (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ message: 'Please log in to update your profile' });
    }

    const { first_name, last_name, phone, specialization, license_number, address, schedule } = req.body;

    try {
		console.log('Received input:', req.body); // Log input data
		console.log('req.session.user.id:', req.session.user.id); // Log input data
        await db.execute('UPDATE Doctors SET first_name = ?, last_name = ?, phone = ?, specialization = ?, license_number = ?, address = ?, schedule = ? WHERE id = ?',
            [first_name, last_name, phone, specialization, license_number, address, schedule, req.session.user.id]);

        res.json({ message: 'Profile updated successfully' });
    } catch (err) {
		console.error('Error registering doctor:', err.message); // Log error
        res.status(500).json({ error: err.message });
    }
});

// Example of a protected route
router.get('/profile', authMiddleware, async (req, res) => {
    const user = req.session.user;
    res.json({ message: 'Profile information', user });
});

// Update doctor profile or schedule (admin or doctor)
router.put('/doctors/:id', authMiddleware, async (req, res) => {
    const { first_name, last_name, specialization, phone, schedule } = req.body;
    const doctorId = req.params.id;

    try {
        await db.execute('UPDATE Doctors SET first_name = ?, last_name = ?, specialization = ?, phone = ?, schedule = ? WHERE id = ?', 
            [first_name, last_name, specialization, phone, schedule, doctorId]);
        res.json({ message: 'Doctor updated successfully' });
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



module.exports = router;
