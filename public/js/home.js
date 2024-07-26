document.addEventListener('DOMContentLoaded', function() {
  const userProfile = document.getElementById('user-profile');
  const loginForm = document.getElementById('login-form');
  const logoutBtn = document.getElementById('logout');
  const errorMessage = document.getElementById('error-message');
  const userNameSpan = document.getElementById('user-name');
  const loginContainer = document.getElementById('login_container');
  const welcomeContainer = document.getElementById('welcome_container');
  const welcomeText = document.getElementById('welcome_text');
  const profilePic = document.getElementById('profile-pic');

  function updateProfile(data) {
    if (data.success && data.user) {
      userProfile.style.display = 'flex';
      loginContainer.style.display = 'none';
      welcomeContainer.style.display = 'block';
      userNameSpan.textContent = data.user.name;
      welcomeText.textContent = `Vitaj ${data.user.name}!`;
      if (data.user.profilePic) {
        profilePic.src = data.user.profilePic;
        profilePic.style.display = 'block';
      } else {
        profilePic.style.display = 'none';
      }
    } else {
      userProfile.style.display = 'none';
      loginContainer.style.display = 'block';
      welcomeContainer.style.display = 'none';
    }
  }

  function checkLoginStatus() {
    fetch('/login/status', { method: 'GET', credentials: 'include' })
      .then(response => response.json())
      .then(updateProfile)
      .catch(error => {
        console.error('Error:', error);
      });
  }

  function initializeUserProfile() {
    const storedUserName = localStorage.getItem('username');
    const storedProfilePic = localStorage.getItem('profilePic');
    if (storedUserName) {
      userProfile.style.display = 'flex';
      loginContainer.style.display = 'none';
      welcomeContainer.style.display = 'block';
      userNameSpan.textContent = storedUserName;
      if (storedProfilePic) {
        profilePic.src = storedProfilePic;
        profilePic.style.display = 'block';
      }
    } else {
      userProfile.style.display = 'none';
      loginContainer.style.display = 'block';
      welcomeContainer.style.display = 'none';
    }
  }

  // Inicializovať status prihlásenia pri načítaní
  checkLoginStatus();

  // Funkcia na odhlásenie
  if (logoutBtn) {
    logoutBtn.addEventListener('click', function() {
      fetch('/logout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
      })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          localStorage.removeItem('username');
          localStorage.removeItem('profilePic');
          window.location.href = '/home.html';
        } else {
          console.error('Logout failed:', data.message);
        }
      })
      .catch(error => {
        console.error('Error:', error);
      });
    });
  }

  // Formulár na prihlásenie
  loginForm.addEventListener('submit', function(event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    fetch('/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
      credentials: 'include'
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        localStorage.setItem('username', username);
        localStorage.setItem('profilePic', data.user.profilePic);
        checkLoginStatus();
      } else {
        errorMessage.innerText = data.message || 'Nesprávne meno alebo heslo';
      }
    })
    .catch(error => {
      console.error('Error:', error);
      errorMessage.innerText = 'Chyba pri komunikácii so serverom.';
    });
  });
});
