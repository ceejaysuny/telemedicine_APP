document.addEventListener('DOMContentLoaded', function () {
    const contentDiv = document.getElementById('content');

    // Function to load the patient profile
    function loadPatinets() {
        fetch('/admin/patients', {
            method: 'GET',
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);  // Debug the response data
            if (data.message) {
                alert(data.message);
            } else {
                displayPatients(data);
            }
        })
        .catch(error => console.error('Error fetching profile:', error));
    }

   

// Function to display appointments
function displayPatients(patients) {
    contentDiv.innerHTML = '';  // Clear previous content
    patients.forEach(patients => {
        contentDiv.innerHTML += `
            <div class="card">
                <div class="card-header" style="background-color: #4CAF50; color: white; font-size: 1.5rem; text-align: center;">All Registered Patients</div>
                <div class="card-body">
                    <table class="table table-bordered" style="width: 100%; background-color: #f9f9f9; border-collapse: collapse; margin: 20px 0;">
                        <tr style="background-color: #f2f2f2;">
                            <th style="padding: 10px; text-align: left; width: 30%;">Patient ID</th>
                            <td style="padding: 10px;">${patients.id}</td>
                        </tr>
                        <tr>
                            <th style="padding: 10px; text-align: left;">Names</th>
                            <td style="padding: 10px;">${patients.first_name} ${patients.last_name}</td>
                        </tr>
                        <tr>
                            <th style="padding: 10px; text-align: left;">Email</th>
                            <td style="padding: 10px;">${patients.email}</td>
                        </tr>
                        <tr style="background-color: #f2f2f2;">
                            <th style="padding: 10px; text-align: left;">Phone</th>
                            <td style="padding: 10px;">${patients.phone}</td>
                        </tr>
                        <tr>
                            <th style="padding: 10px; text-align: left;">DoB</th>
                            <td style="padding: 10px;">${patients.date_of_birth}</td>
                        </tr>
                        <tr style="background-color: #f2f2f2;">
                            <th style="padding: 10px; text-align: left;">Gender</th>
                            <td style="padding: 10px;">${patients.gender}</td>
                        </tr>

                        <tr>
                            <th style="padding: 10px; text-align: left;">Address</th>
                            <td style="padding: 10px;">${patients.address}</td>
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
    loadPatinets();
});
 