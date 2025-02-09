document.addEventListener('DOMContentLoaded', function () {
    const contentDiv = document.getElementById('content');

    // Function to load List of Doctors
    function loadDoctors() {
        fetch('/admin/doctors', {
            method: 'GET',
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);  // Debug the response data
            if (data.message) {
                alert(data.message);
            } else {
                displayDoctors(data);
            }
        })
        .catch(error => console.error('Error fetching Doctors:', error));
    }

   

// Function to display Doctors
function displayDoctors(doctors) {
    contentDiv.innerHTML = '';  // Clear previous content
    doctors.forEach(doctors => {
        contentDiv.innerHTML += `
            <div class="card">
                <div class="card-header" style="background-color: #4CAF50; color: white; font-size: 1.5rem; text-align: center;">Doctors</div>
                <div class="card-body">
                    <table class="table table-bordered" style="width: 100%; background-color: #f9f9f9; border-collapse: collapse; margin: 20px 0;">
                        <tr style="background-color: #f2f2f2;">
                            <th style="padding: 10px; text-align: left; width: 30%;">Doctor ID</th>
                            <td style="padding: 10px;">${doctors.id}</td>
                        </tr>
                        <tr>
                            <th style="padding: 10px; text-align: left;">Names</th>
                            <td style="padding: 10px;">${doctors.first_name} ${doctors.last_name}</td>
                        </tr>
                        
                        <tr style="background-color: #f2f2f2;">
                            <th style="padding: 10px; text-align: left;">Specialization</th>
                            <td style="padding: 10px;">${doctors.specialization}</td>
                        </tr>
                        <tr>
                            <th style="padding: 10px; text-align: left;">Phone</th>
                            <td style="padding: 10px;">${doctors.phone}</td>
                        </tr>
                        <tr style="background-color: #f2f2f2;">
                            <th style="padding: 10px; text-align: left;">Schedule</th>
                            <td style="padding: 10px;">${doctors.schedule}</td>
                        </tr>
                    </table>
                    <div style="text-align: center; margin-top: 20px;">
                        <button class="btn btn-primary edit-btn" data-id="${doctors.id}" style="padding: 10px 20px;">Update</button>
                        <button class="btn btn-primary delete-btn" data-id="${doctors.id}" style="padding: 10px 20px;">Delete</button>
						<p></p>
                        
                    </div>
                </div>
            </div>
        `;
    });

    // Add event listeners to all Update buttons
    document.querySelectorAll('.edit-btn').forEach(button => {
        button.addEventListener('click', function () {
            const doctorId = this.getAttribute('data-id');
            loadDoctorsEditForm(doctorId);
        });
    });

    // Add event listeners to all delete buttons
    document.querySelectorAll('.delete-btn').forEach(button => {
        button.addEventListener('click', function () {
            const doctorId = this.getAttribute('data-id');
            loadDoctorsDeleteForm(doctorId);
        });
    });
}


function loadDoctorsEditForm(doctorId) {
    fetch(`/admin/specific_doctors/${doctorId}`, {
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
                <div class="card-header">Update Doctor</div>
                <div class="card-body">
                    <form id="doctorForm">
                        <input type="text" id="first_name" class="form-control" value="${data.first_name}" required>
                        <input type="text" id="last_name" class="form-control" value="${data.last_name}" required>
                        <input type="text" id="specialization" class="form-control" value="${data.specialization}" required>
                        <input type="tel" id="phone" class="form-control" value="${data.phone}" required>
                        <input type="text" id="schedule" class="form-control" value="${data.schedule}" required>
                        <input type="hidden" id="doctor_id" value="${data.id}">
                        
                        <button type="submit" class="btn btn-success mt-3">Update Doctor</button>
                    </form>
                </div>
            </div>
        `;
        document.getElementById('doctorForm').addEventListener('submit', updateDoctors);
    })
    .catch(error => console.error('Error fetching doctor data:', error));
}


////////////////// Doctor Delete Form ///////////////////

function loadDoctorsDeleteForm(doctorId) {
    fetch(`/admin/specific_doctors/${doctorId}`, {
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
                <div class="card-header">Delete Doctor</div>
                <div class="card-body">
                    <form id="doctorForm1">
                        <input type="text" id="first_name" class="form-control" value="${data.first_name}" required readonly>
                        <input type="text" id="last_name" class="form-control" value="${data.last_name}" required readonly>
                        <input type="text" id="specialization" class="form-control" value="${data.specialization}" required readonly>
                        <input type="tel" id="phone" class="form-control" value="${data.phone}" required readonly>
                        <input type="text" id="schedule" class="form-control" value="${data.schedule}" required readonly>
                        <input type="hidden" id="doctor_id" value="${data.id}">                        
                        <button type="submit" class="btn btn-success mt-3">Delete Doctor</button>
                    </form>
                </div>
            </div>
        `;
        document.getElementById('doctorForm1').addEventListener('submit', deleteDoctor);
    })
    .catch(error => console.error('Error fetching doctor data:', error));
}

////////////////////////////////////

    // Update Doctors form submission
    function updateDoctors(event) {
        event.preventDefault();

        const formData = {
            first_name: document.getElementById('first_name').value,
            last_name: document.getElementById('last_name').value,
            specialization: document.getElementById('specialization').value,
            phone: document.getElementById('phone').value,
            schedule: document.getElementById('schedule').value,
            id: document.getElementById('doctor_id').value
        };

        fetch(`/admin/doctors/${formData.id}`, {
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
            console.log('Doctor updated:', data);
            if (data.message) {
                alert(data.message);
                loadDoctors();  // Reload Doctors after successful update
            } else {
                alert('Error updating doctor');
            }
        })
        .catch(error => console.error('Error updating Doctor:', error));
        
    }

    //////////////////Delete Doctor Submission/////////////

     // Delete form submission
     function deleteDoctor(event) {
        event.preventDefault();

        const formData = {
            //appointment_date: document.getElementById('appointment_date').value,
            //appointment_time: document.getElementById('appointment_time').value,
            //reason: document.getElementById('reason').value,
            //status: document.getElementById('status').value,
            id: document.getElementById('doctor_id').value
        };

        fetch(`/admin/delete/doctors/${formData.id}`, {
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
            console.log('Doctor Deleted:', data);
            if (data.message) {
                alert(data.message);
                loadDoctors();  // Reload doctor list after successful update
            } else {
                alert('Error Deleting Doctor');
            }
        })
        .catch(error => console.error('Error Deleting Doctors:', error));
        
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

    

    // Load the initial doctor list when the page loads
    loadDoctors();
});
 