document.addEventListener('DOMContentLoaded', function() {
    const userProfile = document.getElementById('user-profile');
    const user = document.getElementById('user-name'); // Nový element
    const profilePic = document.getElementById('profile-pic');
    const logoutBtn = document.getElementById('logout');
    
    function updateProfile(data) {
        if (data.success && data.user) {
            userProfile.style.display = 'flex';
            userNameSpan.textContent = data.user.name; // Nastaviť meno používateľa
            profilePic.src = data.user.profilePic;
        } else {
            userProfile.style.display = 'none';
        }
    }
    
    function checkLoginStatus() {
        fetch('/login/status')
            .then(response => response.json())
            .then(updateProfile)
            .catch(error => {
                console.error('Error:', error);
            });
    }

    // Inicializovať status prihlásenia pri načítaní
    checkLoginStatus();
    
    // Funkcia na odhlásenie
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            fetch('/logout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    localStorage.removeItem('username');
                 //   localStorage.removeItem('userName');
                    localStorage.removeItem('profilePic');
                    window.location.href = '/home.html'; // Presmerovanie na domovskú stránku
                } else {
                    console.error('Logout failed:', data.message);
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
        });
    }
});
