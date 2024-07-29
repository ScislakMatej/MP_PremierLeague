document.addEventListener('DOMContentLoaded', function() {
    const userProfile = document.getElementById('user-profile');
    const loginContainer = document.getElementById('login_container');
    const welcomeContainer = document.getElementById('welcome_container');
    const userNameSpan = document.getElementById('user-name');
    const profilePic = document.getElementById('profile-pic');
    const welcomeText = document.getElementById('welcome_text');

    function updateProfile(data) {
        if (!userProfile || !loginContainer || !welcomeContainer || !userNameSpan || !profilePic || !welcomeText) {
            console.error('One or more elements are missing in updateProfile');
            return;
        }

        if (data.success && data.user) {
            userProfile.style.display = 'flex';
            loginContainer.style.display = 'none';
            welcomeContainer.style.display = 'block';
            userNameSpan.textContent = data.user.name;
            welcomeText.textContent = `Vitaj ${data.user.name}!`;
            
            profilePic.src = data.user.profilePic;
            profilePic.style.display = 'block';
        } else {
            userProfile.style.display = 'none';
            loginContainer.style.display = 'block';
            welcomeContainer.style.display = 'none';
        }
    }

    fetch('/login/status', { method: 'GET', credentials: 'include' })
      .then(response => response.json())
      .then(updateProfile)
      .catch(error => {
        console.error('Error:', error);
      });
});
