document.addEventListener('DOMContentLoaded', function() {
    
    const registrationForm = document.getElementById('registrationForm');
    //const summaryDiv = document.getElementById('summary');

    // Helper function to show error
    function showError(input, message) {
        const errorDiv = input.parentElement.querySelector('.error');
        errorDiv.textContent = message;
        errorDiv.style.opacity = 1;
    }

    // Helper function to clear error
    function clearError(input) {
        const errorDiv = input.parentElement.querySelector('.error');
        errorDiv.textContent = '';
        errorDiv.style.opacity = 0;
    }

    // Function to validate and return form data object
    function captureFormData() {
        const formData = {
            first_name: document.getElementById('first_name').value.trim(),
            last_name: document.getElementById('last_name').value.trim(),
            email: document.getElementById('email').value.trim(),
            password: document.getElementById('password').value,
            confirmPassword: document.getElementById('confirmPassword').value,
            phone: document.getElementById('phone').value,
            specialization: document.getElementById('specialization').value,
            license_number: document.getElementById('license_number').value,
            address: document.getElementById('address').value,
            schedule: document.getElementById('schedule').value,
            
        };
        return formData;
    }

    // Function to display form data in the summary section
    function displayFormData(data) {
        const summaryDiv = document.getElementById('summary');
        summaryDiv.innerHTML = `
            <strong>First Name:</strong> ${data.first_name} <br>
            <strong>Last Name:</strong> ${data.last_name} <br>
            <strong>Email:</strong> ${data.email} <br>
            <strong>Phone:</strong> ${data.phone || 'N/A'} <br>
            <strong>Specialization:</strong> ${data.specialization} <br>
            <strong>License_number:</strong> ${data.license_number} <br>
            <strong>Address:</strong> ${data.address} <br>
            <strong>Schedule:</strong> ${data.schedule} <br>
            
        `;
    }

    // Validation functions
    function validateFirstName() {
        const firstName = document.getElementById('first_name');
        if (firstName.value.trim() === '') {
            showError(firstName, 'First name is required.');
        } else {
            clearError(firstName);
        }
    }

    function validateLastName() {
        const lastName = document.getElementById('last_name');
        if (lastName.value.trim() === '') {
            showError(lastName, 'Last name is required.');
        } else {
            clearError(lastName);
        }
    }

    function validateEmail() {
        const email = document.getElementById('email');
        const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        
        if (email.value.trim() === '') {
            showError(email, 'Email is required.');
        } else if (!emailPattern.test(email.value)) {
            showError(email, 'Invalid email format.');
        } else {
            clearError(email);
        }
    }

    function validatePhone() {
        const phone = document.getElementById('phone');
        const phonePattern = /^[0-9]{10,15}$/;
        if (!phonePattern.test(phone.value)) {
            showError(phone, 'Please enter a valid phone number (10-15 digits).');
        } else {
            clearError(phone);
        }
    }

  
    // Function to validate password field
    function validatePassword() {
        const password = document.getElementById('password');
        if (password.value.length < 8) {
            showError(password, 'Password must be at least 8 characters long.');
        } else {
            clearError(password);
        }
    }

    // Function to validate confirm password matches the password
    function validateConfirmPassword() {
        const password = document.getElementById('password');
        const confirmPassword = document.getElementById('confirmPassword');
        if (confirmPassword.value !== password.value) {
            showError(confirmPassword, 'Passwords do not match.');
        } else {
            clearError(confirmPassword);
        }
    }

  
    function validateAddress() {
        const address = document.getElementById('address');
        if (address.value.trim() === '') {
            showError(address, 'Address is required.');
        } else {
            clearError(address);
        }
    }

    function validateLicense_number() {
        const license_number = document.getElementById('license_number');
        if (license_number.value.trim() === '') {
            showError(license_number, 'license_number is required.');
        } else {
            clearError(license_number);
        }
    }

    function validateSpecialization() {
        const specialization = document.getElementById('specialization');
        if (specialization.value.trim() === '') {
            showError(specialization, 'Specialization is required.');
        } else {
            clearError(specialization);
        }
    }


    function validateSchedule() {
        const schedule = document.getElementById('schedule');
        if (schedule.value.trim() === '') {
            showError(schedule, 'Schedule is required.');
        } else {
            clearError(schedule);
        }
    }

 

    

    // Attach real-time validation to fields
    document.getElementById('first_name').addEventListener('input', validateFirstName);
    document.getElementById('last_name').addEventListener('input', validateLastName);
    document.getElementById('email').addEventListener('input', validateEmail);
    document.getElementById('phone').addEventListener('input', validatePhone);    
    document.getElementById('password').addEventListener('input', validatePassword);  // Real-time validation for password
    document.getElementById('confirmPassword').addEventListener('input', validateConfirmPassword);  // Real-time validation for confirm password
    document.getElementById('address').addEventListener('input', validateAddress);
    document.getElementById('license_number').addEventListener('input', validateLicense_number);
    document.getElementById('specialization').addEventListener('input', validateSpecialization)
    document.getElementById('schedule').addEventListener('input', validateSchedule)
    
    

    // Handle form submission
    registrationForm.addEventListener('submit', async (event) => {
        event.preventDefault(); 

        validateFirstName();
        validateLastName();
        validateEmail();
        validatePassword();  // Validate password on form submit
        validateConfirmPassword();  // Validate confirm password on form submit
        validatePhone();
        validateAddress()
        validateLicense_number()
        validateSpecialization()
        validateSchedule()
        

        // Check if there are no errors
        const errors = document.querySelectorAll('.error');
        let formValid = true;
        errors.forEach(error => {
            if (error.textContent !== '') {
                formValid = false;
            }
        });

        if (formValid) {
            const formData = captureFormData();
            displayFormData(formData);  // Display form data after validation

            // Send form data to the server
            try {
                const response = await fetch('/doctors/register/doctors', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData),
                });

                const result = await response.json();
                if (response.status === 201) {
                    alert('Registration successful!');
                    document.getElementById('registrationForm').reset(); // Reset form
                } else {
                    alert(result.message || 'Error registering patient');
                }
            } catch (error) {
                console.error('Error:', error);
                alert('An error occurred during registration');
            }
        }
    });

});
