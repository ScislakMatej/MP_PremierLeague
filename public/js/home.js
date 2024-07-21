document.addEventListener('DOMContentLoaded', function() {
    const userProfile = document.getElementById('user-profile');
    const loginForm = document.getElementById('login-form');
    const logoutBtn = document.getElementById('logout');
    const errorMessage = document.getElementById('error-message');
    const userNameSpan = document.getElementById('user-name'); // Nový element
    const profilePic = document.getElementById('profile-pic');
    
    function checkLoginStatus() {
      fetch('/login/status')
        .then(response => response.json())
        .then(data => {
          if (data.success && data.user) {
            userProfile.style.display = 'flex';
            loginForm.style.display = 'none'; // Skryť formulár na prihlásenie
            userNameSpan.textContent = data.user.name; // Nastaviť meno používateľa
            profilePic.src = data.user.profilePic;
          } else {
            userProfile.style.display = 'none';
            loginForm.style.display = 'block'; // Zobraziť formulár na prihlásenie
          }
        })
        .catch(error => {
          console.error('Error:', error);
        });
    }
    
    // Inicializovať status prihlásenia pri načítaní
    checkLoginStatus();
    
    // Funkcia na odhlásenie
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
          localStorage.removeItem('userName');
          localStorage.removeItem('profilePic');
          window.location.href = 'home.html'; // Presmerovanie na domovskú stránku
        } else {
          console.error('Logout failed:', data.message);
        }
      })
      .catch(error => {
        console.error('Error:', error);
      });
    });
    
    // Formulár na prihlásenie
    document.getElementById('login-form').addEventListener('submit', function(event) {
      event.preventDefault();
      const username = document.getElementById('username').value;
      const password = document.getElementById('password').value;
    
      fetch('/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          localStorage.setItem('username', username);
          localStorage.setItem('userName', data.user.name);
          localStorage.setItem('profilePic', data.user.profilePic);
          checkLoginStatus(); // Aktualizovať stav prihlásenia
        } else {
          errorMessage.innerText = data.message || 'Nesprávne meno alebo heslo';
        }
      })
      .catch(error => {
        console.error('Error:', error);
        errorMessage.innerText = 'Chyba pri komunikácii so serverom.';
      });
    });
    
    // Pridať event listener pre kliknutie na profilový obrázok
    profilePic.addEventListener('click', () => {
      const dropdownMenu = document.querySelector('.dropdown-menu');
      dropdownMenu.classList.toggle('hidden');
    });
    
  });
  