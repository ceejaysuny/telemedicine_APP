document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');

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

    // Handle form submission for login
    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault(); // Prevent default form submission

        const email = document.getElementById('loginEmail').value.trim();
        const password = document.getElementById('loginPassword').value.trim();

        // Simple client-side validation
        if (email === '' || password === '') {
            showError(document.getElementById('loginEmail'), 'Email is required.');
            showError(document.getElementById('loginPassword'), 'Password is required.');
            return;
        }

        try {
            // Send login data to the server
            const response = await fetch('/patients/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const result = await response.json();

            if (response.status === 200) {
                //alert('Login successful!');
                // Redirect to a dashboard or another page if necessary
                window.location.href = 'http://localhost:3000/patient_dashboard.html';  // Change this to the correct path
            } else {
                showError(document.getElementById('loginEmail'), result.message || 'Invalid login credentials');
            }
        } catch (error) {
            console.error('Error during login:', error);
            alert('An error occurred during login. Please try again.');
        }
    });
});
