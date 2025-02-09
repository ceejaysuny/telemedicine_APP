// routes/admin.js
const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('../config/db');
const router = express.Router();
const authMiddleware = require('../middleware/auth'); // Import the middleware

// Register admin
router.post('/register', async (req, res) => {
    const { first_name, last_name, email, password, phone } = req.body;

    try {
        console.log('Received input:', req.body); // Log input data
        // Check if the email already exists
        const [existingAdmin] = await db.execute('SELECT * FROM Admin WHERE email = ?', [email]);
        if (existingAdmin.length > 0) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        // Hash the password
        const password_hash = await bcrypt.hash(password, 10);

        // Insert admin into the database
        await db.execute('INSERT INTO Admin (first_name, last_name, email, password_hash, phone) VALUES (?, ?, ?, ?, ?)', 
            [first_name, last_name, email, password_hash, phone]);

        res.status(201).json({ message: 'Admin registered successfully' });
    } catch (err) {
        console.error(err); // Log error to server console
        res.status(500).json({ error: err.message });
    }
});

// Admin login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if the admin exists
        const [admin] = await db.execute('SELECT * FROM Admin WHERE email = ?', [email]);
        if (admin.length === 0) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // Compare the password
        const isMatch = await bcrypt.compare(password, admin[0].password_hash);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // Start the session after successful login
        req.session.user = { id: admin[0].id, email: admin[0].email, isAdmin: true, role: 'admin' };
        res.json({ message: 'Login successful', user: req.session.user });
    } catch (err) {
        console.error(err); // Log error to server console
        res.status(500).json({ error: err.message });
    }
});

// View admin profile (only for logged-in admins)
router.get('/profile', authMiddleware, async (req, res) => {
    if (!req.session.user || !req.session.user.isAdmin) {
        return res.status(401).json({ message: 'Please log in to view your profile' });
    }

    try {
        const [admin] = await db.execute('SELECT first_name, last_name, phone, email FROM Admin WHERE id = ?', [req.session.user.id]);

        if (admin.length === 0) {
            return res.status(404).json({ message: 'Admin not found' });
        }

        res.json(admin[0]);
    } catch (err) {
        console.error(err); // Log error to server console
        res.status(500).json({ error: err.message });
    }
});

// Update admin profile
router.put('/profile', authMiddleware, async (req, res) => {
    if (!req.session.user || !req.session.user.isAdmin) {
        return res.status(401).json({ message: 'Please log in to update your profile' });
    }

    const { first_name, last_name, phone } = req.body;

    try {
        await db.execute('UPDATE Admin SET first_name = ?, last_name = ?, phone = ? WHERE id = ?',
            [first_name, last_name, phone, req.session.user.id]);

        res.json({ message: 'Profile updated successfully' });
    } catch (err) {
        console.error(err); // Log error to server console
        res.status(500).json({ error: err.message });
    }
});

// Middleware to check if the user is an admin
const adminAuth = (req, res, next) => {
    if (req.session.user && req.session.user.isAdmin) {
        next();
    } else {
        res.status(403).json({ message: 'Access denied' });
    }
};

// List all patients (admin only)
router.get('/patients', adminAuth, async (req, res) => {
    try {
        const [patients] = await db.execute('SELECT id, first_name, last_name, email, phone, date_of_birth, gender, address FROM Patients');
        res.json(patients);
    } catch (err) {
        console.error(err); // Log error to server console
        res.status(500).json({ error: err.message });
    }
});


/*

// Create a new doctor (admin only)
router.post('/doctors', adminAuth, async (req, res) => {
    const { first_name, last_name, email, password, confirmPassword, phone, specialization, license_number, address, schedule } = req.body;
    try {
		console.log('Received input:', req.body); // Log input data
        await db.execute('INSERT INTO Doctors (first_name, last_name, email, password_hash, phone, specialization, license_number, address, schedule) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', 
            [first_name, last_name, email, password, phone, specialization, license_number, address, schedule]);
        res.status(201).json({ message: 'Doctor added successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

*/






// Create a new doctor (admin only)
router.post('/doctors', adminAuth, async (req, res) => {
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


///////////new ///////////////////
// Get specific Doctor
router.get('/specific_doctors/:id', adminAuth, async (req, res) => {
    const doctorId = req.params.id;
    try {
        const [doctor] = await db.execute('SELECT * FROM Doctors WHERE id = ?', [doctorId]);
        if (doctor.length > 0) {
            res.json(doctor[0]);
        } else {
            res.status(404).json({ message: 'Doctor not found' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// Get list of doctors
router.get('/doctors', async (req, res) => {
    try {
        const [doctors] = await db.execute('SELECT id, first_name, last_name, specialization, phone, schedule FROM Doctors');
        res.json(doctors);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
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


/*

// Delete doctor (admin only)
router.delete('/delete/doctors/:id', adminAuth, async (req, res) => {
    const doctorId = req.params.id;

    try {
		console.log('Received input:', req.params.id); // Log input data
        await db.execute('DELETE FROM Doctors WHERE id = ?', [doctorId]);
        res.json({ message: 'Doctor deleted successfully' });
    } catch (err) {
		console.error('Error deleting doctor:', err.message); // Log error
        res.status(500).json({ error: err.message });
    }
});
*/

// Delete doctor (admin only)
router.put('/delete/doctors/:id', adminAuth, async (req, res) => {
    const doctorId = req.params.id;

    try {
		console.log('Received input:', req.params.id); // Log input data
        await db.execute('DELETE FROM Doctors WHERE id = ?', [doctorId]);
        res.json({ message: 'Doctor deleted successfully' });
    } catch (err) {
		console.error('Error deleting doctor:', err.message); // Log error
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
