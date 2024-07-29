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

  const profilePics = {
    Patres: 'images/buni_karticka.jpg',
    Matelko: 'images/matelko.jpeg',
    Kiko: 'images/kiko.jpeg',
  };

  function getProfilePic(username) {
    return profilePics[username] || '';
  }

  function checkElements() {
    if (!userProfile || !loginContainer || !welcomeContainer || !userNameSpan || !welcomeText || !profilePic) {
        console.error('One or more elements are missing');
        return false;
    }
    return true;
  }

  function updateUserProfile(data) {
    if (!userProfile) {
      console.error('userProfile element is missing');
      return;
    }
    userProfile.style.display = data.success ? 'flex' : 'none';
  }

  function updateLoginContainer(data) {
    if (!loginContainer) {
      console.error('loginContainer element is missing');
      return;
    }
    loginContainer.style.display = data.success ? 'none' : 'block';
  }

  function updateWelcomeContainer(data) {
    if (!welcomeContainer) {
      console.error('welcomeContainer element is missing');
      return;
    }
    welcomeContainer.style.display = data.success ? 'block' : 'none';
  }

  function updateUserNameSpan(data) {
    if (!userNameSpan) {
      console.error('userNameSpan element is missing');
      return;
    }
    userNameSpan.textContent = data.success ? data.user.name : '';
  }

  function updateProfilePic(data) {
    if (!profilePic) {
      console.error('profilePic element is missing');
      return;
    }
    if (data.user && data.user.name) {
      const profilePicUrl = getProfilePic(data.user.name);
      if (profilePicUrl) {
        profilePic.src = profilePicUrl;
        profilePic.style.display = 'block';
      } else {
        profilePic.style.display = 'none';
      }
    } else {
      profilePic.style.display = 'none';
    }
  }

  function updateProfile(data) {
    console.log('Update Profile Data:', data); // Debugging output

    if (!checkElements()) {
      return;
    }
    updateUserProfile(data);
    updateLoginContainer(data);
    updateWelcomeContainer(data);
    updateUserNameSpan(data);
    updateProfilePic(data);
    
    if (data.success) {
      if (data.user) {
        welcomeText.textContent = `Vitaj ${data.user.name}!`;
        errorMessage.innerText = ''; // Clear error message on successful profile update
      } else {
        console.error('User data is missing in response');
        errorMessage.innerText = 'Profile update failed: User data is missing';
      }
    } else {
      errorMessage.innerText = data.message || 'Profile update failed';
    }
  }

  function checkLoginStatus() {
    fetch('/login/status', { method: 'GET', credentials: 'include' })
      .then(response => response.json())
      .then(data => {
        updateProfile(data);
      })
      .catch(error => {
        console.error('Error:', error);
        errorMessage.innerText = 'Chyba pri komunikácii so serverom.';
      });
  }

  if (loginForm) {
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
          const profilePicUrl = getProfilePic(username);
          localStorage.setItem('profilePic', profilePicUrl);
          errorMessage.innerText = ''; // Clear error message on successful login
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
  } else {
    console.error('Login form element is missing');
  }

  if (logoutBtn) {
    logoutBtn.addEventListener('click', function() {
      fetch('/logout', { method: 'POST', credentials: 'include' })
        .then(response => response.json())
        .then(data => {
          if (data.success) {
            localStorage.removeItem('username');
            localStorage.removeItem('profilePic');
            updateProfile({ success: false });
          } else {
            errorMessage.innerText = 'Chyba pri odhlasovaní.';
          }
        })
        .catch(error => {
          console.error('Error:', error);
          errorMessage.innerText = 'Chyba pri komunikácii so serverom.';
        });
    });
  } else {
    console.error('Logout button element is missing');
  }

  checkLoginStatus(); // Inicializácia stavu prihlásenia pri načítaní stránky
});
