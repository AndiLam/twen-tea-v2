document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const errorMessage = document.getElementById('errorMessage');
    
            const validEmail = 'team20.jayapura@gmail.com';
            const validPassword = 'jaya20x';
    
            if (email === validEmail && password === validPassword) {
                alert('Login successful');
                // Menyimpan status login di sessionStorage
                sessionStorage.setItem('isLoggedIn', 'true');
                window.location.href = '../main/dashboard.html';
            } else {
                errorMessage.style.display = 'block';
            }
        });
    }
});