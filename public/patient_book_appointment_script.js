document.addEventListener('DOMContentLoaded', function() {
    loadDoctors(); // Load doctors when the DOM is fully loaded

// Fetch available doctors and populate the select dropdown
async function loadDoctors() {
    try {
        const response = await fetch('/patients/doctors', {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token') // Add token if using JWT
            }
        });
        const doctors = await response.json();

        const doctorSelect = document.getElementById('doctor_id');
        doctors.forEach(doctor => {
            const option = document.createElement('option');
            option.value = doctor.id;
            option.text = `Dr. ${doctor.last_name} - ${doctor.specialization} -Availability: ${doctor.schedule}`;
            doctorSelect.appendChild(option);
        });
    } catch (err) {
        console.error('Error fetching doctors:', err);
    }
}

// Handle form submission with JavaScript
document.getElementById('appointmentForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const doctorId = document.getElementById('doctor_id').value;
    const appointmentDate = document.getElementById('appointment_date').value;
    const appointmentTime = document.getElementById('appointment_time').value;
    const reason = document.getElementById('reason').value;

    const response = await fetch('/patients/appointments', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('token') // assuming JWT for auth
        },
        body: JSON.stringify({
            doctor_id: doctorId,
            appointment_date: appointmentDate,
            appointment_time: appointmentTime,
            reason: reason
        })
    });

    const result = await response.json();

    if (response.ok) {
        document.getElementById('message').innerHTML = `<p class="success">Appointment booked successfully!</p>`;
    } else {
        document.getElementById('message').innerHTML = `<p class="error">Error: ${result.error}</p>`;
    }
});

// Load doctors on page load
document.addEventListener('DOMContentLoaded', loadDoctors);

});


// Logout function
document.getElementById('logout').addEventListener('click', function () {
    fetch('/patients/logout', {
        method: 'POST'
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
        window.location.href = 'http://localhost:3000/login.html';  // Redirect to login page
    })
    .catch(error => console.error('Error logging out:', error));
});