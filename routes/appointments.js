// routes/appointments.js
const express = require('express');
const db = require('../config/db');
const router = express.Router();
const authMiddleware = require('../middleware/auth'); // Import the middleware

// Create an appointment
router.post('/', authMiddleware, async (req, res) => {
    const { doctor_id, patient_id, appointment_date, reason, status } = req.body;

    try {
        // Insert appointment into the database
        await db.execute('INSERT INTO Appointments (doctor_id, patient_id, appointment_date, reason, status) VALUES (?, ?, ?, ?, ?)', 
            [doctor_id, patient_id, appointment_date, reason, status]);

        res.status(201).json({ message: 'Appointment created successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// View all appointments for a logged-in user (patient or doctor)
router.get('/', authMiddleware, async (req, res) => {
    try {
        let appointments;

        // Check if the user is a doctor or a patient and fetch relevant appointments
        if (req.session.user.isDoctor) {
            [appointments] = await db.execute('SELECT * FROM Appointments WHERE doctor_id = ?', [req.session.user.id]);
        } else {
            [appointments] = await db.execute('SELECT * FROM Appointments WHERE patient_id = ?', [req.session.user.id]);
        }

        if (appointments.length === 0) {
            return res.status(404).json({ message: 'No appointments found' });
        }

        res.json(appointments);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// View a specific appointment by ID
router.get('/:id', authMiddleware, async (req, res) => {
    const { id } = req.params;

    try {
        const [appointment] = await db.execute('SELECT * FROM Appointments WHERE id = ?', [id]);

        if (appointment.length === 0) {
            return res.status(404).json({ message: 'Appointment not found' });
        }

        res.json(appointment[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update an appointment
router.put('/:id', authMiddleware, async (req, res) => {
    const { id } = req.params;
    const { appointment_date, reason, status } = req.body;

    try {
        const [existingAppointment] = await db.execute('SELECT * FROM Appointments WHERE id = ?', [id]);

        if (existingAppointment.length === 0) {
            return res.status(404).json({ message: 'Appointment not found' });
        }

        await db.execute('UPDATE Appointments SET appointment_date = ?, reason = ?, status = ? WHERE id = ?', 
            [appointment_date, reason, status, id]);

        res.json({ message: 'Appointment updated successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete an appointment
router.delete('/:id', authMiddleware, async (req, res) => {
    const { id } = req.params;

    try {
        const [existingAppointment] = await db.execute('SELECT * FROM Appointments WHERE id = ?', [id]);

        if (existingAppointment.length === 0) {
            return res.status(404).json({ message: 'Appointment not found' });
        }

        await db.execute('DELETE FROM Appointments WHERE id = ?', [id]);

        res.json({ message: 'Appointment deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
