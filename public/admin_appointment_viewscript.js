document.addEventListener('DOMContentLoaded', function () {
    const contentDiv = document.getElementById('content');

    // Function to load the patient profile
    function loadAppointments() {
        fetch('/admin/appointments', {
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
                        <tr style="background-color: #f2f2f2;">
                            <th style="padding: 10px; text-align: left; width: 30%;">Patient ID</th>
                            <td style="padding: 10px;">${appointment.patient_id}</td>
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
                    
                </div>
            </div>
        `;
    });

  
}

   
    // Logout function
    document.getElementById('logout').addEventListener('click', function () {
        fetch('/admin/logout', {
            method: 'POST'
        })
        .then(response => response.json())
        .then(data => {
            alert(data.message);
            window.location.href = 'http://localhost:3000/admin_login.html';  // Redirect to login page
        })
        .catch(error => console.error('Error logging out:', error));
    });


    

    // Load the initial profile view when the page loads
    loadAppointments();
});
 