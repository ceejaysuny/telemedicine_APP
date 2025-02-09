document.addEventListener('DOMContentLoaded', function () {
    const contentDiv = document.getElementById('content');

    // Function to load the patient profile
    function loadProfile() {
        fetch('/patients/profile', {
            method: 'GET',
        })
        .then(response => response.json())
        .then(data => {
            if (data.message) {
                alert(data.message);
            } else {
                displayProfile(data);
            }
        })
        .catch(error => console.error('Error fetching profile:', error));
    }

    /*
    // Function to display the patient profile
    function displayProfile(profile) {
        contentDiv.innerHTML = `
            <div class="card">
                <div class="card-header">Patient Profile</div>
                <div class="card-body">
                    <p><strong>Name:</strong> ${profile.first_name} ${profile.last_name}</p>
                    <p><strong>Email:</strong> ${profile.email}</p>
                    <p><strong>Phone:</strong> ${profile.phone}</p>
                    <p><strong>Date of Birth:</strong> ${profile.date_of_birth}</p>
                    <p><strong>Gender:</strong> ${profile.gender}</p>
                    <p><strong>Address:</strong> ${profile.address}</p>
                    <button class="btn btn-primary" id="editProfile">Edit Profile</button>
                </div>
            </div>
        `;

        document.getElementById('editProfile').addEventListener('click', loadProfileEditForm);
    }
        */
  // Function to display the patient profile
function displayProfile(profile) {
    contentDiv.innerHTML = `
        <div class="card">
            <div class="card-header" style="background-color: #4CAF50; color: white; font-size: 1.5rem; text-align: center;">Patient Profile</div>
            <div class="card-body">
                <table class="table table-bordered" style="width: 100%; background-color: #f9f9f9; border-collapse: collapse; margin: 20px 0;">
                    <tr style="background-color: #f2f2f2;">
                        <th style="padding: 10px; text-align: left; width: 30%;">Name</th>
                        <td style="padding: 10px;">${profile.first_name} ${profile.last_name}</td>
                    </tr>
                    <tr>
                        <th style="padding: 10px; text-align: left;">Email</th>
                        <td style="padding: 10px;">${profile.email}</td>
                    </tr>
                    <tr style="background-color: #f2f2f2;">
                        <th style="padding: 10px; text-align: left;">Phone</th>
                        <td style="padding: 10px;">${profile.phone}</td>
                    </tr>
                    <tr>
                        <th style="padding: 10px; text-align: left;">Date of Birth</th>
                        <td style="padding: 10px;">${profile.date_of_birth}</td>
                    </tr>
                    <tr style="background-color: #f2f2f2;">
                        <th style="padding: 10px; text-align: left;">Gender</th>
                        <td style="padding: 10px;">${profile.gender}</td>
                    </tr>
                    <tr>
                        <th style="padding: 10px; text-align: left;">Address</th>
                        <td style="padding: 10px;">${profile.address}</td>
                    </tr>
                </table>
                <div style="text-align: center; margin-top: 20px;">
                    <button class="btn btn-primary" id="editProfile" style="padding: 10px 20px;">Edit Profile</button>
                </div>
            </div>
        </div>
    `;

    document.getElementById('editProfile').addEventListener('click', loadProfileEditForm);
}


    // Load the profile edit form
    function loadProfileEditForm() {
        fetch('/patients/profile', {
            method: 'GET',
        })
        .then(response => response.json())
        .then(data => {
            contentDiv.innerHTML = `
                <div class="card">
                    <div class="card-header">Edit Profile</div>
                    <div class="card-body">
                        <form id="profileForm">
                            <input type="text" id="first_name" class="form-control" placeholder="First Name" value="${data.first_name}" required>
                            <input type="text" id="last_name" class="form-control" placeholder="Last Name" value="${data.last_name}" required>
                            <input type="text" id="phone" class="form-control" placeholder="Phone" value="${data.phone}" required>
                            <input type="date" id="date_of_birth" class="form-control" value="${data.date_of_birth}" required>
                            <input type="text" id="address" class="form-control" placeholder="Address" value="${data.address}" required>
                            <button type="submit" class="btn btn-success mt-3">Update Profile</button>
                        </form>
                    </div>
                </div>
            `;
            document.getElementById('profileForm').addEventListener('submit', updateProfile);
        });
    }

    // Update profile form submission
    function updateProfile(event) {
        event.preventDefault();

        const formData = {
            first_name: document.getElementById('first_name').value,
            last_name: document.getElementById('last_name').value,
            phone: document.getElementById('phone').value,
            date_of_birth: document.getElementById('date_of_birth').value,
            address: document.getElementById('address').value
        };

        fetch('/patients/profile', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
        .then(response => response.json())
        .then(data => {
            if (data.message) {
                alert(data.message);
                loadProfile();  // Reload profile after successful update
            } else {
                alert('Error updating profile');
            }
        })
        .catch(error => console.error('Error updating profile:', error));
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

    // Delete account
    document.getElementById('deleteAccount').addEventListener('click', function () {
        if (confirm('Are you sure you want to delete your account?')) {
            fetch('/patients/profile', {
                method: 'DELETE'
            })
            .then(response => response.json())
            .then(data => {
                alert(data.message);
                window.location.href = '/login';  // Redirect to login page after deletion
            })
            .catch(error => console.error('Error deleting account:', error));
        }
    });

    // Load the initial profile view when the page loads
    loadProfile();
});
