document.addEventListener('DOMContentLoaded', function () {
    const contentDiv = document.getElementById('content');

    // Function to load the patient profile
    function loadAppointments() {
        fetch('/patients/appointments', {
            method: 'GET',
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);  // Debug the response data
            if (data.message) {
                alert(data.message);
            } else {
                displayAppointments(data);
            }
        })
        .catch(error => console.error('Error fetching profile:', error));
    }

   

// Function to display appointments
function displayAppointments(appointments) {
    contentDiv.innerHTML = '';  // Clear previous content
    appointments.forEach(appointment => {
        contentDiv.innerHTML += `
            <div class="card">
                <div class="card-header" style="background-color: #4CAF50; color: white; font-size: 1.5rem; text-align: center;">Appointment</div>
                <div class="card-body">
                    <table class="table table-bordered" style="width: 100%; background-color: #f9f9f9; border-collapse: collapse; margin: 20px 0;">
                        <tr style="background-color: #f2f2f2;">
                            <th style="padding: 10px; text-align: left; width: 30%;">Doctor ID</th>
                            <td style="padding: 10px;">${appointment.doctor_id}</td>
                        </tr>
                        <tr>
                            <th style="padding: 10px; text-align: left;">Appointment Date</th>
                            <td style="padding: 10px;">${appointment.appointment_date}</td>
                        </tr>
                        <tr>
                            <th style="padding: 10px; text-align: left;">Appointment ID</th>
                            <td style="padding: 10px;">${appointment.id}</td>
                        </tr>
                        <tr style="background-color: #f2f2f2;">
                            <th style="padding: 10px; text-align: left;">Appointment Time</th>
                            <td style="padding: 10px;">${appointment.appointment_time}</td>
                        </tr>
                        <tr>
                            <th style="padding: 10px; text-align: left;">Reason</th>
                            <td style="padding: 10px;">${appointment.reason}</td>
                        </tr>
                        <tr style="background-color: #f2f2f2;">
                            <th style="padding: 10px; text-align: left;">Status</th>
                            <td style="padding: 10px;">${appointment.status}</td>
                        </tr>
                    </table>
                    <div style="text-align: center; margin-top: 20px;">
                        <button class="btn btn-primary edit-btn" data-id="${appointment.id}" style="padding: 10px 20px;">Reschedule</button>
                        <button class="btn btn-primary cancel-btn" data-id="${appointment.id}" style="padding: 10px 20px;">Cancel</button>
                        <p></p>
                    </div>
                </div>
            </div>
        `;
    });

    // Add event listeners to all Reschedule buttons
    document.querySelectorAll('.edit-btn').forEach(button => {
        button.addEventListener('click', function () {
            const appointmentId = this.getAttribute('data-id');
            loadAppointmentsEditForm(appointmentId);
        });
    });

    // Add event listeners to all cancel buttons
    document.querySelectorAll('.cancel-btn').forEach(button => {
        button.addEventListener('click', function () {
            const appointmentId = this.getAttribute('data-id');
            loadAppointmentsCancelForm(appointmentId);
        });
    });
}


function loadAppointmentsEditForm(appointmentId) {
    fetch(`/patients/specific_appointments/${appointmentId}`, {
        method: 'GET',
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        contentDiv.innerHTML = `
            <div class="card">
                <div class="card-header">Edit Appointment</div>
                <div class="card-body">
                    <form id="appointmentForm">
                        <input type="date" id="appointment_date" class="form-control" value="${data.appointment_date}" required>
                        <input type="time" id="appointment_time" class="form-control" value="${data.appointment_time}" required>
                        <input type="text" id="reason" class="form-control" value="${data.reason}" required>
                        <input type="text" id="status" class="form-control" value="${data.status}" required readonly>
                        <input type="hidden" id="appointment_id" value="${data.id}">
                        <button type="submit" class="btn btn-success mt-3">Update Appointment</button>
                    </form>
                </div>
            </div>
        `;
        document.getElementById('appointmentForm').addEventListener('submit', updateAppointments);
    })
    .catch(error => console.error('Error fetching appointment data:', error));
}


////////////////// Appointment Cancel Form ///////////////////

function loadAppointmentsCancelForm(appointmentId) {
    fetch(`/patients/specific_appointments/${appointmentId}`, {
        method: 'GET',
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        contentDiv.innerHTML = `
            <div class="card">
                <div class="card-header">Cancel Appointment</div>
                <div class="card-body">
                    <form id="appointmentForm1">
                        <input type="date" id="appointment_date" class="form-control" value="${data.appointment_date}" required readonly>
                        <input type="time" id="appointment_time" class="form-control" value="${data.appointment_time}" required readonly>
                        <input type="text" id="reason" class="form-control" value="${data.reason}" required readonly>
                        <input type="text" id="status" class="form-control" value="${data.status}" required readonly>
                        <input type="hidden" id="appointment_id" value="${data.id}">
                        <button type="submit" class="btn btn-success mt-3">Cancel Appointment</button>
                    </form>
                </div>
            </div>
        `;
        document.getElementById('appointmentForm1').addEventListener('submit', cancelAppointments);
    })
    .catch(error => console.error('Error fetching appointment data:', error));
}

/////////////////////
/*
function loadAppointmentsEditForm(appointmentId) {
    fetch(`/patients/specific_appointments:id/${appointmentId}`, {
        method: 'GET',
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        contentDiv.innerHTML = `
            <div class="card">
                <div class="card-header">Edit Appointment</div>
                <div class="card-body">
                    <form id="appointmentForm">
                        <input type="date" id="appointment_date" class="form-control" value="${data.appointment_date}" required>
                        <input type="time" id="appointment_time" class="form-control" value="${data.appointment_time}" required>
                        <input type="text" id="reason" class="form-control" value="${data.reason}" required>
                        <input type="text" id="status" class="form-control" value="${data.status}" required>
                        <input type="hidden" id="appointment_id" value="${data.id}">
                        <button type="submit" class="btn btn-success mt-3">Update Appointment</button>
                    </form>
                </div>
            </div>
        `;
        document.getElementById('appointmentForm').addEventListener('submit', updateAppointments);
    })
    .catch(error => console.error('Error fetching appointment data:', error));
}

*/


////////////////////////////////

/*
    // Load the appointment edit form for a specific appointment
function loadAppointmentsEditForm(appointmentId) {
    fetch(`/patients/appointments/${appointmentId}`, {
        method: 'GET',
    })
    .then(response => response.json())
    .then(data => {
        contentDiv.innerHTML = `
            <div class="card">
                <div class="card-header">Edit Appointment</div>
                <div class="card-body">
                    <form id="appointmentForm">
                        <input type="date" id="appointment_date" class="form-control" value="${data.appointment_date}" required>
                        <input type="time" id="appointment_time" class="form-control" value="${data.appointment_time}" required>
                        <input type="text" id="reason" class="form-control" value="${data.reason}" required>
                        <input type="text" id="status" class="form-control" value="${data.status}" required>
                        <input type="hidden" id="appointment_id" value="${data.id}">
                        <button type="submit" class="btn btn-success mt-3">Update Appointment</button>
                    </form>
                </div>
            </div>
        `;
        document.getElementById('appointmentForm').addEventListener('submit', updateAppointments);
    })
    .catch(error => console.error('Error fetching appointment data:', error));
}

*/

////////////////////////////////////

    // Update profile form submission
    function updateAppointments(event) {
        event.preventDefault();

        const formData = {
            appointment_date: document.getElementById('appointment_date').value,
            appointment_time: document.getElementById('appointment_time').value,
            reason: document.getElementById('reason').value,
            status: document.getElementById('status').value,
            id: document.getElementById('appointment_id').value
        };

        fetch(`/patients/appointments/${formData.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('Appointment updated:', data);
            if (data.message) {
                alert(data.message);
                loadAppointments();  // Reload Appointment after successful update
            } else {
                alert('Error updating Appointment');
            }
        })
        .catch(error => console.error('Error updating Appointments:', error));
        
    }

    //////////////////Cancel Appointment Submission/////////////

     // Cancel form submission
     function cancelAppointments(event) {
        event.preventDefault();

        const formData = {
            //appointment_date: document.getElementById('appointment_date').value,
            //appointment_time: document.getElementById('appointment_time').value,
            //reason: document.getElementById('reason').value,
            //status: document.getElementById('status').value,
            id: document.getElementById('appointment_id').value
        };

        fetch(`/patients/appointments/cancel/${formData.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('Appointment Canceled:', data);
            if (data.message) {
                alert(data.message);
                loadAppointments();  // Reload Appointment after successful update
            } else {
                alert('Error Canceling Appointment');
            }
        })
        .catch(error => console.error('Error Canceling Appointments:', error));
        
    }

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

    

    // Load the initial profile view when the page loads
    loadAppointments();
});
 